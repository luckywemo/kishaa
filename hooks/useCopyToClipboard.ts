import { useState } from 'react'
import { copyToClipboard } from '../utils/formatting'
import toast from 'react-hot-toast'

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)

  const copy = async (text: string, successMessage = 'Copied to clipboard!') => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopied(true)
      toast.success(successMessage)
      setTimeout(() => setCopied(false), 2000)
    } else {
      toast.error('Failed to copy to clipboard')
    }
    return success
  }

  return { copy, copied }
}

