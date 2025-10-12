const hre = require("hardhat");

async function main() {
  console.log("Deploying SimpleStorage contract...");

  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy();

  await simpleStorage.waitForDeployment();

  const contractAddress = await simpleStorage.getAddress();
  console.log("SimpleStorage deployed to:", contractAddress);
  console.log("Owner:", await simpleStorage.getOwner());
  
  // Store initial data
  await simpleStorage.store(42);
  console.log("Initial data stored:", (await simpleStorage.retrieve()).toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
