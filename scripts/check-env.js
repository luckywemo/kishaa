#!/usr/bin/env node

/**
 * Check if required environment variables are set
 */

const fs = require('fs')
const path = require('path')

const requiredEnvVars = [
  'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID',
]

const envPath = path.join(__dirname, '..', '.env.local')
const envExamplePath = path.join(__dirname, '..', '.env.example')

console.log('🔍 Checking environment variables...\n')

// Check if .env.local exists
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!')
  console.log('📝 Copy .env.example to .env.local and fill in the values:')
  console.log('   cp .env.example .env.local\n')
  process.exit(1)
}

// Read .env.local
const envContent = fs.readFileSync(envPath, 'utf8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    envVars[match[1].trim()] = match[2].trim()
  }
})

// Check required variables
let missing = []
let empty = []

requiredEnvVars.forEach(varName => {
  if (!(varName in envVars)) {
    missing.push(varName)
  } else if (!envVars[varName] || envVars[varName].includes('your_') || envVars[varName].includes('YOUR_')) {
    empty.push(varName)
  }
})

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:')
  missing.forEach(v => console.error(`   - ${v}`))
  console.log()
}

if (empty.length > 0) {
  console.error('⚠️  Empty or placeholder values found:')
  empty.forEach(v => console.error(`   - ${v}`))
  console.log()
}

if (missing.length === 0 && empty.length === 0) {
  console.log('✅ All required environment variables are set!\n')
  process.exit(0)
} else {
  console.log('📝 Please update .env.local with the required values.\n')
  process.exit(1)
}

