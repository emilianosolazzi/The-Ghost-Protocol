import assert from "node:assert/strict";
import { ethers } from "ethers";
import {
  buildEvidenceProofHashMessage,
  buildGhostSubmissionArchiveMessage,
  canonicalizeEvidenceProofHashInput,
  canonicalizeGhostSubmissionArchiveEntry,
} from "../src/submission-canonicalization.ts";

function run() {
  const archiveInput = {
    submitter: "0xAbCDef0000000000000000000000000000001234",
    proofHash: "0x1111111111111111111111111111111111111111111111111111111111111111",
    txHash: "0x2222222222222222222222222222222222222222222222222222222222222222",
    severity: 37.8,
    description: "Ghosted after RSVP",
    dramaType: " orbiting ",
    contentCid: " bafyfixturecid ",
    isProxy: false,
    reward: 1850,
    chainId: 31337.9,
    submittedAt: 1712345678901.9,
  };

  const expectedArchiveCanonical = {
    version: 1,
    submitter: "0xabcdef0000000000000000000000000000001234",
    proofHash: "0x1111111111111111111111111111111111111111111111111111111111111111",
    txHash: "0x2222222222222222222222222222222222222222222222222222222222222222",
    severity: 37,
    description: "Ghosted after RSVP",
    dramaType: "orbiting",
    contentCid: "bafyfixturecid",
    isProxy: false,
    reward: 1850,
    chainId: 31337,
    submittedAt: 1712345678901,
  };

  const expectedArchiveMessage =
    "GhostProtocol archive submission\n" + JSON.stringify(expectedArchiveCanonical);

  const archiveCanonical = canonicalizeGhostSubmissionArchiveEntry(archiveInput);
  const archiveMessage = buildGhostSubmissionArchiveMessage(archiveInput);

  assert.deepEqual(archiveCanonical, expectedArchiveCanonical, "Archive canonical payload fixture mismatch");
  assert.equal(archiveMessage, expectedArchiveMessage, "Archive canonical message fixture mismatch");

  const evidenceInput = {
    severity: 12.9,
    description: "  Late reply after 9 days  ",
    dramaType: "   ",
    contentCid: "  bafyproofcid  ",
    isProxy: true,
    submitter: " 0xAbCDef0000000000000000000000000000001234 ",
    salt: " nonce-1 ",
  };

  const expectedEvidenceCanonical = {
    version: 1,
    severity: 12,
    description: "Late reply after 9 days",
    dramaType: "general",
    contentCid: "bafyproofcid",
    isProxy: true,
    submitter: "0xabcdef0000000000000000000000000000001234",
    salt: "nonce-1",
  };

  const expectedEvidenceMessage =
    "GhostProtocol evidence fingerprint\n" + JSON.stringify(expectedEvidenceCanonical);

  const evidenceCanonical = canonicalizeEvidenceProofHashInput(evidenceInput);
  const evidenceMessage = buildEvidenceProofHashMessage(evidenceInput);

  assert.deepEqual(evidenceCanonical, expectedEvidenceCanonical, "Evidence canonical payload fixture mismatch");
  assert.equal(evidenceMessage, expectedEvidenceMessage, "Evidence canonical message fixture mismatch");

  const expectedEvidenceHash = ethers.keccak256(ethers.toUtf8Bytes(expectedEvidenceMessage));
  const derivedEvidenceHash = ethers.keccak256(ethers.toUtf8Bytes(evidenceMessage));
  assert.equal(derivedEvidenceHash, expectedEvidenceHash, "Evidence fingerprint hash fixture mismatch");

  console.log("Canonicalization fixtures passed.");
  console.log(`Evidence fixture hash: ${derivedEvidenceHash}`);
}

try {
  run();
} catch (error) {
  console.error("Canonicalization fixtures failed:", error);
  process.exit(1);
}
