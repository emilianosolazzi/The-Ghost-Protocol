import { expect } from "chai";
import { ethers } from "hardhat";
import { deployFixtures, TEST_CONSTANTS, generateProofHash } from "./fixtures/common";

describe("GhostProtocol: Unlock Mechanics", function () {
  describe("unlockStoryByBurn", function () {
    it("should unlock story by burning tokens", async function () {
      const { ghostProtocol, ghostedToken, user1, user2 } = await deployFixtures();

      const proofHash = generateProofHash(201);

      // User1 submits evidence
      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      // User2 unlocks by burning
      const unlockInfo = await ghostProtocol.getStoryUnlockInfo(proofHash);
      const burnAmount = unlockInfo.currentUnlockPriceInTokens / 2n;

      const tx = ghostProtocol.connect(user2).unlockStoryByBurn(proofHash);

      await expect(tx).to.emit(ghostProtocol, "StoryUnlockedBurn");

      // Verify user can access story
      const canAccess = await ghostProtocol.canUserAccessStory(proofHash, user2.address);
      expect(canAccess).to.equal(true);
    });

    it("should increment unlock count and increase price", async function () {
      const { ghostProtocol, user1, user2, user3 } = await deployFixtures();

      const proofHash = generateProofHash(202);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      const infoBefore = await ghostProtocol.getStoryUnlockInfo(proofHash);
      expect(infoBefore.timesUnlocked).to.equal(0n);
      const priceBefore = infoBefore.currentUnlockPriceInTokens;

      // First unlock
      await ghostProtocol.connect(user2).unlockStoryByBurn(proofHash);

      const infoAfter1 = await ghostProtocol.getStoryUnlockInfo(proofHash);
      expect(infoAfter1.timesUnlocked).to.equal(1n);
      expect(infoAfter1.currentUnlockPriceInTokens).to.be.greaterThan(priceBefore);

      const price1 = infoAfter1.currentUnlockPriceInTokens;

      // Second unlock
      await ghostProtocol.connect(user3).unlockStoryByBurn(proofHash);

      const infoAfter2 = await ghostProtocol.getStoryUnlockInfo(proofHash);
      expect(infoAfter2.timesUnlocked).to.equal(2n);
      expect(infoAfter2.currentUnlockPriceInTokens).to.be.greaterThan(price1);
    });

    it("should reject if story already unlocked by user", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();

      const proofHash = generateProofHash(203);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      // First unlock succeeds
      await ghostProtocol.connect(user2).unlockStoryByBurn(proofHash);

      // Second unlock by same user fails
      await expect(
        ghostProtocol.connect(user2).unlockStoryByBurn(proofHash)
      ).to.be.revertedWithCustomError(ghostProtocol, "StoryAlreadyUnlockedByUser");
    });

    it("should reject if story is public", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();

      const proofHash = generateProofHash(204);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      // Make story public
      await ghostProtocol.connect(user1).makeStoryPublic(proofHash);

      // Cannot unlock public story
      await expect(
        ghostProtocol.connect(user2).unlockStoryByBurn(proofHash)
      ).to.be.revertedWithCustomError(ghostProtocol, "StoryAlreadyPublic");
    });

    it("should reject if evidence does not exist", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      await expect(
        ghostProtocol.connect(user1).unlockStoryByBurn(generateProofHash(999))
      ).to.be.revertedWithCustomError(ghostProtocol, "EvidenceNotFound");
    });

    it("should revert when paused", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();

      const proofHash = generateProofHash(205);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      await ghostProtocol.setPaused(true);

      await expect(
        ghostProtocol.connect(user2).unlockStoryByBurn(proofHash)
      ).to.be.revertedWithCustomError(ghostProtocol, "ProtocolPaused");
    });
  });

  describe("unlockStoryByCredibility", function () {
    it("should unlock story if user has enough credibility", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();

      const proofHash = generateProofHash(301);

      // User1 submits evidence
      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      // Transfer credibility to user2 (requires multiple truth assertions)
      // For now, assume user2 has credibility >= threshold
      // This would need a separate truth assertion setup to properly test

      // Credential unlock should check credibility requirement
      // This test will depend on truth assertion flow being in place
    });

    it("should reject if insufficient credibility", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();

      const proofHash = generateProofHash(302);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      // User2 has no credibility, should fail
      await expect(
        ghostProtocol.connect(user2).unlockStoryByCredibility(proofHash)
      ).to.be.revertedWithCustomError(ghostProtocol, "InsufficientCredibility");
    });
  });

  describe("unlockStoryWithETH", function () {
    it("should unlock story by sending ETH", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();

      const proofHash = generateProofHash(401);

      // User1 submits evidence
      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      // User2 gets unlock price
      const unlockInfo = await ghostProtocol.getStoryUnlockInfo(proofHash);
      const unlockPriceEth = unlockInfo.previewUnlockPriceInEth;

      const tx = ghostProtocol.connect(user2).unlockStoryWithETH(proofHash, {
        value: unlockPriceEth,
      });

      await expect(tx).to.emit(ghostProtocol, "StoryUnlockedETH");

      // Verify user can access story
      const canAccess = await ghostProtocol.canUserAccessStory(proofHash, user2.address);
      expect(canAccess).to.equal(true);
    });

    it("should refund overpayment for ETH unlock", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();

      const proofHash = generateProofHash(402);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      const unlockInfo = await ghostProtocol.getStoryUnlockInfo(proofHash);
      const overpayment = unlockInfo.previewUnlockPriceInEth + ethers.parseEther("1");

      const initialBalance = await ethers.provider.getBalance(user2.address);

      const tx = await ghostProtocol.connect(user2).unlockStoryWithETH(proofHash, {
        value: overpayment,
      });

      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      const finalBalance = await ethers.provider.getBalance(user2.address);

      // Fee should be exact, not the overpayment
      expect(initialBalance - finalBalance).to.be.closeTo(
        unlockInfo.previewUnlockPriceInEth + gasUsed,
        ethers.parseEther("0.001") // tolerance for rounding
      );
    });

    it("should reject if insufficient ETH", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();

      const proofHash = generateProofHash(403);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      const unlockInfo = await ghostProtocol.getStoryUnlockInfo(proofHash);
      const insufficientAmount = unlockInfo.previewUnlockPriceInEth / 2n;

      await expect(
        ghostProtocol.connect(user2).unlockStoryWithETH(proofHash, {
          value: insufficientAmount,
        })
      ).to.be.revertedWithCustomError(ghostProtocol, "InsufficientPayment");
    });
  });

  describe("makeStoryPublic", function () {
    it("should allow submitter to make story public", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      const proofHash = generateProofHash(501);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      const tx = ghostProtocol.connect(user1).makeStoryPublic(proofHash);

      await expect(tx).to.emit(ghostProtocol, "StoryMadePublic");

      const evidence = await ghostProtocol.getEvidence(proofHash);
      expect(evidence.isPublic).to.equal(true);
    });

    it("should reject if not submitter", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();

      const proofHash = generateProofHash(502);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      await expect(
        ghostProtocol.connect(user2).makeStoryPublic(proofHash)
      ).to.be.revertedWithCustomError(ghostProtocol, "OnlySubmitter");
    });

    it("should reject if made public twice", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      const proofHash = generateProofHash(503);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      await ghostProtocol.connect(user1).makeStoryPublic(proofHash);

      await expect(
        ghostProtocol.connect(user1).makeStoryPublic(proofHash)
      ).to.be.revertedWithCustomError(ghostProtocol, "StoryAlreadyPublic");
    });
  });

  describe("canUserAccessStory", function () {
    it("should return true if story is public", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();

      const proofHash = generateProofHash(601);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      await ghostProtocol.connect(user1).makeStoryPublic(proofHash);

      const canAccess = await ghostProtocol.canUserAccessStory(proofHash, user2.address);
      expect(canAccess).to.equal(true);
    });

    it("should return true if user unlocked story", async function () {
      const { ghostProtocol, user1, user2 } = await deployFixtures();

      const proofHash = generateProofHash(602);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      const unlockInfo = await ghostProtocol.getStoryUnlockInfo(proofHash);
      await ghostProtocol.connect(user2).unlockStoryWithETH(proofHash, {
        value: unlockInfo.previewUnlockPriceInEth,
      });

      const canAccess = await ghostProtocol.canUserAccessStory(proofHash, user2.address);
      expect(canAccess).to.equal(true);
    });

    it("should return false if user has no access", async function () {
      const { ghostProtocol, user1, user2, user3 } = await deployFixtures();

      const proofHash = generateProofHash(603);

      await ghostProtocol.connect(user1).submitEvidence(
        proofHash,
        50n,
        false,
        "test",
        { value: TEST_CONSTANTS.RECEIPT_FEE }
      );

      const canAccess = await ghostProtocol.canUserAccessStory(proofHash, user3.address);
      expect(canAccess).to.equal(false);
    });
  });
});
