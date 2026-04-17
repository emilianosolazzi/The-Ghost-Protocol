import { expect } from "chai";
import { ethers } from "hardhat";
import { deployFixtures, TEST_CONSTANTS } from "./fixtures/common";

describe("GhostProtocol: Constructor & Admin Controls", function () {
  describe("Constructor", function () {
    it("should initialize with correct addresses", async function () {
      const { ghostProtocol, ghostedToken, deployer, oracle, treasury } =
        await deployFixtures();

      expect(await ghostProtocol.ghostedToken()).to.equal(
        await ghostedToken.getAddress()
      );
      expect(await ghostProtocol.oracle()).to.equal(oracle.address);
      expect(await ghostProtocol.treasury()).to.equal(treasury.address);
      expect(await ghostProtocol.owner()).to.equal(deployer.address);
    });

    it("should initialize with paused=false", async function () {
      const { ghostProtocol } = await deployFixtures();
      expect(await ghostProtocol.paused()).to.equal(false);
    });

    it("should initialize state counters to zero", async function () {
      const { ghostProtocol } = await deployFixtures();
      const stats = await ghostProtocol.getProtocolStats();

      expect(stats.totalEvidenceSubmissions).to.equal(0n);
      expect(stats.totalDirectEvidenceRewards).to.equal(0n);
      expect(stats.totalTruthAssertions).to.equal(0n);
      expect(stats.totalDirectAssertionRewards).to.equal(0n);
      expect(stats.totalTruthBurned).to.equal(0n);
    });

    it("should revert if ghostedToken is zero address", async function () {
      const [deployer, oracle, treasury] = await ethers.getSigners();
      const GhostProtocol = await ethers.getContractFactory("GhostProtocol");

      await expect(
        GhostProtocol.deploy(
          ethers.ZeroAddress, // invalid
          treasury.address,
          oracle.address
        )
      ).to.be.revertedWithCustomError(GhostProtocol, "InvalidAddress");
    });

    it("should revert if treasury is zero address", async function () {
      const [deployer, oracle, treasury] = await ethers.getSigners();
      const MockToken = await ethers.getContractFactory("MockERC20");
      const token = await MockToken.deploy("T", "T", ethers.parseEther("1000"));
      const GhostProtocol = await ethers.getContractFactory("GhostProtocol");

      await expect(
        GhostProtocol.deploy(
          await token.getAddress(),
          ethers.ZeroAddress, // invalid
          oracle.address
        )
      ).to.be.revertedWithCustomError(GhostProtocol, "InvalidAddress");
    });

    it("should revert if oracle is zero address", async function () {
      const [deployer, oracle, treasury] = await ethers.getSigners();
      const MockToken = await ethers.getContractFactory("MockERC20");
      const token = await MockToken.deploy("T", "T", ethers.parseEther("1000"));
      const GhostProtocol = await ethers.getContractFactory("GhostProtocol");

      await expect(
        GhostProtocol.deploy(
          await token.getAddress(),
          treasury.address,
          ethers.ZeroAddress // invalid
        )
      ).to.be.revertedWithCustomError(GhostProtocol, "InvalidAddress");
    });
  });

  describe("transferOwnership", function () {
    it("should allow owner to transfer ownership", async function () {
      const { ghostProtocol, deployer, user1 } = await deployFixtures();

      const tx = ghostProtocol.transferOwnership(user1.address);
      await expect(tx).to.emit(ghostProtocol, "OwnershipTransferred");

      expect(await ghostProtocol.owner()).to.equal(user1.address);
    });

    it("should revert if not owner", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();

      await expect(
        ghostProtocol.connect(user1).transferOwnership(user2.address)
      ).to.be.revertedWithCustomError(ghostProtocol, "OnlyOwner");
    });

    it("should revert if new owner is zero address", async function () {
      const { ghostProtocol } = await deployFixtures();

      await expect(
        ghostProtocol.transferOwnership(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(ghostProtocol, "InvalidAddress");
    });
  });

  describe("setOracle", function () {
    it("should allow owner to set oracle", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      const tx = ghostProtocol.setOracle(user1.address);
      await expect(tx).to.emit(ghostProtocol, "OracleUpdated");

      expect(await ghostProtocol.oracle()).to.equal(user1.address);
    });

    it("should revert if not owner", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();

      await expect(
        ghostProtocol.connect(user1).setOracle(user2.address)
      ).to.be.revertedWithCustomError(ghostProtocol, "OnlyOwner");
    });

    it("should revert if oracle is zero address", async function () {
      const { ghostProtocol } = await deployFixtures();

      await expect(
        ghostProtocol.setOracle(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(ghostProtocol, "InvalidAddress");
    });
  });

  describe("setTreasury", function () {
    it("should allow owner to set treasury", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      const tx = ghostProtocol.setTreasury(user1.address);
      await expect(tx).to.emit(ghostProtocol, "TreasuryUpdated");

      expect(await ghostProtocol.treasury()).to.equal(user1.address);
    });

    it("should revert if not owner", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();

      await expect(
        ghostProtocol.connect(user1).setTreasury(user2.address)
      ).to.be.revertedWithCustomError(ghostProtocol, "OnlyOwner");
    });

    it("should revert if treasury is zero address", async function () {
      const { ghostProtocol } = await deployFixtures();

      await expect(
        ghostProtocol.setTreasury(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(ghostProtocol, "InvalidAddress");
    });
  });

  describe("setPaused", function () {
    it("should allow owner to pause contract", async function () {
      const { ghostProtocol } = await deployFixtures();

      const tx = ghostProtocol.setPaused(true);
      await expect(tx).to.emit(ghostProtocol, "PausedStatusChanged");

      expect(await ghostProtocol.paused()).to.equal(true);
    });

    it("should allow owner to unpause contract", async function () {
      const { ghostProtocol } = await deployFixtures();

      await ghostProtocol.setPaused(true);
      expect(await ghostProtocol.paused()).to.equal(true);

      const tx = ghostProtocol.setPaused(false);
      await expect(tx).to.emit(ghostProtocol, "PausedStatusChanged");

      expect(await ghostProtocol.paused()).to.equal(false);
    });

    it("should revert if not owner", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      await expect(
        ghostProtocol.connect(user1).setPaused(true)
      ).to.be.revertedWithCustomError(ghostProtocol, "OnlyOwner");
    });
  });
});
