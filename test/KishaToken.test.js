const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KishaToken", function () {
  let kishaToken;
  let owner;
  let addr1;
  let addr2;
  const initialSupply = 1000000; // 1 million tokens

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const KishaToken = await ethers.getContractFactory("KishaToken");
    kishaToken = await KishaToken.deploy(initialSupply);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await kishaToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await kishaToken.balanceOf(owner.address);
      expect(await kishaToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the correct token details", async function () {
      expect(await kishaToken.name()).to.equal("Kisha Token");
      expect(await kishaToken.symbol()).to.equal("KISH");
      expect(await kishaToken.decimals()).to.equal(18);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.utils.parseEther("100");
      
      await kishaToken.transfer(addr1.address, transferAmount);
      expect(await kishaToken.balanceOf(addr1.address)).to.equal(transferAmount);

      await kishaToken.connect(addr1).transfer(addr2.address, transferAmount);
      expect(await kishaToken.balanceOf(addr2.address)).to.equal(transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const ownerBalance = await kishaToken.balanceOf(owner.address);
      
      await expect(
        kishaToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Insufficient balance");

      expect(await kishaToken.balanceOf(owner.address)).to.equal(ownerBalance);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await kishaToken.balanceOf(owner.address);
      const transferAmount = ethers.utils.parseEther("100");

      await kishaToken.transfer(addr1.address, transferAmount);
      expect(await kishaToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance.sub(transferAmount)
      );
      expect(await kishaToken.balanceOf(addr1.address)).to.equal(transferAmount);
    });
  });

  describe("Approvals", function () {
    it("Should approve and transferFrom correctly", async function () {
      const transferAmount = ethers.utils.parseEther("100");
      
      await kishaToken.approve(addr1.address, transferAmount);
      expect(await kishaToken.allowance(owner.address, addr1.address)).to.equal(transferAmount);

      await kishaToken.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount);
      expect(await kishaToken.balanceOf(addr2.address)).to.equal(transferAmount);
    });

    it("Should fail transferFrom if allowance is insufficient", async function () {
      const transferAmount = ethers.utils.parseEther("100");
      
      await expect(
        kishaToken.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount)
      ).to.be.revertedWith("Insufficient allowance");
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.utils.parseEther("1000");
      const initialSupply = await kishaToken.totalSupply();
      
      await kishaToken.mint(addr1.address, mintAmount);
      expect(await kishaToken.totalSupply()).to.equal(initialSupply.add(mintAmount));
      expect(await kishaToken.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("Should not allow non-owner to mint", async function () {
      const mintAmount = ethers.utils.parseEther("1000");
      
      await expect(
        kishaToken.connect(addr1).mint(addr2.address, mintAmount)
      ).to.be.revertedWith("Only owner can call this function");
    });
  });

  describe("Burning", function () {
    it("Should allow users to burn their own tokens", async function () {
      const burnAmount = ethers.utils.parseEther("100");
      const initialBalance = await kishaToken.balanceOf(owner.address);
      
      await kishaToken.burn(burnAmount);
      expect(await kishaToken.balanceOf(owner.address)).to.equal(initialBalance.sub(burnAmount));
    });

    it("Should not allow burning more tokens than balance", async function () {
      const burnAmount = await kishaToken.balanceOf(owner.address).add(1);
      
      await expect(kishaToken.burn(burnAmount)).to.be.revertedWith("Insufficient balance to burn");
    });
  });

  describe("Pause/Unpause", function () {
    it("Should allow owner to pause transfers", async function () {
      await kishaToken.pause();
      expect(await kishaToken.paused()).to.be.true;
    });

    it("Should not allow transfers when paused", async function () {
      await kishaToken.pause();
      
      await expect(
        kishaToken.transfer(addr1.address, ethers.utils.parseEther("100"))
      ).to.be.revertedWith("Token transfers are paused");
    });

    it("Should allow transfers after unpause", async function () {
      await kishaToken.pause();
      await kishaToken.unpause();
      
      const transferAmount = ethers.utils.parseEther("100");
      await kishaToken.transfer(addr1.address, transferAmount);
      expect(await kishaToken.balanceOf(addr1.address)).to.equal(transferAmount);
    });
  });
});
