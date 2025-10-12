const hre = require("hardhat");

async function main() {
  console.log("Deploying Kisha Token and MultiSig Wallet...");

  // Get signers
  const [owner, addr1, addr2] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", owner.address);

  // Deploy KishaToken
  console.log("\n1. Deploying KishaToken...");
  const KishaToken = await hre.ethers.getContractFactory("KishaToken");
  const kishaToken = await KishaToken.deploy(1000000); // 1 million tokens
  await kishaToken.waitForDeployment();

  const tokenAddress = await kishaToken.getAddress();
  console.log("KishaToken deployed to:", tokenAddress);
  console.log("Token name:", await kishaToken.name());
  console.log("Token symbol:", await kishaToken.symbol());
  console.log("Total supply:", (await kishaToken.totalSupply()).toString());

  // Deploy MultiSigWallet
  console.log("\n2. Deploying MultiSigWallet...");
  const owners = [owner.address, addr1.address, addr2.address];
  const required = 2; // Require 2 out of 3 signatures

  const MultiSigWallet = await hre.ethers.getContractFactory("MultiSigWallet");
  const multiSigWallet = await MultiSigWallet.deploy(owners, required);
  await multiSigWallet.waitForDeployment();

  const walletAddress = await multiSigWallet.getAddress();
  console.log("MultiSigWallet deployed to:", walletAddress);
  console.log("Owners:", await multiSigWallet.owners(0), await multiSigWallet.owners(1), await multiSigWallet.owners(2));
  console.log("Required confirmations:", (await multiSigWallet.required()).toString());

  // Transfer some tokens to the multi-sig wallet
  console.log("\n3. Transferring tokens to MultiSig wallet...");
  const transferAmount = hre.ethers.parseEther("10000"); // 10k tokens
  await kishaToken.transfer(walletAddress, transferAmount);
  console.log("Transferred", transferAmount.toString(), "tokens to MultiSig wallet");

  // Display final balances
  console.log("\n4. Final balances:");
  console.log("Owner token balance:", (await kishaToken.balanceOf(owner.address)).toString());
  console.log("MultiSig token balance:", (await kishaToken.balanceOf(walletAddress)).toString());
  console.log("MultiSig ETH balance:", (await hre.ethers.provider.getBalance(walletAddress)).toString());

  console.log("\n✅ Deployment completed successfully!");
  console.log("\nContract addresses:");
  console.log("KishaToken:", tokenAddress);
  console.log("MultiSigWallet:", walletAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
