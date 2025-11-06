import { useState } from 'react'
import { useAccount, useBalance, useWriteContract, useReadContract } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import Card from './Card'
import Input from './Input'
import Button from './Button'
import StatsCard from './StatsCard'
import LoadingSpinner from './LoadingSpinner'
import { CONTRACT_ADDRESSES } from '../utils/constants'
import { formatCurrency } from '../utils/formatting'
import { useTokenBalance } from '../hooks/useTokenBalance'
import { useApprove } from '../hooks/useApprove'

// Mock staking contract ABI - in production, use actual staking contract
const STAKING_ABI = [
  {
    inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
    name: 'unstake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
    name: 'getStakedBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
    name: 'getRewards',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export default function StakingManager() {
  const { address, isConnected } = useAccount()
  const [stakeAmount, setStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('')

  // Mock staking contract address - in production, use actual address
  const stakingContractAddress = CONTRACT_ADDRESSES.KISHA_TOKEN // Using token address as placeholder
  const tokenAddress = CONTRACT_ADDRESSES.KISHA_TOKEN

  const { balance: tokenBalance } = useTokenBalance({
    tokenAddress,
    userAddress: address || '',
    enabled: !!address,
  })

  // Mock staked balance - in production, read from contract
  const stakedBalance = '0'
  const rewards = '0'
  const apy = 12.5 // Annual Percentage Yield

  const { writeContract: stakeTokens, isPending: isStaking } = useWriteContract()
  const { writeContract: unstakeTokens, isPending: isUnstaking } = useWriteContract()
  const { writeContract: claimRewards, isPending: isClaiming } = useWriteContract()

  const { approve, needsApproval, isPending: isApproving } = useApprove({
    tokenAddress,
    spenderAddress: stakingContractAddress,
    amount: stakeAmount,
    enabled: !!stakeAmount && parseFloat(stakeAmount) > 0,
  })

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return

    try {
      if (needsApproval) {
        await approve()
      }

      await stakeTokens({
        address: stakingContractAddress as `0x${string}`,
        abi: STAKING_ABI,
        functionName: 'stake',
        args: [parseEther(stakeAmount)],
      })
      setStakeAmount('')
    } catch (error) {
      console.error('Error staking:', error)
    }
  }

  const handleUnstake = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) return

    try {
      await unstakeTokens({
        address: stakingContractAddress as `0x${string}`,
        abi: STAKING_ABI,
        functionName: 'unstake',
        args: [parseEther(unstakeAmount)],
      })
      setUnstakeAmount('')
    } catch (error) {
      console.error('Error unstaking:', error)
    }
  }

  const handleClaimRewards = async () => {
    try {
      await claimRewards({
        address: stakingContractAddress as `0x${string}`,
        abi: STAKING_ABI,
        functionName: 'claimRewards',
      })
    } catch (error) {
      console.error('Error claiming rewards:', error)
    }
  }

  if (!isConnected) {
    return (
      <Card title="Staking Manager">
        <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
          Connect your wallet to start staking
        </p>
      </Card>
    )
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatsCard
          title="Staked Balance"
          value={stakedBalance}
          subtitle="Currently staked"
        />
        <StatsCard
          title="Available Rewards"
          value={rewards}
          subtitle="Ready to claim"
        />
        <StatsCard
          title="APY"
          value={`${apy}%`}
          subtitle="Annual Percentage Yield"
          trend="up"
        />
        <StatsCard
          title="Token Balance"
          value={tokenBalance ? formatEther(tokenBalance).slice(0, 8) : '0'}
          subtitle="Available to stake"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        <Card title="Stake Tokens">
          <div style={{ marginBottom: '1rem' }}>
            <Input
              label="Amount to Stake"
              type="number"
              placeholder="0.0"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
            />
          </div>
          <Button
            onClick={handleStake}
            fullWidth
            disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || isStaking || isApproving}
          >
            {isApproving ? 'Approving...' : needsApproval ? 'Approve & Stake' : isStaking ? 'Staking...' : 'Stake Tokens'}
          </Button>
          {needsApproval && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666', textAlign: 'center' }}>
              Approval required before staking
            </p>
          )}
        </Card>

        <Card title="Unstake Tokens">
          <div style={{ marginBottom: '1rem' }}>
            <Input
              label="Amount to Unstake"
              type="number"
              placeholder="0.0"
              value={unstakeAmount}
              onChange={(e) => setUnstakeAmount(e.target.value)}
            />
          </div>
          <Button
            onClick={handleUnstake}
            fullWidth
            variant="outline"
            disabled={!unstakeAmount || parseFloat(unstakeAmount) <= 0 || isUnstaking}
          >
            {isUnstaking ? 'Unstaking...' : 'Unstake Tokens'}
          </Button>
        </Card>
      </div>

      <Card title="Rewards" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>Available Rewards</div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{rewards}</div>
          </div>
          <Button
            onClick={handleClaimRewards}
            disabled={parseFloat(rewards) <= 0 || isClaiming}
            size="large"
          >
            {isClaiming ? 'Claiming...' : 'Claim Rewards'}
          </Button>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>
            💡 <strong>Note:</strong> This is a demo staking interface. In production, connect to an actual staking contract.
          </p>
        </div>
      </Card>
    </div>
  )
}

