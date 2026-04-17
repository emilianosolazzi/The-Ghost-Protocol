import { expect } from "chai";
import { ethers } from "hardhat";
import {
  deployFixtures,
  TEST_CONSTANTS,
  generateProofHash,
  generateDramaType,
} from "./fixtures/common";

describe("GhostProtocol: Evidence Submission", function () {
  const RECEIPT_FEE = TEST_CONSTANTS.RECEIPT_FEE;

  describe("Direct Evidence", function () {
    it("should submit direct evidence successfully", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();
      const proofHash = generateProofHash(1);
      const severity = 10;
      const dramaType = generateDramaType(0);

      const tx = ghostProtocol
        .connect(user1)
        .submitEvidence(proofHash, severity, "test description", dramaType, "", false, {
          value: RECEIPT_FEE,
        });

      const expectedReward = BigInt(severity) * 50n * 10n ** 18n;

      await expect(tx)
        .to.emit(ghostProtocol, "EvidenceSubmitted")
        .withArgs(proofHash, user1.address, severity, false, expectedReward, dramaType);
    });

    it("should store evidence correctly", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();
      const proofHash = generateProofHash(2);
      const severity = 20;
      const dramaType = generateDramaType(1);

      await ghostProtocol
        .connect(user1)
        .submitEvidence(proofHash, severity, "desc", dramaType, "", false, {
          value: RECEIPT_FEE,
        });

      const evidence = await ghostProtocol.getEvidence(proofHash);
      expect(evidence.timestamp).to.be.gt(0n);
      expect(evidence.weight).to.equal(severity);
      expect(evidence.isProxy).to.equal(false);
      expect(evidence.submitter).to.equal(user1.address);
      expect(evidence.dramaType).to.equal(dramaType);

      const expectedReward = BigInt(severity) * 50n * 10n ** 18n;
      expect(evidence.ghostedRewarded).to.equal(expectedReward);
    });

    it("should reward GHOSTED tokens based on severity", async function () {
      const { ghostProtocol, ghostedToken, user1 } = await deployFixtures();
      const proofHash = generateProofHash(3);
      const severity = 50;

      const balanceBefore = await ghostedToken.balanceOf(user1.address);

      await ghostProtocol
        .connect(user1)
        .submitEvidence(proofHash, severity, "desc", "crypto", "", false, {
          value: RECEIPT_FEE,
        });

      const balanceAfter = await ghostedToken.balanceOf(user1.address);
      const expectedReward = BigInt(severity) * 50n * 10n ** 18n;
      expect(balanceAfter - balanceBefore).to.equal(expectedReward);
    });

    it("should cap reward at MAX_GHOSTED_PER_SUBMISSION", async function () {
      const { ghostProtocol, ghostedToken, user1 } = await deployFixtures();
      const proofHash = generateProofHash(4);
      const severity = 100; // 100 * 50 * 1e18 = 5000e18 = MAX

      const balanceBefore = await ghostedToken.balanceOf(user1.address);

      await ghostProtocol
        .connect(user1)
        .submitEvidence(proofHash, severity, "desc", "crypto", "", false, {
          value: RECEIPT_FEE,
        });

      const balanceAfter = await ghostedToken.balanceOf(user1.address);
      expect(balanceAfter - balanceBefore).to.equal(
        TEST_CONSTANTS.MAX_GHOSTED_PER_SUBMISSION
      );
    });

    it("should update protocol stats after submission", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();
      const proofHash = generateProofHash(5);
      const severity = 10;

      await ghostProtocol
        .connect(user1)
        .submitEvidence(proofHash, severity, "desc", "crypto", "", false, {
          value: RECEIPT_FEE,
        });

      const stats = await ghostProtocol.getProtocolStats();
      expect(stats.totalEvidence).to.equal(1n);
      expect(stats.directEvidence).to.equal(1n);
      expect(stats.proxyEvidence).to.equal(0n);

      const expectedReward = BigInt(severity) * 50n * 10n ** 18n;
      expect(stats.rewardedGhosted).to.equal(expectedReward);
    });
  });

  describe("Proxy Evidence", function () {
    it("should submit proxy evidence (no token reward)", async function () {
      const { ghostProtocol, ghostedToken, user1 } = await deployFixtures();
      const proofHash = generateProofHash(10);
      const severity = 30;
      const dramaType = generateDramaType(2);

      const balanceBefore = await ghostedToken.balanceOf(user1.address);

      const tx = ghostProtocol
        .connect(user1)
        .submitEvidence(proofHash, severity, "proxy desc", dramaType, "", true, {
          value: RECEIPT_FEE,
        });

      await expect(tx)
        .to.emit(ghostProtocol, "EvidenceSubmitted")
        .withArgs(proofHash, user1.address, severity, true, 0, dramaType);

      const balanceAfter = await ghostedToken.balanceOf(user1.address);
      expect(balanceAfter).to.equal(balanceBefore);

      const stats = await ghostProtocol.getProtocolStats();
      expect(stats.proxyEvidence).to.equal(1n);
    });
  });

  describe("Fee Split", function () {
    it("should split receipt fee between treasury and protocol", async function () {
      const { ghostProtocol, user1, treasury } = await deployFixtures();
      const proofHash = generateProofHash(20);

      const treasuryBalBefore = await ethers.provider.getBalance(
        treasury.address
      );

      await ghostProtocol
        .connect(user1)
        .submitEvidence(proofHash, 10, "desc", "crypto", "", false, {
          value: RECEIPT_FEE,
        });

      const treasuryBalAfter = await ethers.provider.getBalance(
        treasury.address
      );

      const expectedTreasuryCut =
        (RECEIPT_FEE * TEST_CONSTANTS.TREASURY_SPLIT_BPS) /
        TEST_CONSTANTS.BPS_DENOMINATOR;

      expect(treasuryBalAfter - treasuryBalBefore).to.equal(
        expectedTreasuryCut
      );
    });

    it("should emit GhostingReceiptSubmitted event", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();
      const proofHash = generateProofHash(21);

      const expectedTreasuryCut =
        (RECEIPT_FEE * TEST_CONSTANTS.TREASURY_SPLIT_BPS) /
        TEST_CONSTANTS.BPS_DENOMINATOR;
      const expectedProtocolCut = RECEIPT_FEE - expectedTreasuryCut;

      const tx = ghostProtocol
        .connect(user1)
        .submitEvidence(proofHash, 10, "desc", "crypto", "", false, {
          value: RECEIPT_FEE,
        });

      await expect(tx)
        .to.emit(ghostProtocol, "GhostingReceiptSubmitted")
        .withArgs(
          user1.address,
          proofHash,
          RECEIPT_FEE,
          expectedTreasuryCut,
          expectedProtocolCut
        );
    });
  });

  describe("Validation & Errors", function () {
    it("should revert with InvalidProofHash on zero hash", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      await expect(
        ghostProtocol
          .connect(user1)
          .submitEvidence(ethers.ZeroHash, 10, "desc", "crypto", "", false, {
            value: RECEIPT_FEE,
          })
      ).to.be.revertedWithCustomError(ghostProtocol, "InvalidProofHash");
    });

    it("should revert with InvalidSeverity on severity=0", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      await expect(
        ghostProtocol
          .connect(user1)
          .submitEvidence(generateProofHash(30), 0, "desc", "crypto", "", false, {
            value: RECEIPT_FEE,
          })
      ).to.be.revertedWithCustomError(ghostProtocol, "InvalidSeverity");
    });

    it("should revert with InvalidSeverity on severity>100", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      await expect(
        ghostProtocol
          .connect(user1)
          .submitEvidence(generateProofHash(31), 101, "desc", "crypto", "", false, {
            value: RECEIPT_FEE,
          })
      ).to.be.revertedWithCustomError(ghostProtocol, "InvalidSeverity");
    });

    it("should revert with EvidenceAlreadyExists on duplicate", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();
      const proofHash = generateProofHash(32);

      await ghostProtocol
        .connect(user1)
        .submitEvidence(proofHash, 10, "desc", "crypto", "", false, {
          value: RECEIPT_FEE,
        });

      await expect(
        ghostProtocol
          .connect(user1)
          .submitEvidence(proofHash, 10, "desc", "crypto", "", false, {
            value: RECEIPT_FEE,
          })
      ).to.be.revertedWithCustomError(ghostProtocol, "EvidenceAlreadyExists");
    });

    it("should revert with InsufficientEth on low fee", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();

      await expect(
        ghostProtocol
          .connect(user1)
          .submitEvidence(generateProofHash(33), 10, "desc", "crypto", "", false, {
            value: ethers.parseEther("0.001"),
          })
      ).to.be.revertedWithCustomError(ghostProtocol, "InsufficientEth");
    });

    it("should revert with ContractPaused when paused", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();
      await ghostProtocol.setPaused(true);

      await expect(
        ghostProtocol
          .connect(user1)
          .submitEvidence(generateProofHash(34), 10, "desc", "crypto", "", false, {
            value: RECEIPT_FEE,
          })
      ).to.be.revertedWithCustomError(ghostProtocol, "ContractPaused");
    });

    it("should refund overpayment", async function () {
      const { ghostProtocol, user1 } = await deployFixtures();
      const proofHash = generateProofHash(35);
      const overpay = ethers.parseEther("1.0");

      const balBefore = await ethers.provider.getBalance(user1.address);

      const tx = await ghostProtocol
        .connect(user1)
        .submitEvidence(proofHash, 10, "desc", "crypto", "", false, {
          value: overpay,
        });
      const receipt = await tx.wait();
      const gasCost = BigInt(receipt!.gasUsed) * BigInt(receipt!.gasPrice);

      const balAfter = await ethers.provider.getBalance(user1.address);

      // User should only be charged RECEIPT_FEE + gas, rest refunded
      const netSpent = balBefore - balAfter - gasCost;
      expect(netSpent).to.equal(RECEIPT_FEE);
    });
  });
});
