import { useState } from 'react'
import { copyToClipboard } from '../utils/formatting'
import toast from 'react-hot-toast'

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
}

export default function CopyButton({ text, label, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } else {
      toast.error('Failed to copy')
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`copy-button ${className}`}
      title="Copy to clipboard"
    >
      {copied ? '✓ Copied' : label || '📋 Copy'}
    </button>
  )
}

