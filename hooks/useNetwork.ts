import { useChainId, useSwitchChain } from 'wagmi'
import { isSupportedChain, getChainName } from '../utils/network'
import toast from 'react-hot-toast'

export function useNetwork() {
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  const switchToChain = async (targetChainId: number) => {
    if (!isSupportedChain(targetChainId)) {
      toast.error(`Chain ${targetChainId} is not supported`)
      return false
    }

    try {
      await switchChain({ chainId: targetChainId })
      toast.success(`Switched to ${getChainName(targetChainId)}`)
      return true
    } catch (error: any) {
      toast.error('Failed to switch network')
      return false
    }
  }

  return {
    chainId,
    chainName: getChainName(chainId),
    isSupported: isSupportedChain(chainId),
    switchToChain,
    isSwitching: isPending,
  }
}

