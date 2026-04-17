import { expect } from "chai";
import { ethers } from "hardhat";
import {
  deployFixtures,
  TEST_CONSTANTS,
  generateProofHash,
} from "./fixtures/common";

describe("GhostProtocol: Unlock Mechanics", function () {
  const RECEIPT_FEE = TEST_CONSTANTS.RECEIPT_FEE;

  async function submitEvidenceHelper(
    ghostProtocol: any,
    signer: any,
    seed: number,
    severity: number = 50
  ) {
    const proofHash = generateProofHash(seed);
    await ghostProtocol
      .connect(signer)
      .submitEvidence(proofHash, severity, "unlock test desc", "crypto", "", false, {
        value: RECEIPT_FEE,
      });
    return proofHash;
  }

  describe("unlockStoryByBurn", function () {
    it("should unlock by burning tokens", async function () {
      const { ghostProtocol, ghostedToken, user1, user2 } =
        await deployFixtures();
      const proofHash = await submitEvidenceHelper(ghostProtocol, user1, 100);

      const unlockInfo = await ghostProtocol.getStoryUnlockInfo(proofHash);
      const unlockPrice = unlockInfo.unlockPriceTokens;

      const submitterBalBefore = await ghostedToken.balanceOf(user1.address);

      const tx = ghostProtocol.connect(user2).unlockStoryByBurn(proofHash);
      await expect(tx)
        .to.emit(ghostProtocol, "StoryUnlocked")
        .withArgs(proofHash, user2.address, unlockPrice, "BURN");

      // Submitter gets half, other half is burned
      const submitterBalAfter = await ghostedToken.balanceOf(user1.address);
      const submitterShare = unlockPrice - unlockPrice / 2n;
      expect(submitterBalAfter - submitterBalBefore).to.equal(submitterShare);
    });

    it("should mark user as having unlocked", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();
      const proofHash = await submitEvidenceHelper(ghostProtocol, user1, 101);

      expect(
        await ghostProtocol.hasUserUnlockedStory(proofHash, user2.address)
      ).to.equal(false);

      await ghostProtocol.connect(user2).unlockStoryByBurn(proofHash);

      expect(
        await ghostProtocol.hasUserUnlockedStory(proofHash, user2.address)
      ).to.equal(true);
    });

    it("should escalate unlock price after each unlock", async function () {
      const { ghostProtocol, user1, user2, user3 } = await deployFixtures();
      const proofHash = await submitEvidenceHelper(ghostProtocol, user1, 102);

      const infoBefore = await ghostProtocol.getStoryUnlockInfo(proofHash);
      expect(infoBefore.unlockPriceTokens).to.equal(
        TEST_CONSTANTS.BASE_UNLOCK_PRICE
      );

      await ghostProtocol.connect(user2).unlockStoryByBurn(proofHash);

      const infoAfter = await ghostProtocol.getStoryUnlockInfo(proofHash);
      expect(infoAfter.unlockPriceTokens).to.be.gt(
        TEST_CONSTANTS.BASE_UNLOCK_PRICE
      );
      expect(infoAfter.timesUnlocked).to.equal(1n);
    });

    it("should revert with AlreadyUnlocked on double unlock", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();
      const proofHash = await submitEvidenceHelper(ghostProtocol, user1, 103);

      await ghostProtocol.connect(user2).unlockStoryByBurn(proofHash);

      await expect(
        ghostProtocol.connect(user2).unlockStoryByBurn(proofHash)
      ).to.be.revertedWithCustomError(ghostProtocol, "AlreadyUnlocked");
    });

    it("should revert with StoryDoesNotExist for unknown proof", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      await expect(
        ghostProtocol
          .connect(user1)
          .unlockStoryByBurn(generateProofHash(999))
      ).to.be.revertedWithCustomError(ghostProtocol, "StoryDoesNotExist");
    });

    it("should revert with StoryIsPublic if already public", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();
      const proofHash = await submitEvidenceHelper(ghostProtocol, user1, 104);

      await ghostProtocol.connect(user1).makeStoryPublic(proofHash);

      await expect(
        ghostProtocol.connect(user2).unlockStoryByBurn(proofHash)
      ).to.be.revertedWithCustomError(ghostProtocol, "StoryIsPublic");
    });

    it("should revert with ContractPaused when paused", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();
      const proofHash = await submitEvidenceHelper(ghostProtocol, user1, 105);

      await ghostProtocol.setPaused(true);

      await expect(
        ghostProtocol.connect(user2).unlockStoryByBurn(proofHash)
      ).to.be.revertedWithCustomError(ghostProtocol, "ContractPaused");
    });
  });

  describe("unlockStoryWithETH", function () {
    it("should unlock with ETH payment", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();
      const proofHash = await submitEvidenceHelper(ghostProtocol, user1, 200);

      const ethPrice = await ghostProtocol.previewUnlockPriceInEth(proofHash);
      expect(ethPrice).to.be.gt(0n);

      const unlockInfo = await ghostProtocol.getStoryUnlockInfo(proofHash);

      const tx = ghostProtocol
        .connect(user2)
        .unlockStoryWithETH(proofHash, { value: ethPrice });

      await expect(tx)
        .to.emit(ghostProtocol, "StoryUnlocked")
        .withArgs(
          proofHash,
          user2.address,
          unlockInfo.unlockPriceTokens,
          "ETH"
        );
    });

    it("should pay submitter the ETH", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();
      const proofHash = await submitEvidenceHelper(ghostProtocol, user1, 201);

      const ethPrice = await ghostProtocol.previewUnlockPriceInEth(proofHash);
      const submitterBalBefore = await ethers.provider.getBalance(
        user1.address
      );

      await ghostProtocol
        .connect(user2)
        .unlockStoryWithETH(proofHash, { value: ethPrice });

      const submitterBalAfter = await ethers.provider.getBalance(
        user1.address
      );
      expect(submitterBalAfter - submitterBalBefore).to.equal(ethPrice);
    });

    it("should refund ETH overpayment", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();
      const proofHash = await submitEvidenceHelper(ghostProtocol, user1, 202);

      const ethPrice = await ghostProtocol.previewUnlockPriceInEth(proofHash);
      const overpay = ethPrice * 2n;

      const balBefore = await ethers.provider.getBalance(user2.address);

      const tx = await ghostProtocol
        .connect(user2)
        .unlockStoryWithETH(proofHash, { value: overpay });
      const receipt = await tx.wait();
      const gasCost = BigInt(receipt!.gasUsed) * BigInt(receipt!.gasPrice);

      const balAfter = await ethers.provider.getBalance(user2.address);
      const netSpent = balBefore - balAfter - gasCost;
      expect(netSpent).to.equal(ethPrice);
    });

    it("should revert with InsufficientEth on low payment", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();
      const proofHash = await submitEvidenceHelper(ghostProtocol, user1, 203);

      await expect(
        ghostProtocol
          .connect(user2)
          .unlockStoryWithETH(proofHash, { value: 1n })
      ).to.be.revertedWithCustomError(ghostProtocol, "InsufficientEth");
    });

    it("should revert with AlreadyUnlocked on double ETH unlock", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();
      const proofHash = await submitEvidenceHelper(ghostProtocol, user1, 204);

      const ethPrice = await ghostProtocol.previewUnlockPriceInEth(proofHash);
      await ghostProtocol
        .connect(user2)
        .unlockStoryWithETH(proofHash, { value: ethPrice });

      await expect(
        ghostProtocol
          .connect(user2)
          .unlockStoryWithETH(proofHash, { value: ethPrice * 2n })
      ).to.be.revertedWithCustomError(ghostProtocol, "AlreadyUnlocked");
    });
  });

  describe("unlockStoryByCredibility", function () {
    it("should unlock when user has sufficient credibility", async function () {
      const { ghostProtocol, ghostedToken, user1, user2 } =
        await deployFixtures();
      const proofHash = await submitEvidenceHelper(
        ghostProtocol,
        user1,
        300,
        10
      );

      // Seed credibility on the token (owner-only function)
      await ghostedToken.seedCredibilityScore(
        user2.address,
        ethers.parseEther("2000")
      );

      const tx = ghostProtocol
        .connect(user2)
        .unlockStoryByCredibility(proofHash);

      await expect(tx)
        .to.emit(ghostProtocol, "StoryUnlocked")
        .withArgs(proofHash, user2.address, 0, "CREDIBILITY");
    });

    it("should revert with InsufficientCredibility when too low", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();
      const proofHash = await submitEvidenceHelper(
        ghostProtocol,
        user1,
        301,
        10
      );

      // user2 has no credibility
      await expect(
        ghostProtocol.connect(user2).unlockStoryByCredibility(proofHash)
      ).to.be.revertedWithCustomError(
        ghostProtocol,
        "InsufficientCredibility"
      );
    });
  });

  describe("makeStoryPublic", function () {
    it("should allow submitter to make story public", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();
      const proofHash = await submitEvidenceHelper(ghostProtocol, user1, 400);

      const tx = ghostProtocol.connect(user1).makeStoryPublic(proofHash);

      await expect(tx)
        .to.emit(ghostProtocol, "StoryMadePublic")
        .withArgs(proofHash, user1.address);

      const info = await ghostProtocol.getStoryUnlockInfo(proofHash);
      expect(info.isPublic).to.equal(true);
    });

    it("should revert with OnlySubmitter for non-submitter", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();
      const proofHash = await submitEvidenceHelper(ghostProtocol, user1, 401);

      await expect(
        ghostProtocol.connect(user2).makeStoryPublic(proofHash)
      ).to.be.revertedWithCustomError(ghostProtocol, "OnlySubmitter");
    });

    it("should revert with StoryAlreadyPublic on double public", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();
      const proofHash = await submitEvidenceHelper(ghostProtocol, user1, 402);

      await ghostProtocol.connect(user1).makeStoryPublic(proofHash);

      await expect(
        ghostProtocol.connect(user1).makeStoryPublic(proofHash)
      ).to.be.revertedWithCustomError(ghostProtocol, "StoryAlreadyPublic");
    });

    it("should revert with StoryDoesNotExist for unknown proof", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      await expect(
        ghostProtocol.connect(user1).makeStoryPublic(generateProofHash(999))
      ).to.be.revertedWithCustomError(ghostProtocol, "StoryDoesNotExist");
    });
  });

  describe("canUserAccessStory", function () {
    it("should return false for non-unlocked, non-public story", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();
      const proofHash = await submitEvidenceHelper(ghostProtocol, user1, 500);

      expect(
        await ghostProtocol.canUserAccessStory(proofHash, user2.address)
      ).to.equal(false);
    });

    it("should return true after unlocking", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();
      const proofHash = await submitEvidenceHelper(ghostProtocol, user1, 501);

      await ghostProtocol.connect(user2).unlockStoryByBurn(proofHash);

      expect(
        await ghostProtocol.canUserAccessStory(proofHash, user2.address)
      ).to.equal(true);
    });

    it("should return true for public story", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();
      const proofHash = await submitEvidenceHelper(ghostProtocol, user1, 502);

      await ghostProtocol.connect(user1).makeStoryPublic(proofHash);

      expect(
        await ghostProtocol.canUserAccessStory(proofHash, user2.address)
      ).to.equal(true);
    });
  });
});
