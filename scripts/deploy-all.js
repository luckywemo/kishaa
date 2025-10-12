const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying all Kisha contracts...");

  // Get signers
  const [owner, addr1, addr2] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", owner.address);

  const deployedContracts = {};

  try {
    // 1. Deploy SimpleStorage
    console.log("\n1️⃣ Deploying SimpleStorage...");
    const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
    const simpleStorage = await SimpleStorage.deploy();
    await simpleStorage.waitForDeployment();
    deployedContracts.simpleStorage = await simpleStorage.getAddress();
    console.log("✅ SimpleStorage deployed to:", deployedContracts.simpleStorage);

    // 2. Deploy KishaToken
    console.log("\n2️⃣ Deploying KishaToken...");
    const KishaToken = await hre.ethers.getContractFactory("KishaToken");
    const kishaToken = await KishaToken.deploy(1000000); // 1 million tokens
    await kishaToken.waitForDeployment();
    deployedContracts.kishaToken = await kishaToken.getAddress();
    console.log("✅ KishaToken deployed to:", deployedContracts.kishaToken);

    // 3. Deploy KishaNFT
    console.log("\n3️⃣ Deploying KishaNFT...");
    const KishaNFT = await hre.ethers.getContractFactory("KishaNFT");
    const kishaNFT = await KishaNFT.deploy();
    await kishaNFT.waitForDeployment();
    deployedContracts.kishaNFT = await kishaNFT.getAddress();
    console.log("✅ KishaNFT deployed to:", deployedContracts.kishaNFT);

    // 4. Deploy SimpleAMM
    console.log("\n4️⃣ Deploying SimpleAMM...");
    const SimpleAMM = await hre.ethers.getContractFactory("SimpleAMM");
    const simpleAMM = await SimpleAMM.deploy(deployedContracts.kishaToken, "0x0000000000000000000000000000000000000000"); // KISH/ETH pair
    await simpleAMM.waitForDeployment();
    deployedContracts.simpleAMM = await simpleAMM.getAddress();
    console.log("✅ SimpleAMM deployed to:", deployedContracts.simpleAMM);

    // 5. Deploy MultiSigWallet
    console.log("\n5️⃣ Deploying MultiSigWallet...");
    const owners = [owner.address, addr1.address, addr2.address];
    const required = 2; // Require 2 out of 3 signatures
    const MultiSigWallet = await hre.ethers.getContractFactory("MultiSigWallet");
    const multiSigWallet = await MultiSigWallet.deploy(owners, required);
    await multiSigWallet.waitForDeployment();
    deployedContracts.multiSigWallet = await multiSigWallet.getAddress();
    console.log("✅ MultiSigWallet deployed to:", deployedContracts.multiSigWallet);

    // 6. Setup initial state
    console.log("\n6️⃣ Setting up initial state...");
    
    // Transfer some tokens to the AMM for liquidity
    const transferAmount = hre.ethers.parseEther("10000"); // 10k tokens
    await kishaToken.transfer(deployedContracts.simpleAMM, transferAmount);
    console.log("✅ Transferred 10,000 KISH tokens to AMM");

    // Store initial data in SimpleStorage
    await simpleStorage.store(42);
    console.log("✅ Stored initial data (42) in SimpleStorage");

    // Mint a test NFT
    await kishaNFT.mint(1, { value: hre.ethers.parseEther("0.01") });
    console.log("✅ Minted test NFT");

    // 7. Display final summary
    console.log("\n🎉 All contracts deployed successfully!");
    console.log("\n📋 Contract Addresses:");
    console.log("SimpleStorage:", deployedContracts.simpleStorage);
    console.log("KishaToken:", deployedContracts.kishaToken);
    console.log("KishaNFT:", deployedContracts.kishaNFT);
    console.log("SimpleAMM:", deployedContracts.simpleAMM);
    console.log("MultiSigWallet:", deployedContracts.multiSigWallet);

    console.log("\n💰 Contract States:");
    console.log("SimpleStorage - Stored Data:", (await simpleStorage.retrieve()).toString());
    console.log("SimpleStorage - Balance:", (await hre.ethers.provider.getBalance(deployedContracts.simpleStorage)).toString());
    console.log("KishaToken - Total Supply:", (await kishaToken.totalSupply()).toString());
    console.log("KishaToken - Owner Balance:", (await kishaToken.balanceOf(owner.address)).toString());
    console.log("KishaNFT - Total Supply:", (await kishaNFT.totalSupply()).toString());
    console.log("KishaNFT - Mint Price:", (await kishaNFT.mintPrice()).toString());
    console.log("SimpleAMM - KISH Reserve:", (await simpleAMM.getReserves())[0].toString());
    console.log("MultiSig - Required Signatures:", (await multiSigWallet.required()).toString());

    // Save addresses to a file for easy reference
    const fs = require('fs');
    const contractData = {
      network: hre.network.name,
      chainId: hre.network.config.chainId,
      deployedAt: new Date().toISOString(),
      contracts: deployedContracts,
      owner: owner.address
    };
    
    fs.writeFileSync('./deployed-contracts.json', JSON.stringify(contractData, null, 2));
    console.log("\n💾 Contract addresses saved to deployed-contracts.json");

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
