import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ethers } from "ethers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const deployment = JSON.parse(
  readFileSync(path.join(__dirname, "../deployment-localhost.json"), "utf8"),
);

const protocolAbi = JSON.parse(
  readFileSync(
    path.join(__dirname, "../artifacts/contracts/GhostProtocol.sol/GhostProtocol.json"),
    "utf8",
  ),
).abi;

const tokenAbi = JSON.parse(
  readFileSync(
    path.join(__dirname, "../artifacts/contracts/MockERC20.sol/MockERC20.json"),
    "utf8",
  ),
).abi;

const RPC_URL = "http://127.0.0.1:8545";
const ARCHIVE_API_URL = "http://127.0.0.1:3000/api/ghost-archive";
const CHAIN_ID = 31337;

const RECEIPT_FEE = 95n * 10n ** 14n; // 0.0095 ETH
const TOKEN_UNIT = 10n ** 18n;
const BASE_UNLOCK_PRICE = 500n * TOKEN_UNIT;
const UNLOCK_PRICE_STEP = 50n * TOKEN_UNIT;
const TRUTH_STAKE = 100n * TOKEN_UNIT;
const TRUTH_WIN_REWARD = 200n * TOKEN_UNIT;

const DEPLOYER_PK = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // owner/oracle/submitter
const USER_B_PK = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"; // account #1
const USER_C_PK = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"; // account #2

const provider = new ethers.JsonRpcProvider(RPC_URL, CHAIN_ID);
const walletA = new ethers.Wallet(DEPLOYER_PK, provider);
const walletB = new ethers.Wallet(USER_B_PK, provider);
const walletC = new ethers.Wallet(USER_C_PK, provider);

const protocolAsA = new ethers.Contract(deployment.ghostProtocol, protocolAbi, walletA);
const protocolAsB = new ethers.Contract(deployment.ghostProtocol, protocolAbi, walletB);
const protocolAsC = new ethers.Contract(deployment.ghostProtocol, protocolAbi, walletC);
const tokenAsA = new ethers.Contract(deployment.ghostedToken, tokenAbi, walletA);
const tokenAsB = new ethers.Contract(deployment.ghostedToken, tokenAbi, walletB);
const tokenAsC = new ethers.Contract(deployment.ghostedToken, tokenAbi, walletC);

const protocolInterface = new ethers.Interface(protocolAbi);

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

function ensure(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function expectedRewardWei(severity, isProxy) {
  if (isProxy) return 0n;
  const raw = BigInt(severity) * 50n * TOKEN_UNIT;
  const max = 5_000n * TOKEN_UNIT;
  return raw > max ? max : raw;
}

function expectedRewardWhole(severity, isProxy) {
  return Number(expectedRewardWei(severity, isProxy) / TOKEN_UNIT);
}

function buildArchiveMessage(entry) {
  return `GhostProtocol archive submission\n${JSON.stringify({
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
  })}`;
}

async function postArchive(entry, signature) {
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

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  return { status: response.status, body };
}

async function fetchArchiveBySubmitter(submitter) {
  const response = await fetch(
    `${ARCHIVE_API_URL}/submissions?submitter=${encodeURIComponent(submitter)}`,
  );
  const body = await response.json();
  ensure(response.ok, `Archive GET failed (${response.status}): ${JSON.stringify(body)}`);
  return body;
}

function findSubmissionByTx(submissions, txHash) {
  const canonical = txHash.toLowerCase();
  return submissions.filter((item) => item.txHash.toLowerCase() === canonical);
}

function decodeCustomErrorName(error) {
  const candidates = [
    error?.data,
    error?.error?.data,
    error?.info?.error?.data,
    error?.info?.data,
  ].filter((value) => typeof value === "string" && value.startsWith("0x"));

  for (const revertData of candidates) {
    try {
      const decoded = protocolInterface.parseError(revertData);
      if (decoded?.name) {
        return decoded.name;
      }
    } catch {
      // ignore non-matching revert data blobs
    }
  }

  return null;
}

async function expectRevert(action, expectedHint) {
  try {
    await action();
  } catch (error) {
    const message = String(error?.shortMessage ?? error?.message ?? error);
    const decodedName = decodeCustomErrorName(error);

    if (message.includes(expectedHint) || decodedName === expectedHint) {
      return;
    }

    throw new Error(
      `Unexpected revert content: expected ${expectedHint}, got message=${message} decoded=${decodedName ?? "none"}`,
    );
  }
  throw new Error(`Expected revert containing ${expectedHint}, but call succeeded`);
}

async function ensureTokenFunding(minimumNeeded) {
  const bBalance = await tokenAsB.balanceOf(walletB.address);
  if (bBalance < minimumNeeded) {
    await send(tokenAsA, walletA, "transfer", [walletB.address, minimumNeeded - bBalance]);
  }

  const cBalance = await tokenAsC.balanceOf(walletC.address);
  if (cBalance < minimumNeeded) {
    await send(tokenAsA, walletA, "transfer", [walletC.address, minimumNeeded - cBalance]);
  }

  await send(tokenAsB, walletB, "approve", [deployment.ghostProtocol, minimumNeeded]);
  await send(tokenAsC, walletC, "approve", [deployment.ghostProtocol, minimumNeeded]);
}

async function preflight() {
  const chainId = await provider.send("eth_chainId", []);
  ensure(Number.parseInt(chainId, 16) === CHAIN_ID, `Unexpected chain id: ${chainId}`);

  const health = await fetch("http://127.0.0.1:3000/api/healthz");
  ensure(health.ok, `API health check failed with ${health.status}`);

  const protocolCode = await provider.getCode(deployment.ghostProtocol);
  ensure(protocolCode && protocolCode !== "0x", "GhostProtocol bytecode not found at deployment address");
}

function divider(title) {
  console.log(`\n=== ${title} ===`);
}

async function runCase(name, fn, results) {
  divider(name);
  try {
    await fn();
    results.push({ name, status: "pass" });
    console.log(`PASS: ${name}`);
  } catch (error) {
    results.push({ name, status: "fail", error: String(error?.message ?? error) });
    console.error(`FAIL: ${name}`);
    console.error(error);
  }
}

async function caseArchiveTamperingAndReplay() {
  const proofHash = ethers.keccak256(ethers.toUtf8Bytes(`roi-archive-${Date.now()}`));
  const severity = 37;
  const description = "ROI tampering test";
  const dramaType = "tamper";
  const contentCid = "bafy-roi-tamper";

  const txReceipt = await send(
    protocolAsA,
    walletA,
    "submitEvidence",
    [proofHash, severity, description, dramaType, contentCid, false],
    { value: RECEIPT_FEE },
  );

  const block = await provider.getBlock(txReceipt.blockNumber);

  const entry = {
    submitter: walletA.address,
    proofHash,
    txHash: txReceipt.hash,
    severity,
    description,
    dramaType,
    contentCid,
    isProxy: false,
    reward: expectedRewardWhole(severity, false),
    chainId: CHAIN_ID,
    submittedAt: block.timestamp * 1000,
  };

  const signature = await walletA.signMessage(buildArchiveMessage(entry));

  const tampered = { ...entry, reward: entry.reward + 1 };
  const tamperedPost = await postArchive(tampered, signature);
  ensure(
    tamperedPost.status === 401,
    `Tampered archive expected 401, got ${tamperedPost.status} (${JSON.stringify(tamperedPost.body)})`,
  );
  ensure(
    String(tamperedPost.body?.error ?? "").includes("signature verification"),
    `Tampered archive error mismatch: ${JSON.stringify(tamperedPost.body)}`,
  );

  const beforeValidInsert = await fetchArchiveBySubmitter(walletA.address);
  ensure(
    findSubmissionByTx(beforeValidInsert.submissions, entry.txHash).length === 0,
    "Tampered archive should not persist any row",
  );

  const firstValidPost = await postArchive(entry, signature);
  ensure(firstValidPost.status === 201, `First valid archive POST expected 201, got ${firstValidPost.status}`);

  const secondValidPost = await postArchive(entry, signature);
  ensure(secondValidPost.status === 201, `Replay archive POST expected 201, got ${secondValidPost.status}`);

  const afterReplay = await fetchArchiveBySubmitter(walletA.address);
  const matches = findSubmissionByTx(afterReplay.submissions, entry.txHash);
  ensure(matches.length === 1, `Replay should leave exactly one row for txHash, found ${matches.length}`);

  const stored = matches[0];
  ensure(stored.reward === entry.reward, `Stored reward mismatch: ${stored.reward} vs ${entry.reward}`);
  ensure(stored.severity === entry.severity, `Stored severity mismatch: ${stored.severity} vs ${entry.severity}`);
  ensure(stored.isProxy === entry.isProxy, `Stored isProxy mismatch: ${stored.isProxy} vs ${entry.isProxy}`);
}

async function caseOnChainDbInvariant() {
  const archive = await fetchArchiveBySubmitter(walletA.address);
  const directRows = archive.submissions.filter((row) => row.isProxy === false);
  ensure(directRows.length > 0, "No direct submissions found for invariant check");

  for (const row of directRows) {
    const expectedReward = expectedRewardWhole(row.severity, false);
    ensure(
      row.reward === expectedReward,
      `DB reward formula mismatch for ${row.txHash}: got ${row.reward}, expected ${expectedReward}`,
    );

    const tx = await provider.getTransaction(row.txHash);
    ensure(tx, `Transaction not found for archived row ${row.txHash}`);

    const parsedCall = protocolInterface.parseTransaction({ data: tx.data, value: tx.value });
    ensure(parsedCall?.name === "submitEvidence", `Archived tx ${row.txHash} is not submitEvidence`);

    const [proofHash, severity, description, dramaType, contentCid, isProxy] = parsedCall.args;
    ensure(proofHash.toLowerCase() === row.proofHash.toLowerCase(), `proofHash mismatch for ${row.txHash}`);
    ensure(Number(severity) === row.severity, `severity mismatch for ${row.txHash}`);
    ensure(description === row.description, `description mismatch for ${row.txHash}`);
    ensure(String(dramaType).trim() === String(row.dramaType).trim(), `dramaType mismatch for ${row.txHash}`);
    ensure(String(contentCid).trim() === String(row.contentCid).trim(), `contentCid mismatch for ${row.txHash}`);
    ensure(isProxy === row.isProxy, `isProxy mismatch for ${row.txHash}`);

    const receipt = await provider.getTransactionReceipt(row.txHash);
    ensure(receipt, `Receipt missing for ${row.txHash}`);

    let evidenceLog = null;
    for (const log of receipt.logs) {
      try {
        const parsed = protocolInterface.parseLog(log);
        if (parsed?.name === "EvidenceSubmitted") {
          const args = parsed.args;
          if (
            String(args.proofHash).toLowerCase() === row.proofHash.toLowerCase() &&
            String(args.submitter).toLowerCase() === row.submitter.toLowerCase()
          ) {
            evidenceLog = args;
            break;
          }
        }
      } catch {
        // ignore non-GhostProtocol logs
      }
    }

    ensure(evidenceLog, `EvidenceSubmitted event missing for ${row.txHash}`);
    const rewardedWhole = Number(evidenceLog.ghostedRewarded / TOKEN_UNIT);
    ensure(rewardedWhole === row.reward, `Event reward mismatch for ${row.txHash}: ${rewardedWhole} vs ${row.reward}`);
  }
}

async function caseUnauthorizedActions() {
  const proofHash = ethers.keccak256(ethers.toUtf8Bytes(`roi-auth-${Date.now()}`));
  await send(
    protocolAsA,
    walletA,
    "submitEvidence",
    [proofHash, 20, "auth test", "auth", "bafy-auth", false],
    { value: RECEIPT_FEE },
  );

  await send(protocolAsB, walletB, "assertTruth", [proofHash, true]);

  await expectRevert(() => protocolAsB.resolveTruth(proofHash, 0, true), "NotOracle");
  await expectRevert(() => protocolAsB.setOracle(walletB.address), "NotOwner");
  await expectRevert(() => protocolAsB.withdrawProtocolETH(1n), "NotOwner");
}

async function caseEconomicBoundaries() {
  await expectRevert(
    () =>
      protocolAsA.submitEvidence(
        ethers.keccak256(ethers.toUtf8Bytes(`roi-underpay-${Date.now()}`)),
        1,
        "underpay",
        "edge",
        "bafy-underpay",
        false,
        { value: RECEIPT_FEE - 1n },
      ),
    "InsufficientEth",
  );

  const severityOneHash = ethers.keccak256(ethers.toUtf8Bytes(`roi-sev-1-${Date.now()}`));
  const beforeOne = await tokenAsA.balanceOf(walletA.address);
  await send(
    protocolAsA,
    walletA,
    "submitEvidence",
    [severityOneHash, 1, "severity one", "edge", "bafy-sev1", false],
    { value: RECEIPT_FEE },
  );
  const afterOne = await tokenAsA.balanceOf(walletA.address);
  ensure(
    afterOne - beforeOne === expectedRewardWei(1, false),
    `Severity=1 reward mismatch: ${afterOne - beforeOne}`,
  );

  const severityHundredHash = ethers.keccak256(ethers.toUtf8Bytes(`roi-sev-100-${Date.now()}`));
  const beforeHundred = await tokenAsA.balanceOf(walletA.address);
  await send(
    protocolAsA,
    walletA,
    "submitEvidence",
    [severityHundredHash, 100, "severity hundred", "edge", "bafy-sev100", false],
    { value: RECEIPT_FEE },
  );
  const afterHundred = await tokenAsA.balanceOf(walletA.address);
  ensure(
    afterHundred - beforeHundred === expectedRewardWei(100, false),
    `Severity=100 reward mismatch: ${afterHundred - beforeHundred}`,
  );

  await ensureTokenFunding(3_000n * TOKEN_UNIT);

  const proofUnlock = ethers.keccak256(ethers.toUtf8Bytes(`roi-unlock-${Date.now()}`));
  await send(
    protocolAsA,
    walletA,
    "submitEvidence",
    [proofUnlock, 30, "unlock progression", "unlock", "bafy-unlock", false],
    { value: RECEIPT_FEE },
  );

  const [price0] = await protocolAsA.getStoryUnlockInfo(proofUnlock);
  ensure(price0 === BASE_UNLOCK_PRICE, `Initial unlock price mismatch: ${price0}`);

  await send(protocolAsB, walletB, "unlockStoryByBurn", [proofUnlock]);
  const [price1, times1] = await protocolAsA.getStoryUnlockInfo(proofUnlock);
  ensure(price1 === BASE_UNLOCK_PRICE + UNLOCK_PRICE_STEP, `Unlock price after first unlock mismatch: ${price1}`);
  ensure(times1 === 1n, `timesUnlocked after first unlock mismatch: ${times1}`);

  await send(protocolAsC, walletC, "unlockStoryByBurn", [proofUnlock]);
  const [price2, times2] = await protocolAsA.getStoryUnlockInfo(proofUnlock);
  ensure(price2 === BASE_UNLOCK_PRICE + 2n * UNLOCK_PRICE_STEP, `Unlock price after second unlock mismatch: ${price2}`);
  ensure(times2 === 2n, `timesUnlocked after second unlock mismatch: ${times2}`);
}

async function casePenaltyRewardConservation() {
  await ensureTokenFunding(4_000n * TOKEN_UNIT);

  const proofHash = ethers.keccak256(ethers.toUtf8Bytes(`roi-conservation-${Date.now()}`));
  await send(
    protocolAsA,
    walletA,
    "submitEvidence",
    [proofHash, 12, "conservation", "truth", "bafy-conserve", false],
    { value: RECEIPT_FEE },
  );

  const supplyBefore = await tokenAsA.totalSupply();
  const statsBefore = await protocolAsA.getProtocolStats();
  const submitterBefore = await tokenAsA.balanceOf(walletA.address);
  const userBBefore = await tokenAsB.balanceOf(walletB.address);

  const outcomes = [true, false, true, false, false, true];
  for (let i = 0; i < outcomes.length; i += 1) {
    await send(protocolAsB, walletB, "assertTruth", [proofHash, true]);
    await send(protocolAsA, walletA, "resolveTruth", [proofHash, i, outcomes[i]]);
  }

  const supplyAfter = await tokenAsA.totalSupply();
  const statsAfter = await protocolAsA.getProtocolStats();
  const submitterAfter = await tokenAsA.balanceOf(walletA.address);
  const userBAfter = await tokenAsB.balanceOf(walletB.address);

  const correctCount = outcomes.filter(Boolean).length;
  const wrongCount = outcomes.length - correctCount;

  const expectedRewardDelta = BigInt(correctCount) * TRUTH_WIN_REWARD;
  const expectedBurnDelta = BigInt(wrongCount) * (TRUTH_STAKE / 2n);
  const expectedSubmitterDelta = BigInt(wrongCount) * (TRUTH_STAKE / 2n);
  const expectedUserBDelta =
    BigInt(correctCount) * (TRUTH_WIN_REWARD - TRUTH_STAKE) -
    BigInt(wrongCount) * TRUTH_STAKE;

  const rewardedDelta = statsAfter[4] - statsBefore[4];
  const burnedDelta = statsAfter[5] - statsBefore[5];
  const supplyDelta = supplyBefore - supplyAfter;
  const submitterDelta = submitterAfter - submitterBefore;
  const userBDelta = userBAfter - userBBefore;

  ensure(rewardedDelta === expectedRewardDelta, `rewarded delta mismatch: ${rewardedDelta} vs ${expectedRewardDelta}`);
  ensure(burnedDelta === expectedBurnDelta, `burned delta mismatch: ${burnedDelta} vs ${expectedBurnDelta}`);
  ensure(supplyDelta === expectedBurnDelta, `total supply delta mismatch: ${supplyDelta} vs ${expectedBurnDelta}`);
  ensure(submitterDelta === expectedSubmitterDelta, `submitter delta mismatch: ${submitterDelta} vs ${expectedSubmitterDelta}`);
  ensure(userBDelta === expectedUserBDelta, `user B delta mismatch: ${userBDelta} vs ${expectedUserBDelta}`);
}

async function caseDuplicateProofHashRace() {
  const proofHash = ethers.keccak256(ethers.toUtf8Bytes(`roi-race-${Date.now()}`));
  const statsBefore = await protocolAsA.getProtocolStats();

  const submitFrom = async (contract, wallet, label) => {
    try {
      const nonce = await nextNonce(wallet);
      const tx = await contract.submitEvidence(
        proofHash,
        15,
        `race submit ${label}`,
        "race",
        "bafy-race",
        false,
        { value: RECEIPT_FEE, nonce },
      );

      const receipt = await tx.wait();
      return { status: "fulfilled", value: receipt };
    } catch (error) {
      return { status: "rejected", reason: error };
    }
  };

  const [resultB, resultC] = await Promise.all([
    submitFrom(protocolAsB, walletB, "b"),
    submitFrom(protocolAsC, walletC, "c"),
  ]);

  const outcomes = [resultB, resultC];
  const fulfilled = outcomes.filter((result) => result.status === "fulfilled");
  const rejected = outcomes.filter((result) => result.status === "rejected");

  ensure(fulfilled.length === 1, `Duplicate race expected exactly one success, got ${fulfilled.length}`);
  ensure(rejected.length === 1, `Duplicate race expected exactly one revert, got ${rejected.length}`);

  const revertName = decodeCustomErrorName(rejected[0].reason);
  const revertMessage = String(
    rejected[0].reason?.shortMessage ??
    rejected[0].reason?.message ??
    rejected[0].reason?.info?.error?.message ??
    rejected[0].reason,
  );

  // Some provider error envelopes collapse custom errors under generic transport messages.
  // Validate the duplicate-collision condition explicitly with a replay call after the race settles.
  await expectRevert(
    () =>
      protocolAsB.submitEvidence(
        proofHash,
        15,
        "race replay",
        "race",
        "bafy-race",
        false,
        { value: RECEIPT_FEE },
      ),
    "EvidenceAlreadyExists",
  );

  ensure(
    revertName === "EvidenceAlreadyExists" ||
      revertMessage.includes("EvidenceAlreadyExists") ||
      revertMessage.includes("could not coalesce error"),
    `Duplicate race revert mismatch: expected duplicate collision shape, got name=${revertName ?? "none"} message=${revertMessage}`,
  );

  const statsAfter = await protocolAsA.getProtocolStats();
  ensure(
    statsAfter[0] - statsBefore[0] === 1n,
    `Duplicate race should increment total evidence by 1, got delta ${statsAfter[0] - statsBefore[0]}`,
  );
}

async function main() {
  await preflight();

  const results = [];

  await runCase("1) Archive signature tampering + replay idempotency", caseArchiveTamperingAndReplay, results);
  await runCase("2) On-chain/DB direct-submission invariant", caseOnChainDbInvariant, results);
  await runCase("3) Unauthorized role actions", caseUnauthorizedActions, results);
  await runCase("4) Economic boundary tests", caseEconomicBoundaries, results);
  await runCase("5) Penalty/reward conservation", casePenaltyRewardConservation, results);
  await runCase("6) Duplicate-proofHash race", caseDuplicateProofHashRace, results);

  console.log("\n=== SUMMARY ===");
  for (const result of results) {
    if (result.status === "pass") {
      console.log(`PASS: ${result.name}`);
    } else {
      console.log(`FAIL: ${result.name}`);
      console.log(`  ${result.error}`);
    }
  }

  const failed = results.filter((result) => result.status === "fail");
  if (failed.length > 0) {
    process.exitCode = 1;
    throw new Error(`${failed.length} high-ROI test case(s) failed`);
  }

  console.log("\nAll requested high-ROI tests passed.");
}

main().catch((error) => {
  console.error("High-ROI test runner failed:", error);
  process.exit(1);
});
