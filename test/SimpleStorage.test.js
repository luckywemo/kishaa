const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleStorage", function () {
  let simpleStorage;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await SimpleStorage.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await simpleStorage.getOwner()).to.equal(owner.address);
    });

    it("Should initialize with zero data", async function () {
      expect(await simpleStorage.retrieve()).to.equal(0);
    });
  });

  describe("Store and Retrieve", function () {
    it("Should store and retrieve data correctly", async function () {
      await simpleStorage.store(42);
      expect(await simpleStorage.retrieve()).to.equal(42);

      await simpleStorage.store(100);
      expect(await simpleStorage.retrieve()).to.equal(100);
    });

    it("Should emit DataStored event", async function () {
      await expect(simpleStorage.store(42))
        .to.emit(simpleStorage, "DataStored")
        .withArgs(42, owner.address);
    });
  });

  describe("Deposit and Withdraw", function () {
    it("Should accept ETH deposits", async function () {
      const depositAmount = ethers.parseEther("1.0");
      await expect(simpleStorage.deposit({ value: depositAmount }))
        .to.changeEtherBalance(simpleStorage, depositAmount);
    });

    it("Should allow owner to withdraw", async function () {
      const depositAmount = ethers.parseEther("1.0");
      await simpleStorage.deposit({ value: depositAmount });
      
      await expect(simpleStorage.withdraw(depositAmount))
        .to.changeEtherBalance(owner, depositAmount);
    });

    it("Should not allow non-owner to withdraw", async function () {
      const depositAmount = ethers.parseEther("1.0");
      await simpleStorage.deposit({ value: depositAmount });
      
      await expect(simpleStorage.connect(addr1).withdraw(depositAmount))
        .to.be.revertedWith("Only owner can call this function");
    });
  });
});
