/**
 * Export transaction data to CSV
 */

export interface ExportableTransaction {
  hash: string
  type: string
  from: string
  to?: string
  amount?: string
  token?: string
  timestamp: number
  status: string
  gasUsed?: string
  gasPrice?: string
}

/**
 * Convert transactions to CSV format
 */
export function transactionsToCSV(transactions: ExportableTransaction[]): string {
  const headers = ['Hash', 'Type', 'From', 'To', 'Amount', 'Token', 'Date', 'Status', 'Gas Used', 'Gas Price']
  
  const rows = transactions.map(tx => [
    tx.hash,
    tx.type,
    tx.from,
    tx.to || '',
    tx.amount || '',
    tx.token || '',
    new Date(tx.timestamp).toISOString(),
    tx.status,
    tx.gasUsed || '',
    tx.gasPrice || '',
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n')

  return csvContent
}

/**
 * Download transactions as CSV file
 */
export function downloadTransactionsCSV(transactions: ExportableTransaction[], filename = 'transactions.csv'): void {
  const csv = transactionsToCSV(transactions)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export portfolio data to JSON
 */
export interface PortfolioData {
  address: string
  totalValue: number
  assets: Array<{
    symbol: string
    name: string
    balance: string
    value: number
    address?: string
  }>
  timestamp: number
}

export function downloadPortfolioJSON(portfolio: PortfolioData, filename = 'portfolio.json'): void {
  const json = JSON.stringify(portfolio, null, 2)
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

