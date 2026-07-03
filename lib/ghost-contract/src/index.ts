export {
  ghostProtocolAbi,
  ghostProtocolArtifact,
  ghostProtocolBytecode,
  ghostProtocolContractName,
  ghostProtocolDeployedBytecode,
} from "./generated/ghost-protocol";

export { ghostProtocolUiConstants } from "./contract-values";

export {
  buildGhostSubmissionArchiveMessage,
  canonicalizeGhostSubmissionArchiveEntry,
  buildEvidenceProofHashMessage,
  canonicalizeEvidenceProofHashInput,
  type GhostSubmissionArchiveEntryInput,
  type GhostSubmissionArchiveCanonicalPayload,
  type EvidenceProofHashInput,
  type EvidenceProofHashCanonicalPayload,
} from "./submission-canonicalization";