import { useState, useEffect } from 'react'
import { useGasPrice, useChainId } from 'wagmi'
import { formatEther } from 'viem'

export function useGasEstimate(estimatedGas?: bigint) {
  const { data: gasPrice } = useGasPrice()
  const chainId = useChainId()
  const [gasCost, setGasCost] = useState<string>('0')

  useEffect(() => {
    if (gasPrice && estimatedGas) {
      const cost = gasPrice * estimatedGas
      const costInEth = parseFloat(formatEther(cost))
      setGasCost(costInEth.toFixed(6))
    } else {
      setGasCost('0')
    }
  }, [gasPrice, estimatedGas])

  return {
    gasPrice,
    estimatedGas,
    gasCost,
    formattedGasCost: gasCost !== '0' ? `${gasCost} ETH` : 'Calculating...',
  }
}

