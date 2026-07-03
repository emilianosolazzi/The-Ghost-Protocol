import {
  buildEvidenceProofHashMessage,
  canonicalizeEvidenceProofHashInput,
  type EvidenceProofHashInput,
} from "@workspace/ghost-contract";
import { keccak256, toHex, type Hex } from "viem";

export type DeterministicProofHashInput = EvidenceProofHashInput;

export function deriveDeterministicProofHash(input: DeterministicProofHashInput): Hex {
  const canonical = canonicalizeEvidenceProofHashInput(input);
  return keccak256(toHex(buildEvidenceProofHashMessage(canonical)));
}
