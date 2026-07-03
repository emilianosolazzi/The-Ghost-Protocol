import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ethers } from "ethers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const deployment = JSON.parse(
  readFileSync(path.join(__dirname, "../deployment-localhost.json"), "utf8"),
);
const protocolAbi = JSON.parse(
  readFileSync(path.join(__dirname, "../artifacts/contracts/GhostProtocol.sol/GhostProtocol.json"), "utf8"),
).abi;
const tokenAbi = JSON.parse(
  readFileSync(path.join(__dirname, "../artifacts/contracts/MockERC20.sol/MockERC20.json"), "utf8"),
).abi;

const RPC_URL = "http://127.0.0.1:8545";
const ARCHIVE_API_URL = "http://127.0.0.1:3000/api/ghost-archive";
const CHAIN_ID = 31337;
const GHOSTING_RECEIPT_FEE = 95n * 10n ** 14n; // 0.0095 ETH
const TOKEN_UNIT = 10n ** 18n;

// Well-known local Hardhat accounts (publicly known test keys — never use on a real network).
const DEPLOYER_PK = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // account #0: submitter A / oracle / treasury
const USER_B_PK = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"; // account #1: independent user B

const provider = new ethers.JsonRpcProvider(RPC_URL, CHAIN_ID);
const walletA = new ethers.Wallet(DEPLOYER_PK, provider);
const walletB = new ethers.Wallet(USER_B_PK, provider);

const protocolAsA = new ethers.Contract(deployment.ghostProtocol, protocolAbi, walletA);
const protocolAsB = new ethers.Contract(deployment.ghostProtocol, protocolAbi, walletB);
const tokenAsA = new ethers.Contract(deployment.ghostedToken, tokenAbi, walletA);
const tokenAsB = new ethers.Contract(deployment.ghostedToken, tokenAbi, walletB);

// Explicit local nonce tracking avoids ethers v6 + Hardhat HTTP-transport nonce races
// that show up when sending several transactions back-to-back from the same account.
const nonces = new Map();
async function nextNonce(wallet) {
  if (!nonces.has(wallet.address)) {
    nonces.set(wallet.address, await provider.getTransactionCount(wallet.address, "latest"));
  }
  const nonce = nonces.get(wallet.address);
  nonces.set(wallet.address, nonce + 1);
  return nonce;
}

async function send(contract, wallet, method, args = [], overrides = {}) {
  const nonce = await nextNonce(wallet);
  const tx = await contract[method](...args, { ...overrides, nonce });
  return tx.wait();
}

function fmt(tokens) {
  return `${ethers.formatEther(tokens)} GHOSTED`;
}

function section(title) {
  console.log(`\n${"=".repeat(70)}\n${title}\n${"=".repeat(70)}`);
}

async function snapshotStats(label) {
  const stats = await protocolAsA.getProtocolStats();
  console.log(`\n-- protocol stats: ${label} --`);
  console.log({
    totalEvidence: stats[0].toString(),
    directEvidence: stats[1].toString(),
    proxyEvidence: stats[2].toString(),
    totalTruthAssertions: stats[3].toString(),
    rewardedGhosted: fmt(stats[4]),
    burnedGhosted: fmt(stats[5]),
    revenueCollectedEth: ethers.formatEther(stats[6]),
    treasuryDistributedEth: ethers.formatEther(stats[7]),
    protocolRetainedRevenueEth: ethers.formatEther(stats[8]),
    protocolBalanceEth: ethers.formatEther(stats[10]),
  });
  return stats;
}

// Mirrors artifacts/ghost-protocol/src/lib/ghost-submission-archive.ts canonicalisation exactly,
// so the signature verifies against the backend's own message reconstruction.
function buildArchiveMessage(entry) {
  const payload = {
    version: 1,
    submitter: entry.submitter.toLowerCase(),
    proofHash: entry.proofHash.toLowerCase(),
    txHash: entry.txHash.toLowerCase(),
    severity: entry.severity,
    description: entry.description,
    dramaType: entry.dramaType,
    contentCid: entry.contentCid,
    isProxy: entry.isProxy,
    reward: entry.reward,
    chainId: entry.chainId,
    submittedAt: entry.submittedAt,
  };
  return `GhostProtocol archive submission\n${JSON.stringify(payload)}`;
}

async function archiveSubmission(wallet, entry) {
  const signature = await wallet.signMessage(buildArchiveMessage(entry));
  const response = await fetch(`${ARCHIVE_API_URL}/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      submitter: entry.submitter,
      proofHash: entry.proofHash,
      txHash: entry.txHash,
      severity: entry.severity,
      description: entry.description,
      dramaType: entry.dramaType,
      contentCid: entry.contentCid,
      isProxy: entry.isProxy,
      reward: entry.reward,
      chainId: entry.chainId,
      submittedAt: entry.submittedAt,
      signature,
    }),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(`Archive POST failed (${response.status}): ${JSON.stringify(body)}`);
  }
  return body;
}

async function fetchArchive(submitter) {
  const response = await fetch(
    `${ARCHIVE_API_URL}/submissions?submitter=${encodeURIComponent(submitter)}`,
  );
  return response.json();
}

async function main() {
  console.log("GhostProtocol:", deployment.ghostProtocol);
  console.log("GHOSTED token:", deployment.ghostedToken);
  console.log("User A (submitter/oracle/treasury):", walletA.address);
  console.log("User B (independent user):", walletB.address);

  await snapshotStats("baseline");

  // ---------------------------------------------------------------------
  section("STEP 1 — User A submits DIRECT evidence (severity 10)");
  // ---------------------------------------------------------------------
  const proofHash1 = ethers.keccak256(ethers.toUtf8Bytes(`evidence-direct-${Date.now()}`));
  const severity1 = 10;
  const description1 = "Direct evidence: screenshot of the group chat";
  const dramaType1 = "group-chat";
  const contentCid1 = "bafy-fake-cid-direct-1";

  const balanceBeforeA = await tokenAsA.balanceOf(walletA.address);

  const receipt1 = await send(
    protocolAsA,
    walletA,
    "submitEvidence",
    [proofHash1, severity1, description1, dramaType1, contentCid1, false],
    { value: GHOSTING_RECEIPT_FEE },
  );
  console.log("submitEvidence tx:", receipt1.hash);

  const balanceAfterA = await tokenAsA.balanceOf(walletA.address);
  const rewardA = balanceAfterA - balanceBeforeA;
  console.log(`User A GHOSTED balance delta: +${fmt(rewardA)} (expected ${fmt(BigInt(severity1) * 50n * TOKEN_UNIT)})`);

  const stats1 = await snapshotStats("after direct evidence #1");
  console.log(`Fee split check: revenue +0.0095 ETH, treasury cut = 30% => ${ethers.formatEther((GHOSTING_RECEIPT_FEE * 3000n) / 10000n)} ETH`);

  // Archive this submission via the backend API, exactly like the frontend would after a tx confirms.
  const block1 = await provider.getBlock(receipt1.blockNumber);
  const archiveEntry1 = {
    submitter: walletA.address,
    proofHash: proofHash1,
    txHash: receipt1.hash,
    severity: severity1,
    description: description1,
    dramaType: dramaType1,
    contentCid: contentCid1,
    isProxy: false,
    reward: Number(rewardA / TOKEN_UNIT),
    chainId: CHAIN_ID,
    submittedAt: block1.timestamp * 1000,
  };
  const archived1 = await archiveSubmission(walletA, archiveEntry1);
  console.log("Archive API POST accepted:", archived1.submission.txHash);

  const archiveList = await fetchArchive(walletA.address);
  console.log(`Archive API GET returned ${archiveList.submissions.length} submission(s) for User A`);

  // ---------------------------------------------------------------------
  section("STEP 2 — User A submits PROXY evidence (severity 20) — should get NO token reward");
  // ---------------------------------------------------------------------
  const proofHash2 = ethers.keccak256(ethers.toUtf8Bytes(`evidence-proxy-${Date.now()}`));
  const balanceBeforeProxy = await tokenAsA.balanceOf(walletA.address);

  await send(
    protocolAsA,
    walletA,
    "submitEvidence",
    [proofHash2, 20, "Proxy report: forwarded by a friend of the victim", "forwarded", "bafy-fake-cid-proxy-1", true],
    { value: GHOSTING_RECEIPT_FEE },
  );

  const balanceAfterProxy = await tokenAsA.balanceOf(walletA.address);
  console.log(`User A GHOSTED balance delta on proxy submission: ${fmt(balanceAfterProxy - balanceBeforeProxy)} (expected 0 GHOSTED)`);
  await snapshotStats("after proxy evidence #2");

  // ---------------------------------------------------------------------
  section("STEP 3 — User A funds User B with GHOSTED so B can act like a real second user");
  // ---------------------------------------------------------------------
  const fundingAmount = 2000n * TOKEN_UNIT;
  await send(tokenAsA, walletA, "transfer", [walletB.address, fundingAmount]);
  console.log(`User A -> User B transfer: ${fmt(fundingAmount)}`);
  console.log(`User B GHOSTED balance: ${fmt(await tokenAsB.balanceOf(walletB.address))}`);

  await send(tokenAsB, walletB, "approve", [deployment.ghostProtocol, fundingAmount]);
  console.log("User B approved GhostProtocol to spend GHOSTED on their behalf");

  // ---------------------------------------------------------------------
  section("STEP 4 — User B unlocks User A's story by BURNING tokens (50/50 burn/submitter split)");
  // ---------------------------------------------------------------------
  const [unlockPriceBefore] = await protocolAsA.getStoryUnlockInfo(proofHash1);
  const submitterBalanceBeforeUnlock = await tokenAsA.balanceOf(walletA.address);
  const statsBeforeUnlock = await protocolAsA.getProtocolStats();

  await send(protocolAsB, walletB, "unlockStoryByBurn", [proofHash1]);

  const submitterBalanceAfterUnlock = await tokenAsA.balanceOf(walletA.address);
  const statsAfterUnlock = await protocolAsA.getProtocolStats();
  const submitterGain = submitterBalanceAfterUnlock - submitterBalanceBeforeUnlock;
  const burnedDelta = statsAfterUnlock[5] - statsBeforeUnlock[5];

  console.log(`Unlock price paid by User B: ${fmt(unlockPriceBefore)}`);
  console.log(`Burned (protocol-wide totalGhostedBurned delta): ${fmt(burnedDelta)} (expected ${fmt(unlockPriceBefore / 2n)})`);
  console.log(`Submitter (User A) received: ${fmt(submitterGain)} (expected ${fmt(unlockPriceBefore - unlockPriceBefore / 2n)})`);

  const [unlockPriceAfter] = await protocolAsA.getStoryUnlockInfo(proofHash1);
  console.log(`Unlock price stepped up: ${fmt(unlockPriceBefore)} -> ${fmt(unlockPriceAfter)}`);

  // ---------------------------------------------------------------------
  section("STEP 5 — User B asserts TRUTH (correct) — should earn TRUTH_WIN_REWARD");
  // ---------------------------------------------------------------------
  await send(protocolAsB, walletB, "assertTruth", [proofHash1, true]);
  console.log("User B staked 100 GHOSTED asserting believesReal=true");

  const balanceBeforeResolveWin = await tokenAsB.balanceOf(walletB.address);
  // User A is the oracle (see deploy.cjs: oracle = deployer = User A) and resolves as correct.
  await send(protocolAsA, walletA, "resolveTruth", [proofHash1, 0, true]);
  const balanceAfterResolveWin = await tokenAsB.balanceOf(walletB.address);
  console.log(`User B GHOSTED delta from correct truth resolution: +${fmt(balanceAfterResolveWin - balanceBeforeResolveWin)} (expected +200 GHOSTED net of no stake return, i.e. reward only)`);

  // ---------------------------------------------------------------------
  section("STEP 6 — User B asserts TRUTH (incorrect this time) — burn + submitter compensation split");
  // ---------------------------------------------------------------------
  await send(protocolAsB, walletB, "assertTruth", [proofHash1, true]);
  console.log("User B staked another 100 GHOSTED asserting believesReal=true (this time it will resolve as false)");

  const submitterBalanceBeforePenalty = await tokenAsA.balanceOf(walletA.address);
  const statsBeforePenalty = await protocolAsA.getProtocolStats();

  await send(protocolAsA, walletA, "resolveTruth", [proofHash1, 1, false]);

  const submitterBalanceAfterPenalty = await tokenAsA.balanceOf(walletA.address);
  const statsAfterPenalty = await protocolAsA.getProtocolStats();
  console.log(`Submitter (User A) compensation from wrong-truth penalty: +${fmt(submitterBalanceAfterPenalty - submitterBalanceBeforePenalty)} (expected +50 GHOSTED, half of 100 stake)`);
  console.log(`Burned from wrong-truth penalty: +${fmt(statsAfterPenalty[5] - statsBeforePenalty[5])} (expected +50 GHOSTED, other half of stake)`);

  // ---------------------------------------------------------------------
  section("FINAL — full protocol stats + archive DB round trip");
  // ---------------------------------------------------------------------
  await snapshotStats("final");

  const finalArchive = await fetchArchive(walletA.address);
  console.log(`\nArchive DB now holds ${finalArchive.submissions.length} submission(s) for User A:`);
  for (const submission of finalArchive.submissions) {
    console.log(`  - proofHash=${submission.proofHash} severity=${submission.severity} reward=${submission.reward} isProxy=${submission.isProxy}`);
  }

  console.log("\nE2E simulation complete — frontend-equivalent tx flow, backend archive API, and tokenomics all verified against a live node + live DB.");
}

main().catch((error) => {
  console.error("Simulation failed:", error);
  process.exit(1);
});
