const fs = require('fs');
const path = require('path');

/**
 * Script to update contract addresses in environment file
 * Usage: node scripts/update-contracts.js <deployed-contracts.json>
 */
async function updateContracts() {
  const contractsFile = process.argv[2] || 'deployed-contracts.json';
  
  if (!fs.existsSync(contractsFile)) {
    console.error(`❌ Contract file not found: ${contractsFile}`);
    console.log('💡 Run deployment first: npm run deploy:all');
    process.exit(1);
  }

  const contracts = JSON.parse(fs.readFileSync(contractsFile, 'utf8'));
  const envFile = '.env.local';
  
  // Check if .env.local exists
  let envContent = '';
  if (fs.existsSync(envFile)) {
    envContent = fs.readFileSync(envFile, 'utf8');
  } else {
    // Create from example
    const exampleFile = 'env.example';
    if (fs.existsSync(exampleFile)) {
      envContent = fs.readFileSync(exampleFile, 'utf8');
    }
  }

  const updates = {
    'NEXT_PUBLIC_SIMPLE_STORAGE_ADDRESS': contracts.contracts?.simpleStorage,
    'NEXT_PUBLIC_KISHA_TOKEN_ADDRESS': contracts.contracts?.kishaToken,
    'NEXT_PUBLIC_KISHA_NFT_ADDRESS': contracts.contracts?.kishaNFT,
    'NEXT_PUBLIC_AMM_ADDRESS': contracts.contracts?.simpleAMM,
    'NEXT_PUBLIC_MULTISIG_ADDRESS': contracts.contracts?.multiSigWallet,
  };

  // Update or add contract addresses
  Object.entries(updates).forEach(([key, value]) => {
    if (value) {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        envContent += `\n${key}=${value}`;
      }
    }
  });

  fs.writeFileSync(envFile, envContent);
  console.log('✅ Contract addresses updated in .env.local');
  console.log('\n📋 Updated addresses:');
  Object.entries(updates).forEach(([key, value]) => {
    if (value) {
      console.log(`   ${key}: ${value}`);
    }
  });
}

updateContracts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error updating contracts:', error);
    process.exit(1);
  });

