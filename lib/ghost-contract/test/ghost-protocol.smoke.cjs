const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GhostedToken smoke", function () {
  async function deployTokenFixture() {
    const [owner, protocol, user] = await ethers.getSigners();

    const GhostedToken = await ethers.getContractFactory("GhostedToken");
    const ghostedToken = await GhostedToken.deploy(owner.address);
    await ghostedToken.waitForDeployment();

    return {
      owner,
      protocol,
      user,
      ghostedToken,
    };
  }

  it("mints the full fixed supply to the initial holder", async function () {
    const { owner, ghostedToken } = await deployTokenFixture();

    expect(await ghostedToken.totalSupply()).to.equal(ethers.parseEther("1000000000"));
    expect(await ghostedToken.balanceOf(owner.address)).to.equal(ethers.parseEther("1000000000"));
  });

  it("uses two-step ownership inherited from Ownable2Step", async function () {
    const { owner, protocol, ghostedToken } = await deployTokenFixture();

    await expect(ghostedToken.connect(owner).transferOwnership(protocol.address))
      .to.emit(ghostedToken, "OwnershipTransferStarted")
      .withArgs(owner.address, protocol.address);

    await expect(ghostedToken.connect(protocol).acceptOwnership())
      .to.emit(ghostedToken, "OwnershipTransferred")
      .withArgs(owner.address, protocol.address);
  });

  it("rejects zero protocol assignment", async function () {
    const { ghostedToken } = await deployTokenFixture();

    await expect(ghostedToken.setProtocol(ethers.ZeroAddress))
      .to.be.revertedWithCustomError(ghostedToken, "OwnableInvalidOwner");
  });

  it("locks the protocol address and prevents further changes", async function () {
    const { protocol, ghostedToken } = await deployTokenFixture();

    await expect(ghostedToken.setProtocol(protocol.address))
      .to.emit(ghostedToken, "ProtocolSet")
      .withArgs(protocol.address);

    await expect(ghostedToken.lockProtocol())
      .to.emit(ghostedToken, "ProtocolLocked")
      .withArgs(protocol.address);

    await expect(ghostedToken.setProtocol(protocol.address))
      .to.be.revertedWithCustomError(ghostedToken, "ProtocolAlreadyLocked");

    await expect(ghostedToken.lockProtocol())
      .to.be.revertedWithCustomError(ghostedToken, "ProtocolAlreadyLocked");
  });

  it("restricts burn authority to the registered protocol", async function () {
    const { owner, protocol, user, ghostedToken } = await deployTokenFixture();

    await ghostedToken.transfer(user.address, ethers.parseEther("100"));
    await ghostedToken.setProtocol(protocol.address);

    await expect(ghostedToken.connect(user)["burn(address,uint256)"](user.address, ethers.parseEther("10")))
      .to.be.revertedWithCustomError(ghostedToken, "NotProtocol");

    await ghostedToken.connect(protocol)["burn(address,uint256)"](user.address, ethers.parseEther("10"));
    expect(await ghostedToken.balanceOf(user.address)).to.equal(ethers.parseEther("90"));
    expect(await ghostedToken.totalSupply()).to.equal(ethers.parseEther("999999990"));
  });

  it("restricts credibility writes to the registered protocol", async function () {
    const { protocol, user, ghostedToken } = await deployTokenFixture();

    await ghostedToken.setProtocol(protocol.address);

    await expect(ghostedToken.connect(user).updateCredibilityScore(user.address, ethers.parseEther("5")))
      .to.be.revertedWithCustomError(ghostedToken, "NotProtocol");

    await expect(ghostedToken.connect(protocol).updateCredibilityScore(user.address, ethers.parseEther("5")))
      .to.emit(ghostedToken, "CredibilityUpdated")
      .withArgs(user.address, 0n, ethers.parseEther("5"));

    expect(await ghostedToken.credibilityScore(user.address)).to.equal(ethers.parseEther("5"));
  });
});

describe("GhostProtocol smoke", function () {
  async function deployFixture() {
    const [owner, treasury, oracle, pendingOwner, submitter, unlocker] = await ethers.getSigners();

    const MockToken = await ethers.getContractFactory("MockERC20");
    const ghostedToken = await MockToken.deploy(
      "GHOSTED",
      "GHOSTED",
      ethers.parseEther("1000000")
    );
    await ghostedToken.waitForDeployment();

    const GhostProtocol = await ethers.getContractFactory("GhostProtocol");
    const ghostProtocol = await GhostProtocol.deploy(
      await ghostedToken.getAddress(),
      treasury.address,
      oracle.address
    );
    await ghostProtocol.waitForDeployment();
    await ghostedToken.setProtocol(await ghostProtocol.getAddress());
    await ghostProtocol.connect(oracle).setUnlockPriceQuote(1_000_000_000_000n);

    await ghostedToken.transfer(await ghostProtocol.getAddress(), ethers.parseEther("250000"));
    await ghostedToken.transfer(unlocker.address, ethers.parseEther("5000"));
    await ghostedToken.connect(unlocker).approve(await ghostProtocol.getAddress(), ethers.MaxUint256);

    return {
      owner,
      treasury,
      oracle,
      pendingOwner,
      submitter,
      unlocker,
      ghostedToken,
      ghostProtocol,
    };
  }

  it("rejects zero addresses in constructor with InvalidAddress", async function () {
    const [, treasury, oracle] = await ethers.getSigners();
    const GhostProtocol = await ethers.getContractFactory("GhostProtocol");

    await expect(
      GhostProtocol.deploy(ethers.ZeroAddress, treasury.address, oracle.address)
    ).to.be.revertedWithCustomError(GhostProtocol, "InvalidAddress");
  });

  it("uses a two-step ownership transfer", async function () {
    const { ghostProtocol, owner, pendingOwner } = await deployFixture();

    await expect(ghostProtocol.connect(owner).transferOwnership(pendingOwner.address))
      .to.emit(ghostProtocol, "OwnershipTransferStarted")
      .withArgs(owner.address, pendingOwner.address);

    expect(await ghostProtocol.owner()).to.equal(owner.address);
    expect(await ghostProtocol.pendingOwner()).to.equal(pendingOwner.address);

    await expect(ghostProtocol.connect(pendingOwner).acceptOwnership())
      .to.emit(ghostProtocol, "OwnershipTransferred")
      .withArgs(owner.address, pendingOwner.address);

    expect(await ghostProtocol.owner()).to.equal(pendingOwner.address);
    expect(await ghostProtocol.pendingOwner()).to.equal(ethers.ZeroAddress);
  });

  it("submits direct evidence and pays the configured reward", async function () {
    const { ghostProtocol, ghostedToken, submitter } = await deployFixture();
    const proofHash = ethers.id("proof-smoke-1");
    const severity = 32n;
    const reward = severity * 50n * 10n ** 18n;

    const beforeBalance = await ghostedToken.balanceOf(submitter.address);

    await expect(
      ghostProtocol
        .connect(submitter)
        .submitEvidence(proofHash, severity, "oh it hurts", "Orbiting", "", false, {
          value: ethers.parseEther("0.0095"),
        })
    )
      .to.emit(ghostProtocol, "EvidenceSubmitted")
      .withArgs(proofHash, submitter.address, severity, false, reward, "Orbiting");

    const afterBalance = await ghostedToken.balanceOf(submitter.address);
    expect(afterBalance - beforeBalance).to.equal(reward);
  });

  it("tracks fee split tokenomics between treasury and retained protocol revenue", async function () {
    const { ghostProtocol, submitter } = await deployFixture();
    const proofHash = ethers.id("proof-tokenomics-fee-split");
    const fee = ethers.parseEther("0.0095");
    const treasuryCut = (fee * 3000n) / 10000n;
    const protocolCut = fee - treasuryCut;

    await expect(
      ghostProtocol
        .connect(submitter)
        .submitEvidence(proofHash, 45n, "fee split", "economics", "", false, {
          value: fee,
        })
    )
      .to.emit(ghostProtocol, "GhostingReceiptSubmitted")
      .withArgs(submitter.address, proofHash, fee, treasuryCut, protocolCut);

    const stats = await ghostProtocol.getProtocolStats();
    expect(stats[6]).to.equal(fee);
    expect(stats[7]).to.equal(treasuryCut);
    expect(stats[8]).to.equal(protocolCut);
    expect(stats[10]).to.equal(protocolCut);
  });

  it("does not reward proxy submissions with GHOSTED", async function () {
    const { ghostProtocol, ghostedToken, submitter } = await deployFixture();
    const proofHash = ethers.id("proof-tokenomics-proxy");
    const beforeBalance = await ghostedToken.balanceOf(submitter.address);

    await ghostProtocol
      .connect(submitter)
      .submitEvidence(proofHash, 99n, "proxy evidence", "witness", "", true, {
        value: ethers.parseEther("0.0095"),
      });

    const afterBalance = await ghostedToken.balanceOf(submitter.address);
    expect(afterBalance).to.equal(beforeBalance);

    const stats = await ghostProtocol.getProtocolStats();
    expect(stats[1]).to.equal(0n);
    expect(stats[2]).to.equal(1n);
  });

  it("rejects drama types longer than the configured maximum", async function () {
    const { ghostProtocol, submitter } = await deployFixture();

    await expect(
      ghostProtocol
        .connect(submitter)
        .submitEvidence(ethers.id("proof-smoke-long-drama"), 20n, "too long", "x".repeat(33), "", false, {
          value: ethers.parseEther("0.0095"),
        })
    ).to.be.revertedWithCustomError(ghostProtocol, "InvalidDramaTypeLength");
  });

  it("rejects content CIDs longer than the configured maximum", async function () {
    const { ghostProtocol, submitter } = await deployFixture();

    await expect(
      ghostProtocol
        .connect(submitter)
        .submitEvidence(ethers.id("proof-smoke-long-cid"), 20n, "too long", "crypto", "b".repeat(129), false, {
          value: ethers.parseEther("0.0095"),
        })
    ).to.be.revertedWithCustomError(ghostProtocol, "InvalidContentCidLength");
  });

  it("uses the token decimals when previewing the ETH unlock price", async function () {
    const { ghostProtocol, submitter } = await deployFixture();
    const proofHash = ethers.id("proof-smoke-2");

    await ghostProtocol
      .connect(submitter)
      .submitEvidence(proofHash, 50n, "story", "crypto", "", false, {
        value: ethers.parseEther("0.0095"),
      });

    expect(await ghostProtocol.previewUnlockPriceInEth(proofHash)).to.equal(500000000000000n);
  });

  it("unlocks by credibility when the token supports credibility scores", async function () {
    const { ghostProtocol, ghostedToken, submitter, unlocker } = await deployFixture();
    const proofHash = ethers.id("proof-smoke-3");

    await ghostProtocol
      .connect(submitter)
      .submitEvidence(proofHash, 80n, "cred path", "Orbiting", "", false, {
        value: ethers.parseEther("0.0095"),
      });

    await ghostedToken.seedCredibilityScore(unlocker.address, ethers.parseEther("2000"));

    await expect(ghostProtocol.connect(unlocker).unlockStoryByCredibility(proofHash))
      .to.emit(ghostProtocol, "StoryUnlocked")
      .withArgs(proofHash, unlocker.address, 0n, "CREDIBILITY");

    expect(await ghostProtocol.canUserAccessStory(proofHash, unlocker.address)).to.equal(true);
  });

  it("splits burn unlock cost between burn and submitter payout", async function () {
    const { ghostProtocol, ghostedToken, submitter, unlocker } = await deployFixture();
    const proofHash = ethers.id("proof-tokenomics-burn-unlock");

    await ghostProtocol
      .connect(submitter)
      .submitEvidence(proofHash, 75n, "burn path", "crypto", "", false, {
        value: ethers.parseEther("0.0095"),
      });

    const initialSupply = await ghostedToken.totalSupply();
    const submitterBefore = await ghostedToken.balanceOf(submitter.address);
    const unlockInfoBefore = await ghostProtocol.getStoryUnlockInfo(proofHash);
    const currentPrice = unlockInfoBefore[0];
    const expectedBurn = currentPrice / 2n;
    const expectedSubmitterShare = currentPrice - expectedBurn;

    await ghostProtocol.connect(unlocker).unlockStoryByBurn(proofHash);

    const submitterAfter = await ghostedToken.balanceOf(submitter.address);
    expect(submitterAfter - submitterBefore).to.equal(expectedSubmitterShare);

    const finalSupply = await ghostedToken.totalSupply();
    expect(initialSupply - finalSupply).to.equal(expectedBurn);

    const stats = await ghostProtocol.getProtocolStats();
    expect(stats[5]).to.equal(expectedBurn);

    const unlockInfoAfter = await ghostProtocol.getStoryUnlockInfo(proofHash);
    expect(unlockInfoAfter[1]).to.equal(1n);
    expect(unlockInfoAfter[3]).to.equal(expectedSubmitterShare);
  });

  it("tracks protocol credibility separately from token credibility", async function () {
    const { ghostProtocol, submitter, unlocker, oracle } = await deployFixture();
    const proofHash = ethers.id("proof-smoke-cred-ledger");

    await ghostProtocol
      .connect(submitter)
      .submitEvidence(proofHash, 65n, "truth path", "crypto", "", false, {
        value: ethers.parseEther("0.0095"),
      });

    await ghostProtocol.connect(unlocker).assertTruth(proofHash, true);
    await ghostProtocol.connect(oracle).resolveTruth(proofHash, 0n, true);

    const credibility = await ghostProtocol.getUserCredibility(unlocker.address);
    expect(credibility[0]).to.equal(0n);
    expect(credibility[1]).to.equal(ethers.parseEther("100"));
    expect(credibility[2]).to.equal(ethers.parseEther("100"));
  });

  it("applies wrong-truth penalties by burning half stake and compensating submitter", async function () {
    const { ghostProtocol, ghostedToken, submitter, unlocker, oracle } = await deployFixture();
    const proofHash = ethers.id("proof-tokenomics-wrong-truth");

    await ghostProtocol
      .connect(submitter)
      .submitEvidence(proofHash, 60n, "penalty path", "crypto", "", false, {
        value: ethers.parseEther("0.0095"),
      });

    const totalSupplyBefore = await ghostedToken.totalSupply();
    const submitterBalanceBefore = await ghostedToken.balanceOf(submitter.address);

    await ghostProtocol.connect(unlocker).assertTruth(proofHash, true);
    await ghostProtocol.connect(oracle).resolveTruth(proofHash, 0n, false);

    const halfStake = ethers.parseEther("50");
    const totalSupplyAfter = await ghostedToken.totalSupply();
    const submitterBalanceAfter = await ghostedToken.balanceOf(submitter.address);

    expect(totalSupplyBefore - totalSupplyAfter).to.equal(halfStake);
    expect(submitterBalanceAfter - submitterBalanceBefore).to.equal(halfStake);

    const stats = await ghostProtocol.getProtocolStats();
    expect(stats[5]).to.equal(halfStake);
  });

  it("rejects ETH unlock previews when the quote is stale", async function () {
    const { ghostProtocol, submitter } = await deployFixture();
    const proofHash = ethers.id("proof-smoke-stale-quote");

    await ghostProtocol
      .connect(submitter)
      .submitEvidence(proofHash, 40n, "stale quote path", "crypto", "", false, {
        value: ethers.parseEther("0.0095"),
      });

    await ethers.provider.send("evm_increaseTime", [86_401]);
    await ethers.provider.send("evm_mine", []);

    await expect(ghostProtocol.previewUnlockPriceInEth(proofHash))
      .to.be.revertedWithCustomError(ghostProtocol, "StaleUnlockPriceQuote");
  });

  it("withdraws retained protocol ETH to treasury", async function () {
    const { ghostProtocol, treasury, submitter } = await deployFixture();
    const proofHash = ethers.id("proof-smoke-4");
    const fee = ethers.parseEther("0.0095");
    const treasuryCut = (fee * 3000n) / 10000n;
    const protocolCut = fee - treasuryCut;

    await ghostProtocol
      .connect(submitter)
      .submitEvidence(proofHash, 50n, "withdraw path", "crypto", "", false, {
        value: fee,
      });

    const treasuryBalanceBefore = await ethers.provider.getBalance(treasury.address);

    await expect(ghostProtocol.withdrawProtocolETH(protocolCut))
      .to.emit(ghostProtocol, "ProtocolRevenueWithdrawn")
      .withArgs(treasury.address, protocolCut);

    const treasuryBalanceAfter = await ethers.provider.getBalance(treasury.address);
    expect(treasuryBalanceAfter - treasuryBalanceBefore).to.equal(protocolCut);

    const stats = await ghostProtocol.getProtocolStats();
    expect(stats[8]).to.equal(protocolCut);
    expect(stats[9]).to.equal(protocolCut);
    expect(stats[10]).to.equal(0n);
  });
});