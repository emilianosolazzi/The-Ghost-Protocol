export const ghostProtocolContractName = "GhostProtocol" as const;

export const ghostProtocolAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "ghostedTokenAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "treasuryAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "oracleAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "AlreadyResolved",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "AlreadyUnlocked",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ContractPaused",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "EvidenceAlreadyExists",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "currentCredibility",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "requiredCredibility",
        "type": "uint256"
      }
    ],
    "name": "InsufficientCredibility",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "requiredAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "receivedAmount",
        "type": "uint256"
      }
    ],
    "name": "InsufficientEth",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidAddress",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidAssertionIndex",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidProofHash",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidSeverity",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotOracle",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotOwner",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotPendingOwner",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "OnlySubmitter",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ReentrancyGuardActive",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "SafeERC20FailedOperation",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "StoryAlreadyPublic",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "StoryDoesNotExist",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "StoryIsPublic",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SubmitterNotRecorded",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TokenTransferFailed",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "submitter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "severity",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isProxy",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "ghostedRewarded",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "dramaType",
        "type": "string"
      }
    ],
    "name": "EvidenceSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "submitter",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "feePaid",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "treasuryCut",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "protocolCut",
        "type": "uint256"
      }
    ],
    "name": "GhostingReceiptSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOracle",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOracle",
        "type": "address"
      }
    ],
    "name": "OracleUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "pendingOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bool",
        "name": "paused",
        "type": "bool"
      }
    ],
    "name": "PauseStateUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "ProtocolFunded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "submitter",
        "type": "address"
      }
    ],
    "name": "StoryMadePublic",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "unlocker",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "cost",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "method",
        "type": "string"
      }
    ],
    "name": "StoryUnlocked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousTreasury",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newTreasury",
        "type": "address"
      }
    ],
    "name": "TreasuryUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "assertor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "believesReal",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "stake",
        "type": "uint256"
      }
    ],
    "name": "TruthAsserted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "assertor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "wasCorrect",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "reward",
        "type": "uint256"
      }
    ],
    "name": "TruthResolved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newPrice",
        "type": "uint256"
      }
    ],
    "name": "UnlockPriceUpdated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "BASE_UNLOCK_PRICE",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "BPS_DENOMINATOR",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "CREDIBILITY_UNLOCK_THRESHOLD",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "GHOSTING_RECEIPT_FEE",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_GHOSTED_PER_SUBMISSION",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "TREASURY_SPLIT_BPS",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "TRUTH_ASSERTION_STAKE",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "TRUTH_WIN_REWARD",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "acceptOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      },
      {
        "internalType": "bool",
        "name": "believesReal",
        "type": "bool"
      }
    ],
    "name": "assertTruth",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "canUserAccessStory",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "directEvidenceCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "evidenceCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "evidenceSubmitter",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      }
    ],
    "name": "getEvidence",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "weight",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isProxy",
        "type": "bool"
      },
      {
        "internalType": "bytes32",
        "name": "descriptionHash",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "dramaType",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "submitter",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "ghostedRewarded",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getProtocolStats",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "totalEvidence",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "directEvidence",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "proxyEvidence",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalTruthAssertions",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rewardedGhosted",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "burnedGhosted",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "revenueCollected",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "treasuryDistributed",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "protocolRevenue",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "gaslightUnlocked",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isPaused",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      }
    ],
    "name": "getStoryPayoutInfo",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "tokenPayouts",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "ethPayouts",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "currentEthUnlockPrice",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      }
    ],
    "name": "getStoryUnlockInfo",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "unlockPriceTokens",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "timesUnlocked",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isPublic",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "totalEarned",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "submitter",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "severity",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "cursor",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "limit",
        "type": "uint256"
      }
    ],
    "name": "getSubmittedProofHashes",
    "outputs": [
      {
        "internalType": "bytes32[]",
        "name": "proofHashes",
        "type": "bytes32[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "assertionIndex",
        "type": "uint256"
      }
    ],
    "name": "getTruthAssertion",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "assertionProofHash",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "assertor",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "believesReal",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "stakeAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "resolved",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "wasCorrect",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      }
    ],
    "name": "getTruthAssertionCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ghostedToken",
    "outputs": [
      {
        "internalType": "contract IGhostedToken",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "hasUnlockedStory",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "hasUserUnlockedStory",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "lockedStories",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "submitter",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "severity",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "unlockPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "timesUnlocked",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isPublic",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "totalEarnedFromUnlocks",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      }
    ],
    "name": "makeStoryPublic",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "oracle",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pendingOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      }
    ],
    "name": "previewUnlockPriceInEth",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proxyEvidenceCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "assertionIndex",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isActuallyReal",
        "type": "bool"
      }
    ],
    "name": "resolveTruth",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOracle",
        "type": "address"
      }
    ],
    "name": "setOracle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "nextPaused",
        "type": "bool"
      }
    ],
    "name": "setPaused",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newTreasury",
        "type": "address"
      }
    ],
    "name": "setTreasury",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "storyEthEarnings",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "severity",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "dramaType",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isProxy",
        "type": "bool"
      }
    ],
    "name": "submitEvidence",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "submittedProofHashesCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalGhostedBurned",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalGhostedRewarded",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalProtocolRevenue",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalRevenueCollected",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalTreasuryDistributed",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "totalTruthWins",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "treasury",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "truthAssertionCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "truthWinStreak",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      }
    ],
    "name": "unlockStoryByBurn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      }
    ],
    "name": "unlockStoryByCredibility",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      }
    ],
    "name": "unlockStoryWithETH",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
] as const;

export const ghostProtocolBytecode = "0x60a06040526001601655348015610014575f5ffd5b506040516132ca3803806132ca833981016040819052610033916100e0565b6001600160a01b038316158061005057506001600160a01b038216155b8061006257506001600160a01b038116155b156100805760405163e6c4247b60e01b815260040160405180910390fd5b6001600160a01b039283166080525f80546001600160a01b03199081163317909155600380549385169382169390931790925560028054919093169116179055610120565b80516001600160a01b03811681146100db575f5ffd5b919050565b5f5f5f606084860312156100f2575f5ffd5b6100fb846100c5565b9250610109602085016100c5565b9150610117604085016100c5565b90509250925092565b6080516131536101775f395f8181610698015281816115f50152818161173b01528181611e7001528181611eeb01528181611fde015281816125f7015281816127b20152818161291101526129be01526131535ff3fe6080604052600436106102f6575f3560e01c80638c1a60b211610189578063c69ab501116100d8578063dbd8c05711610092578063f0f442601161006d578063f0f4426014610ac2578063f2fde38b14610ae1578063f4dceacd14610b00578063f99156cb14610b1f575f5ffd5b8063dbd8c05714610a79578063e1a4521814610a8e578063e30c397814610aa3575f5ffd5b8063c69ab501146109c5578063c9ab7130146109e1578063cb3399e814610a00578063d365d09414610a1f578063d4ade87514610a4a578063d73848cc14610a5d575f5ffd5b8063a4fa95bf11610143578063af414d411161011e578063af414d411461096c578063b3dfbcf814610986578063b87c11141461099b578063b9fa45da146109b0575f5ffd5b8063a4fa95bf14610900578063a60051ae1461092c578063a6d2fcd914610941575f5ffd5b80638c1a60b2146107dd5780638c37f11d146107f95780638da5cb5b1461080e578063924d3f561461082c578063938a8bca146108495780639e33bb861461085e575f5ffd5b806361d027b3116102455780636bccc753116101ff57806379ba5097116101da57806379ba50971461076c5780637adbf973146107805780637dc0d1d01461079f5780638748c6b9146107be575f5ffd5b80636bccc75314610687578063771aceef146106ba57806378f88d6714610750575f5ffd5b806361d027b31461054b57806365137dd01461058257806367310b5a146105e657806368f5c6631461061f5780636a01a7751461063e5780636a65eaa614610672575f5ffd5b806321026950116102b05780634a7221a01161028b5780634a7221a0146104b75780635191e467146104e957806353093093146104fc5780635c975abb1461052b575f5ffd5b806321026950146104645780632cad2f651461048357806338902fdb146104a2575f5ffd5b8063056962c31461033657806308104069146103755780630efd66e2146103935780631433219c146103be57806316c38b3c146103e957806319b881e41461040a575f5ffd5b366103325760405134815233907f719feb717c187001672aa98b85a51988a7fab410c32ed1d724838c8377bf90af9060200160405180910390a2005b5f5ffd5b348015610341575f5ffd5b50610355610350366004612b26565b610b34565b604080519384526020840192909252908201526060015b60405180910390f35b348015610380575f5ffd5b50600f545b60405190815260200161036c565b34801561039e575f5ffd5b506103856103ad366004612b58565b60156020525f908152604090205481565b3480156103c9575f5ffd5b506103856103d8366004612b26565b60136020525f908152604090205481565b3480156103f4575f5ffd5b50610408610403366004612b80565b610bc3565b005b348015610415575f5ffd5b50610429610424366004612b26565b610c45565b6040805196875260208701959095529215159385019390935260608401526001600160a01b03909116608083015260a082015260c00161036c565b34801561046f575f5ffd5b5061038561047e366004612b26565b610d3d565b34801561048e575f5ffd5b5061040861049d366004612b26565b610db3565b3480156104ad575f5ffd5b5061038560085481565b3480156104c2575f5ffd5b506104d66104d1366004612b26565b610eaa565b60405161036c9796959493929190612b99565b6104086104f7366004612c4b565b610fa2565b348015610507575f5ffd5b5061051b610516366004612cdd565b611438565b604051901515815260200161036c565b348015610536575f5ffd5b5060035461051b90600160a01b900460ff1681565b348015610556575f5ffd5b5060035461056a906001600160a01b031681565b6040516001600160a01b03909116815260200161036c565b34801561058d575f5ffd5b506105a161059c366004612d07565b611464565b604080519788526001600160a01b039096166020880152931515948601949094526060850191909152608084015290151560a0830152151560c082015260e00161036c565b3480156105f1575f5ffd5b5061051b610600366004612cdd565b601260209081525f928352604080842090915290825290205460ff1681565b34801561062a575f5ffd5b50610408610639366004612b26565b611519565b348015610649575f5ffd5b5061056a610658366004612b26565b60116020525f90815260409020546001600160a01b031681565b34801561067d575f5ffd5b5061038560055481565b348015610692575f5ffd5b5061056a7f000000000000000000000000000000000000000000000000000000000000000081565b3480156106c5575f5ffd5b50600454600554600654600754600854600954600a8054600b54600c546003549293919290918a101590600160a01b900460ff16604080519b8c5260208c019a909a52988a01979097526060890195909552608088019390935260a087019190915260c086015260e0850152610100840152151561012083015215156101408201526101600161036c565b34801561075b575f5ffd5b50610385681b1ae4d6e2ef50000081565b348015610777575f5ffd5b50610408611832565b34801561078b575f5ffd5b5061040861079a366004612b58565b6118b3565b3480156107aa575f5ffd5b5060025461056a906001600160a01b031681565b3480156107c9575f5ffd5b506104086107d8366004612d27565b611955565b3480156107e8575f5ffd5b50610385680ad78ebc5ac620000081565b348015610804575f5ffd5b50610385600c5481565b348015610819575f5ffd5b505f5461056a906001600160a01b031681565b348015610837575f5ffd5b5061038569010f0cf064dd5920000081565b348015610854575f5ffd5b50610385600b5481565b348015610869575f5ffd5b506108c1610878366004612b26565b60106020525f9081526040902080546001820154600283015460038401546004850154600586015460069096015494956001600160a01b039094169492939192909160ff169087565b604080519788526001600160a01b0390961660208801529486019390935260608501919091526080840152151560a083015260c082015260e00161036c565b34801561090b575f5ffd5b5061091f61091a366004612d07565b611b07565b60405161036c9190612d48565b348015610937575f5ffd5b50610385610bb881565b34801561094c575f5ffd5b5061038561095b366004612b58565b60146020525f908152604090205481565b348015610977575f5ffd5b506103856621c0331d5dc00081565b348015610991575f5ffd5b5061038560065481565b3480156109a6575f5ffd5b5061038560045481565b3480156109bb575f5ffd5b5061038560075481565b3480156109d0575f5ffd5b50610385683635c9adc5dea0000081565b3480156109ec575f5ffd5b5061051b6109fb366004612cdd565b611bf6565b348015610a0b575f5ffd5b50610408610a1a366004612d8a565b611c68565b348015610a2a575f5ffd5b50610385610a39366004612b26565b5f908152600e602052604090205490565b610408610a58366004612b26565b6120ef565b348015610a68575f5ffd5b5061038568056bc75e2d6310000081565b348015610a84575f5ffd5b50610385600a5481565b348015610a99575f5ffd5b5061038561271081565b348015610aae575f5ffd5b5060015461056a906001600160a01b031681565b348015610acd575f5ffd5b50610408610adc366004612b58565b612380565b348015610aec575f5ffd5b50610408610afb366004612b58565b612422565b348015610b0b575f5ffd5b50610408610b1a366004612b26565b6124c3565b348015610b2a575f5ffd5b5061038560095481565b5f818152600d6020526040812054819081908103610b65576040516303d4572d60e51b815260040160405180910390fd5b5f848152601060205260408120600381015490919015610b89578160030154610b94565b681b1ae4d6e2ef5000005b60068301545f8881526013602052604090205491925090610bb4836127ae565b94509450945050509193909250565b5f546001600160a01b03163314610bed576040516330cd747160e01b815260040160405180910390fd5b60038054821515600160a01b0260ff60a01b199091161790556040517fb31006682779d0ac02864bee834675baf4592a679bfe75edd5e5847b52ef6f6e90610c3a90831515815260200190565b60405180910390a150565b5f818152600d6020526040812054819081908190819081908103610c7c576040516303d4572d60e51b815260040160405180910390fd5b5f87815260106020526040812060018101549091906001600160a01b0316610cba575f898152601160205260409020546001600160a01b0316610cc9565b60018201546001600160a01b03165b90505f82600201545f03610ced575f8a8152600d6020526040902060010154610cf3565b82600201545b905082600301545f14610d0a578260030154610d15565b681b1ae4d6e2ef5000005b60048401546005850154600690950154919c909b5060ff909416995097509095509350915050565b5f818152600d60205260408120548103610d6a576040516303d4572d60e51b815260040160405180910390fd5b5f8281526010602052604081206003015415610d96575f83815260106020526040902060030154610da1565b681b1ae4d6e2ef5000005b9050610dac816127ae565b9392505050565b600354600160a01b900460ff1615610dde5760405163ab35696f60e01b815260040160405180910390fd5b5f818152600d60205260408120549003610e0b576040516303d4572d60e51b815260040160405180910390fd5b5f610e1582612857565b60018101549091506001600160a01b03163314610e4557604051632731809760e11b815260040160405180910390fd5b600581015460ff1615610e6b57604051635d51ae1160e11b815260040160405180910390fd5b60058101805460ff19166001179055604051339083907f4fc8ba7f4f3c695895c779eb7fde668149b9eed94bfc8e5dda5899c40eca973b905f90a35050565b5f818152600d602052604081208054600182015460028301546003840154600585015460068601546004870180548998899889986060988a98899894979396929560ff9092169490936001600160a01b03909116918390610f0a90612dbc565b80601f0160208091040260200160405190810160405280929190818152602001828054610f3690612dbc565b8015610f815780601f10610f5857610100808354040283529160200191610f81565b820191905f5260205f20905b815481529060010190602001808311610f6457829003601f168201915b50505050509250975097509750975097509750975050919395979092949650565b600354600160a01b900460ff1615610fcd5760405163ab35696f60e01b815260040160405180910390fd5b601654600114610ff057604051631762c6f360e01b815260040160405180910390fd5b6002601655866110135760405163b780d61f60e01b815260040160405180910390fd5b8515806110205750606486115b1561103e57604051630f7fcb2960e21b815260040160405180910390fd5b5f878152600d60205260409020541561106a57604051635665e77960e11b815260040160405180910390fd5b6621c0331d5dc0003410156110a657604051633ebbc33760e01b81526621c0331d5dc00060048201523460248201526044015b60405180910390fd5b5f6110b86621c0331d5dc00034612e08565b90505f6127106110d1610bb86621c0331d5dc000612e1b565b6110db9190612e32565b90505f6110ef826621c0331d5dc000612e08565b90505f5f90506621c0331d5dc000600a5f82825461110d9190612e51565b9250508190555082600b5f8282546111259190612e51565b9250508190555081600c5f82825461113d9190612e51565b92505081905550600160045f8282546111569190612e51565b909155508590506111f657600160055f8282546111739190612e51565b92505081905550600160075f82825461118c9190612e51565b9091555061119d90508a6032612e1b565b6111af90670de0b6b3a7640000612e1b565b905069010f0cf064dd592000008111156111d0575069010f0cf064dd592000005b8060085f8282546111e19190612e51565b909155506111f190503382612904565b61120e565b600160065f8282546112089190612e51565b90915550505b6040518060e001604052804281526020018b815260200186151581526020018a8a60405161123d929190612e64565b6040518091039020815260200188888080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92018290525093855250503360208085019190915260409384018690528f8352600d81529183902084518155918401516001830155509082015160028201805460ff191691151591909117905560608201516003820155608082015160048201906112e09082612edd565b5060a08201516005820180546001600160a01b039092166001600160a01b031992831617905560c0909201516006909101555f8c815260116020526040812080549092163317909155600f805460018101825591527f8d1108e10bcb7c27dddfc02ed9d693a074039d026cf4ea4240b40f7d581ac802018b90556113638b612857565b50821561138057600354611380906001600160a01b03168461293c565b831561139057611390338561293c565b336001600160a01b03168b7f356e37b4b3a3dbbf61e05450c7d74955350550a659bd8792d406b6c27133a0e18c88858c8c6040516113d2959493929190612f9c565b60405180910390a3604080516621c0331d5dc0008152602081018590529081018390528b9033907fd381803faab74092aedc8de24231e595cfd3af1a0997ead17e7bcd54d9777c109060600160405180910390a350506001601655505050505050505050565b5f8281526012602090815260408083206001600160a01b038516845290915290205460ff165b92915050565b5f828152600e6020526040812054819081908190819081908190881061149d57604051635878ae8560e11b815260040160405180910390fd5b5f898152600e6020526040812080548a9081106114bc576114bc612fe1565b5f91825260209091206005909102018054600182015460028301546003840154600490940154929e6001600160a01b0383169e5060ff600160a01b90930483169d50909b5092995080821698506101009091041695509350505050565b600354600160a01b900460ff16156115445760405163ab35696f60e01b815260040160405180910390fd5b5f818152600d60205260408120549003611571576040516303d4572d60e51b815260040160405180910390fd5b5f81815260126020908152604080832033845290915290205460ff16156115ab576040516328486b6360e11b815260040160405180910390fd5b5f6115b582612857565b600581015490915060ff16156115de57604051632444f8b760e11b815260040160405180910390fd5b60405163aaac37a160e01b81523360048201525f907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063aaac37a190602401602060405180830381865afa158015611642573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906116669190612ff5565b5f848152600d60205260408120600101549192509061168c90662386f26fc10000612e1b565b9050808210156116b9576040516320200bc560e01b8152600481018390526024810182905260440161109d565b683635c9adc5dea000008210156116f5576040516320200bc560e01b815260048101839052683635c9adc5dea00000602482015260440161109d565b5f8481526012602090815260408083203384529091528120805460ff191660011790556064611725836005612e1b565b61172f9190612e32565b90506001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001663de50a7953361176b8487612e51565b6040516001600160e01b031960e085901b1681526001600160a01b03909216600483015260248201526044015f604051808303815f87803b1580156117ae575f5ffd5b505af11580156117c0573d5f5f3e3d5ffd5b50505050336001600160a01b0316857f2ee8d21874599264c54876b79bf25eae1b396c3771a178e683a9e038b634f1d75f604051611823918152604060208201819052600b908201526a435245444942494c49545960a81b606082015260800190565b60405180910390a35050505050565b6001546001600160a01b0316331461185d57604051630614e5c760e21b815260040160405180910390fd5b5f8054336001600160a01b0319808316821784556001805490911690556040516001600160a01b0390921692909183917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a350565b5f546001600160a01b031633146118dd576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b0381166119045760405163e6c4247b60e01b815260040160405180910390fd5b600280546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f078c3b417dadf69374a59793b829c52001247130433427049317bde56607b1b7905f90a35050565b600354600160a01b900460ff16156119805760405163ab35696f60e01b815260040160405180910390fd5b6016546001146119a357604051631762c6f360e01b815260040160405180910390fd5b60026016555f828152600d602052604081205490036119d5576040516303d4572d60e51b815260040160405180910390fd5b6119e9333068056bc75e2d631000006129b1565b5f828152600e60209081526040808320815160e0810183528681523381850181815287151583860181815268056bc75e2d6310000060608601818152426080880190815260a088018c815260c089018d81528a5460018082018d559b8f529d8d902099516005909e029099019c8d559551988c01805494511515600160a01b026001600160a81b03199095166001600160a01b03909a169990991793909317909755955160028a0155516003890155905160049097018054935115156101000261ff00199815159890981661ffff199094169390931796909617909155825194855292840152909184917fa04181c550a5111ebee021519f1381f122b78eb4e9b9194a64cd6c9de7737351910160405180910390a350506001601655565b600f546060908084101580611b1a575082155b15611b34575050604080515f81526020810190915261145e565b5f611b3f8583612e08565b90505f848210611b4f5784611b51565b815b90508067ffffffffffffffff811115611b6c57611b6c612e73565b604051908082528060200260200182016040528015611b95578160200160208202803683370190505b5093505f5b81811015611bec57600f611bae8289612e51565b81548110611bbe57611bbe612fe1565b905f5260205f200154858281518110611bd957611bd9612fe1565b6020908102919091010152600101611b9a565b5050505092915050565b5f828152600d60205260408120548103611c23576040516303d4572d60e51b815260040160405180910390fd5b5f8381526010602052604090206005015460ff1680610dac5750505f9182526012602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6002546001600160a01b03163314611c9357604051631bc2178f60e01b815260040160405180910390fd5b600354600160a01b900460ff1615611cbe5760405163ab35696f60e01b815260040160405180910390fd5b601654600114611ce157604051631762c6f360e01b815260040160405180910390fd5b60026016555f838152600e60205260409020548210611d1357604051635878ae8560e11b815260040160405180910390fd5b5f838152600e60205260408120805484908110611d3257611d32612fe1565b5f9182526020909120600590910201600481015490915060ff1615611d6a576040516336ab81e160e11b815260040160405180910390fd5b600481018054600183810154600160a01b900460ff90811615158615151461010090810261ffff19909416939093179091179283905591041615611f86576001810154611dc9906001600160a01b0316680ad78ebc5ac6200000612904565b680ad78ebc5ac620000060085f828254611de39190612e51565b90915550506001818101546001600160a01b03165f9081526015602052604081208054909190611e14908490612e51565b90915550506001818101546001600160a01b03165f9081526014602052604081208054909190611e45908490612e51565b9091555050600181015460405163aaac37a160e01b81526001600160a01b0391821660048201525f917f0000000000000000000000000000000000000000000000000000000000000000169063aaac37a190602401602060405180830381865afa158015611eb5573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190611ed99190612ff5565b60018301549091506001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081169163de50a7959116611f278468056bc75e2d63100000612e51565b6040516001600160e01b031960e085901b1681526001600160a01b03909216600483015260248201526044015f604051808303815f87803b158015611f6a575f5ffd5b505af1158015611f7c573d5f5f3e3d5ffd5b5050505050612072565b5f611f9085612857565b90505f611fa7600268056bc75e2d63100000612e32565b6001830154909150611fc2906001600160a01b031682612904565b604051632770a7eb60e21b8152306004820152602481018290527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690639dc29fac906044015f604051808303815f87803b158015612027575f5ffd5b505af1158015612039573d5f5f3e3d5ffd5b505050508060095f82825461204e9190612e51565b90915550505060018201546001600160a01b03165f90815260156020526040812055505b600181015460048201546001600160a01b039091169085907f8aa1336152b005ddd3ccc39b5a66ed207555053dd23bc9cff1aab405f6348ea590610100900460ff16806120bf575f6120ca565b680ad78ebc5ac62000005b60408051921515835260208301919091520160405180910390a3505060016016555050565b600354600160a01b900460ff161561211a5760405163ab35696f60e01b815260040160405180910390fd5b60165460011461213d57604051631762c6f360e01b815260040160405180910390fd5b60026016555f818152600d6020526040812054900361216f576040516303d4572d60e51b815260040160405180910390fd5b5f81815260126020908152604080832033845290915290205460ff16156121a9576040516328486b6360e11b815260040160405180910390fd5b5f6121b382612857565b600581015490915060ff16156121dc57604051632444f8b760e11b815260040160405180910390fd5b60038101545f6121eb84610d3d565b90508034101561221757604051633ebbc33760e01b81526004810182905234602482015260440161109d565b5f8481526012602090815260408083203384529091528120805460ff1916600190811790915560048501805491929091612252908490612e51565b909155505060048301546103e89061226a9084612e1b565b6122749190612e32565b61227e9083612e51565b60038401555f84815260136020526040812080548392906122a0908490612e51565b909155505060018301546122bd906001600160a01b03168261293c565b803411156122d8576122d8336122d38334612e08565b61293c565b336001600160a01b0316847f2ee8d21874599264c54876b79bf25eae1b396c3771a178e683a9e038b634f1d78460405161232f9181526040602082018190526003908201526208aa8960eb1b606082015260800190565b60405180910390a3837f68520cf07e2f785cba8f9601c758232191b84e9f0a8ec7b3049d2dcc197b67fe846003015460405161236d91815260200190565b60405180910390a2505060016016555050565b5f546001600160a01b031633146123aa576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b0381166123d15760405163e6c4247b60e01b815260040160405180910390fd5b600380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f4ab5be82436d353e61ca18726e984e561f5c1cc7c6d38b29d2553c790434705a905f90a35050565b5f546001600160a01b0316331461244c576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b0381166124735760405163e6c4247b60e01b815260040160405180910390fd5b600180546001600160a01b0319166001600160a01b038381169182179092555f8054604051929316917f38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e227009190a350565b600354600160a01b900460ff16156124ee5760405163ab35696f60e01b815260040160405180910390fd5b60165460011461251157604051631762c6f360e01b815260040160405180910390fd5b60026016555f818152600d60205260408120549003612543576040516303d4572d60e51b815260040160405180910390fd5b5f81815260126020908152604080832033845290915290205460ff161561257d576040516328486b6360e11b815260040160405180910390fd5b5f61258782612857565b600581015490915060ff16156125b057604051632444f8b760e11b815260040160405180910390fd5b60038101545f6125c1600283612e32565b90505f6125ce8284612e08565b90506125db3330856129b1565b604051632770a7eb60e21b8152306004820152602481018390527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690639dc29fac906044015f604051808303815f87803b158015612640575f5ffd5b505af1158015612652573d5f5f3e3d5ffd5b505050508160095f8282546126679190612e51565b90915550506001840154612684906001600160a01b031682612904565b5f8581526012602090815260408083203384529091528120805460ff19166001908117909155600486018054919290916126bf908490612e51565b9250508190555080846006015f8282546126d99190612e51565b909155505060048401546103e8906126f19085612e1b565b6126fb9190612e32565b6127059084612e51565b6003850155604051339086907f2ee8d21874599264c54876b79bf25eae1b396c3771a178e683a9e038b634f1d79061275c9087815260406020820181905260049082015263212aa92760e11b606082015260800190565b60405180910390a3847f68520cf07e2f785cba8f9601c758232191b84e9f0a8ec7b3049d2dcc197b67fe856003015460405161279a91815260200190565b60405180910390a250506001601655505050565b5f5f7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa15801561280c573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190612830919061300c565b61283b90600a61310f565b90508061284d8464e8d4a51000612e1b565b610dac9190612e32565b5f81815260106020526040902060038101541561287357919050565b5f828152601160205260409020546001600160a01b0316806128a8576040516361f2aa0160e11b815260040160405180910390fd5b828255600180830180546001600160a01b0319166001600160a01b0393909316929092179091555f928352600d6020526040909220909101546002820155681b1ae4d6e2ef500000600382015560058101805460ff1916905590565b6129386001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001683836129e6565b5050565b5f826001600160a01b0316826040515f6040518083038185875af1925050503d805f8114612985576040519150601f19603f3d011682016040523d82523d5f602084013e61298a565b606091505b50509050806129ac5760405163022e258160e11b815260040160405180910390fd5b505050565b6129ac6001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016848484612a1b565b6129f38383836001612a57565b6129ac57604051635274afe760e01b81526001600160a01b038416600482015260240161109d565b612a29848484846001612ab9565b612a5157604051635274afe760e01b81526001600160a01b038516600482015260240161109d565b50505050565b60405163a9059cbb60e01b5f8181526001600160a01b038616600452602485905291602083604481808b5af1925060015f51148316612aad578383151615612aa1573d5f823e3d81fd5b5f873b113d1516831692505b60405250949350505050565b6040516323b872dd60e01b5f8181526001600160a01b038781166004528616602452604485905291602083606481808c5af1925060015f51148316612b15578383151615612b09573d5f823e3d81fd5b5f883b113d1516831692505b604052505f60605295945050505050565b5f60208284031215612b36575f5ffd5b5035919050565b80356001600160a01b0381168114612b53575f5ffd5b919050565b5f60208284031215612b68575f5ffd5b610dac82612b3d565b80358015158114612b53575f5ffd5b5f60208284031215612b90575f5ffd5b610dac82612b71565b878152866020820152851515604082015284606082015260e060808201525f84518060e0840152806020870161010085015e5f6101008285018101919091526001600160a01b039590951660a084015260c083019390935250601f909101601f1916010195945050505050565b5f5f83601f840112612c16575f5ffd5b50813567ffffffffffffffff811115612c2d575f5ffd5b602083019150836020828501011115612c44575f5ffd5b9250929050565b5f5f5f5f5f5f5f60a0888a031215612c61575f5ffd5b8735965060208801359550604088013567ffffffffffffffff811115612c85575f5ffd5b612c918a828b01612c06565b909650945050606088013567ffffffffffffffff811115612cb0575f5ffd5b612cbc8a828b01612c06565b9094509250612ccf905060808901612b71565b905092959891949750929550565b5f5f60408385031215612cee575f5ffd5b82359150612cfe60208401612b3d565b90509250929050565b5f5f60408385031215612d18575f5ffd5b50508035926020909101359150565b5f5f60408385031215612d38575f5ffd5b82359150612cfe60208401612b71565b602080825282518282018190525f918401906040840190835b81811015612d7f578351835260209384019390920191600101612d61565b509095945050505050565b5f5f5f60608486031215612d9c575f5ffd5b8335925060208401359150612db360408501612b71565b90509250925092565b600181811c90821680612dd057607f821691505b602082108103612dee57634e487b7160e01b5f52602260045260245ffd5b50919050565b634e487b7160e01b5f52601160045260245ffd5b8181038181111561145e5761145e612df4565b808202811582820484141761145e5761145e612df4565b5f82612e4c57634e487b7160e01b5f52601260045260245ffd5b500490565b8082018082111561145e5761145e612df4565b818382375f9101908152919050565b634e487b7160e01b5f52604160045260245ffd5b601f8211156129ac57828211156129ac57805f5260205f20601f840160051c6020851015612eb257505f5b90810190601f840160051c035f5b81811015612ed5575f83820155600101612ec0565b505050505050565b815167ffffffffffffffff811115612ef757612ef7612e73565b612f0b81612f058454612dbc565b84612e87565b6020601f821160018114612f3d575f8315612f265750848201515b5f19600385901b1c1916600184901b178455612f95565b5f84815260208120601f198516915b82811015612f6c5787850151825560209485019460019092019101612f4c565b5084821015612f8957868401515f19600387901b60f8161c191681555b505060018360011b0184555b5050505050565b858152841515602082015283604082015260806060820152816080820152818360a08301375f81830160a090810191909152601f909201601f19160101949350505050565b634e487b7160e01b5f52603260045260245ffd5b5f60208284031215613005575f5ffd5b5051919050565b5f6020828403121561301c575f5ffd5b815160ff81168114610dac575f5ffd5b6001815b60018411156130675780850481111561304b5761304b612df4565b600184161561305957908102905b60019390931c928002613030565b935093915050565b5f8261307d5750600161145e565b8161308957505f61145e565b816001811461309f57600281146130a9576130c5565b600191505061145e565b60ff8411156130ba576130ba612df4565b50506001821b61145e565b5060208310610133831016604e8410600b84101617156130e8575081810a61145e565b6130f45f19848461302c565b805f190482111561310757613107612df4565b029392505050565b5f610dac60ff84168361306f56fea26469706673582212204ca90de90160a0ad154bfdd373cb9ef64b56dbaa61ecfe109866dac33917c5d364736f6c63430008220033" as const;

export const ghostProtocolDeployedBytecode = "0x6080604052600436106102f6575f3560e01c80638c1a60b211610189578063c69ab501116100d8578063dbd8c05711610092578063f0f442601161006d578063f0f4426014610ac2578063f2fde38b14610ae1578063f4dceacd14610b00578063f99156cb14610b1f575f5ffd5b8063dbd8c05714610a79578063e1a4521814610a8e578063e30c397814610aa3575f5ffd5b8063c69ab501146109c5578063c9ab7130146109e1578063cb3399e814610a00578063d365d09414610a1f578063d4ade87514610a4a578063d73848cc14610a5d575f5ffd5b8063a4fa95bf11610143578063af414d411161011e578063af414d411461096c578063b3dfbcf814610986578063b87c11141461099b578063b9fa45da146109b0575f5ffd5b8063a4fa95bf14610900578063a60051ae1461092c578063a6d2fcd914610941575f5ffd5b80638c1a60b2146107dd5780638c37f11d146107f95780638da5cb5b1461080e578063924d3f561461082c578063938a8bca146108495780639e33bb861461085e575f5ffd5b806361d027b3116102455780636bccc753116101ff57806379ba5097116101da57806379ba50971461076c5780637adbf973146107805780637dc0d1d01461079f5780638748c6b9146107be575f5ffd5b80636bccc75314610687578063771aceef146106ba57806378f88d6714610750575f5ffd5b806361d027b31461054b57806365137dd01461058257806367310b5a146105e657806368f5c6631461061f5780636a01a7751461063e5780636a65eaa614610672575f5ffd5b806321026950116102b05780634a7221a01161028b5780634a7221a0146104b75780635191e467146104e957806353093093146104fc5780635c975abb1461052b575f5ffd5b806321026950146104645780632cad2f651461048357806338902fdb146104a2575f5ffd5b8063056962c31461033657806308104069146103755780630efd66e2146103935780631433219c146103be57806316c38b3c146103e957806319b881e41461040a575f5ffd5b366103325760405134815233907f719feb717c187001672aa98b85a51988a7fab410c32ed1d724838c8377bf90af9060200160405180910390a2005b5f5ffd5b348015610341575f5ffd5b50610355610350366004612b26565b610b34565b604080519384526020840192909252908201526060015b60405180910390f35b348015610380575f5ffd5b50600f545b60405190815260200161036c565b34801561039e575f5ffd5b506103856103ad366004612b58565b60156020525f908152604090205481565b3480156103c9575f5ffd5b506103856103d8366004612b26565b60136020525f908152604090205481565b3480156103f4575f5ffd5b50610408610403366004612b80565b610bc3565b005b348015610415575f5ffd5b50610429610424366004612b26565b610c45565b6040805196875260208701959095529215159385019390935260608401526001600160a01b03909116608083015260a082015260c00161036c565b34801561046f575f5ffd5b5061038561047e366004612b26565b610d3d565b34801561048e575f5ffd5b5061040861049d366004612b26565b610db3565b3480156104ad575f5ffd5b5061038560085481565b3480156104c2575f5ffd5b506104d66104d1366004612b26565b610eaa565b60405161036c9796959493929190612b99565b6104086104f7366004612c4b565b610fa2565b348015610507575f5ffd5b5061051b610516366004612cdd565b611438565b604051901515815260200161036c565b348015610536575f5ffd5b5060035461051b90600160a01b900460ff1681565b348015610556575f5ffd5b5060035461056a906001600160a01b031681565b6040516001600160a01b03909116815260200161036c565b34801561058d575f5ffd5b506105a161059c366004612d07565b611464565b604080519788526001600160a01b039096166020880152931515948601949094526060850191909152608084015290151560a0830152151560c082015260e00161036c565b3480156105f1575f5ffd5b5061051b610600366004612cdd565b601260209081525f928352604080842090915290825290205460ff1681565b34801561062a575f5ffd5b50610408610639366004612b26565b611519565b348015610649575f5ffd5b5061056a610658366004612b26565b60116020525f90815260409020546001600160a01b031681565b34801561067d575f5ffd5b5061038560055481565b348015610692575f5ffd5b5061056a7f000000000000000000000000000000000000000000000000000000000000000081565b3480156106c5575f5ffd5b50600454600554600654600754600854600954600a8054600b54600c546003549293919290918a101590600160a01b900460ff16604080519b8c5260208c019a909a52988a01979097526060890195909552608088019390935260a087019190915260c086015260e0850152610100840152151561012083015215156101408201526101600161036c565b34801561075b575f5ffd5b50610385681b1ae4d6e2ef50000081565b348015610777575f5ffd5b50610408611832565b34801561078b575f5ffd5b5061040861079a366004612b58565b6118b3565b3480156107aa575f5ffd5b5060025461056a906001600160a01b031681565b3480156107c9575f5ffd5b506104086107d8366004612d27565b611955565b3480156107e8575f5ffd5b50610385680ad78ebc5ac620000081565b348015610804575f5ffd5b50610385600c5481565b348015610819575f5ffd5b505f5461056a906001600160a01b031681565b348015610837575f5ffd5b5061038569010f0cf064dd5920000081565b348015610854575f5ffd5b50610385600b5481565b348015610869575f5ffd5b506108c1610878366004612b26565b60106020525f9081526040902080546001820154600283015460038401546004850154600586015460069096015494956001600160a01b039094169492939192909160ff169087565b604080519788526001600160a01b0390961660208801529486019390935260608501919091526080840152151560a083015260c082015260e00161036c565b34801561090b575f5ffd5b5061091f61091a366004612d07565b611b07565b60405161036c9190612d48565b348015610937575f5ffd5b50610385610bb881565b34801561094c575f5ffd5b5061038561095b366004612b58565b60146020525f908152604090205481565b348015610977575f5ffd5b506103856621c0331d5dc00081565b348015610991575f5ffd5b5061038560065481565b3480156109a6575f5ffd5b5061038560045481565b3480156109bb575f5ffd5b5061038560075481565b3480156109d0575f5ffd5b50610385683635c9adc5dea0000081565b3480156109ec575f5ffd5b5061051b6109fb366004612cdd565b611bf6565b348015610a0b575f5ffd5b50610408610a1a366004612d8a565b611c68565b348015610a2a575f5ffd5b50610385610a39366004612b26565b5f908152600e602052604090205490565b610408610a58366004612b26565b6120ef565b348015610a68575f5ffd5b5061038568056bc75e2d6310000081565b348015610a84575f5ffd5b50610385600a5481565b348015610a99575f5ffd5b5061038561271081565b348015610aae575f5ffd5b5060015461056a906001600160a01b031681565b348015610acd575f5ffd5b50610408610adc366004612b58565b612380565b348015610aec575f5ffd5b50610408610afb366004612b58565b612422565b348015610b0b575f5ffd5b50610408610b1a366004612b26565b6124c3565b348015610b2a575f5ffd5b5061038560095481565b5f818152600d6020526040812054819081908103610b65576040516303d4572d60e51b815260040160405180910390fd5b5f848152601060205260408120600381015490919015610b89578160030154610b94565b681b1ae4d6e2ef5000005b60068301545f8881526013602052604090205491925090610bb4836127ae565b94509450945050509193909250565b5f546001600160a01b03163314610bed576040516330cd747160e01b815260040160405180910390fd5b60038054821515600160a01b0260ff60a01b199091161790556040517fb31006682779d0ac02864bee834675baf4592a679bfe75edd5e5847b52ef6f6e90610c3a90831515815260200190565b60405180910390a150565b5f818152600d6020526040812054819081908190819081908103610c7c576040516303d4572d60e51b815260040160405180910390fd5b5f87815260106020526040812060018101549091906001600160a01b0316610cba575f898152601160205260409020546001600160a01b0316610cc9565b60018201546001600160a01b03165b90505f82600201545f03610ced575f8a8152600d6020526040902060010154610cf3565b82600201545b905082600301545f14610d0a578260030154610d15565b681b1ae4d6e2ef5000005b60048401546005850154600690950154919c909b5060ff909416995097509095509350915050565b5f818152600d60205260408120548103610d6a576040516303d4572d60e51b815260040160405180910390fd5b5f8281526010602052604081206003015415610d96575f83815260106020526040902060030154610da1565b681b1ae4d6e2ef5000005b9050610dac816127ae565b9392505050565b600354600160a01b900460ff1615610dde5760405163ab35696f60e01b815260040160405180910390fd5b5f818152600d60205260408120549003610e0b576040516303d4572d60e51b815260040160405180910390fd5b5f610e1582612857565b60018101549091506001600160a01b03163314610e4557604051632731809760e11b815260040160405180910390fd5b600581015460ff1615610e6b57604051635d51ae1160e11b815260040160405180910390fd5b60058101805460ff19166001179055604051339083907f4fc8ba7f4f3c695895c779eb7fde668149b9eed94bfc8e5dda5899c40eca973b905f90a35050565b5f818152600d602052604081208054600182015460028301546003840154600585015460068601546004870180548998899889986060988a98899894979396929560ff9092169490936001600160a01b03909116918390610f0a90612dbc565b80601f0160208091040260200160405190810160405280929190818152602001828054610f3690612dbc565b8015610f815780601f10610f5857610100808354040283529160200191610f81565b820191905f5260205f20905b815481529060010190602001808311610f6457829003601f168201915b50505050509250975097509750975097509750975050919395979092949650565b600354600160a01b900460ff1615610fcd5760405163ab35696f60e01b815260040160405180910390fd5b601654600114610ff057604051631762c6f360e01b815260040160405180910390fd5b6002601655866110135760405163b780d61f60e01b815260040160405180910390fd5b8515806110205750606486115b1561103e57604051630f7fcb2960e21b815260040160405180910390fd5b5f878152600d60205260409020541561106a57604051635665e77960e11b815260040160405180910390fd5b6621c0331d5dc0003410156110a657604051633ebbc33760e01b81526621c0331d5dc00060048201523460248201526044015b60405180910390fd5b5f6110b86621c0331d5dc00034612e08565b90505f6127106110d1610bb86621c0331d5dc000612e1b565b6110db9190612e32565b90505f6110ef826621c0331d5dc000612e08565b90505f5f90506621c0331d5dc000600a5f82825461110d9190612e51565b9250508190555082600b5f8282546111259190612e51565b9250508190555081600c5f82825461113d9190612e51565b92505081905550600160045f8282546111569190612e51565b909155508590506111f657600160055f8282546111739190612e51565b92505081905550600160075f82825461118c9190612e51565b9091555061119d90508a6032612e1b565b6111af90670de0b6b3a7640000612e1b565b905069010f0cf064dd592000008111156111d0575069010f0cf064dd592000005b8060085f8282546111e19190612e51565b909155506111f190503382612904565b61120e565b600160065f8282546112089190612e51565b90915550505b6040518060e001604052804281526020018b815260200186151581526020018a8a60405161123d929190612e64565b6040518091039020815260200188888080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92018290525093855250503360208085019190915260409384018690528f8352600d81529183902084518155918401516001830155509082015160028201805460ff191691151591909117905560608201516003820155608082015160048201906112e09082612edd565b5060a08201516005820180546001600160a01b039092166001600160a01b031992831617905560c0909201516006909101555f8c815260116020526040812080549092163317909155600f805460018101825591527f8d1108e10bcb7c27dddfc02ed9d693a074039d026cf4ea4240b40f7d581ac802018b90556113638b612857565b50821561138057600354611380906001600160a01b03168461293c565b831561139057611390338561293c565b336001600160a01b03168b7f356e37b4b3a3dbbf61e05450c7d74955350550a659bd8792d406b6c27133a0e18c88858c8c6040516113d2959493929190612f9c565b60405180910390a3604080516621c0331d5dc0008152602081018590529081018390528b9033907fd381803faab74092aedc8de24231e595cfd3af1a0997ead17e7bcd54d9777c109060600160405180910390a350506001601655505050505050505050565b5f8281526012602090815260408083206001600160a01b038516845290915290205460ff165b92915050565b5f828152600e6020526040812054819081908190819081908190881061149d57604051635878ae8560e11b815260040160405180910390fd5b5f898152600e6020526040812080548a9081106114bc576114bc612fe1565b5f91825260209091206005909102018054600182015460028301546003840154600490940154929e6001600160a01b0383169e5060ff600160a01b90930483169d50909b5092995080821698506101009091041695509350505050565b600354600160a01b900460ff16156115445760405163ab35696f60e01b815260040160405180910390fd5b5f818152600d60205260408120549003611571576040516303d4572d60e51b815260040160405180910390fd5b5f81815260126020908152604080832033845290915290205460ff16156115ab576040516328486b6360e11b815260040160405180910390fd5b5f6115b582612857565b600581015490915060ff16156115de57604051632444f8b760e11b815260040160405180910390fd5b60405163aaac37a160e01b81523360048201525f907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063aaac37a190602401602060405180830381865afa158015611642573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906116669190612ff5565b5f848152600d60205260408120600101549192509061168c90662386f26fc10000612e1b565b9050808210156116b9576040516320200bc560e01b8152600481018390526024810182905260440161109d565b683635c9adc5dea000008210156116f5576040516320200bc560e01b815260048101839052683635c9adc5dea00000602482015260440161109d565b5f8481526012602090815260408083203384529091528120805460ff191660011790556064611725836005612e1b565b61172f9190612e32565b90506001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001663de50a7953361176b8487612e51565b6040516001600160e01b031960e085901b1681526001600160a01b03909216600483015260248201526044015f604051808303815f87803b1580156117ae575f5ffd5b505af11580156117c0573d5f5f3e3d5ffd5b50505050336001600160a01b0316857f2ee8d21874599264c54876b79bf25eae1b396c3771a178e683a9e038b634f1d75f604051611823918152604060208201819052600b908201526a435245444942494c49545960a81b606082015260800190565b60405180910390a35050505050565b6001546001600160a01b0316331461185d57604051630614e5c760e21b815260040160405180910390fd5b5f8054336001600160a01b0319808316821784556001805490911690556040516001600160a01b0390921692909183917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a350565b5f546001600160a01b031633146118dd576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b0381166119045760405163e6c4247b60e01b815260040160405180910390fd5b600280546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f078c3b417dadf69374a59793b829c52001247130433427049317bde56607b1b7905f90a35050565b600354600160a01b900460ff16156119805760405163ab35696f60e01b815260040160405180910390fd5b6016546001146119a357604051631762c6f360e01b815260040160405180910390fd5b60026016555f828152600d602052604081205490036119d5576040516303d4572d60e51b815260040160405180910390fd5b6119e9333068056bc75e2d631000006129b1565b5f828152600e60209081526040808320815160e0810183528681523381850181815287151583860181815268056bc75e2d6310000060608601818152426080880190815260a088018c815260c089018d81528a5460018082018d559b8f529d8d902099516005909e029099019c8d559551988c01805494511515600160a01b026001600160a81b03199095166001600160a01b03909a169990991793909317909755955160028a0155516003890155905160049097018054935115156101000261ff00199815159890981661ffff199094169390931796909617909155825194855292840152909184917fa04181c550a5111ebee021519f1381f122b78eb4e9b9194a64cd6c9de7737351910160405180910390a350506001601655565b600f546060908084101580611b1a575082155b15611b34575050604080515f81526020810190915261145e565b5f611b3f8583612e08565b90505f848210611b4f5784611b51565b815b90508067ffffffffffffffff811115611b6c57611b6c612e73565b604051908082528060200260200182016040528015611b95578160200160208202803683370190505b5093505f5b81811015611bec57600f611bae8289612e51565b81548110611bbe57611bbe612fe1565b905f5260205f200154858281518110611bd957611bd9612fe1565b6020908102919091010152600101611b9a565b5050505092915050565b5f828152600d60205260408120548103611c23576040516303d4572d60e51b815260040160405180910390fd5b5f8381526010602052604090206005015460ff1680610dac5750505f9182526012602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6002546001600160a01b03163314611c9357604051631bc2178f60e01b815260040160405180910390fd5b600354600160a01b900460ff1615611cbe5760405163ab35696f60e01b815260040160405180910390fd5b601654600114611ce157604051631762c6f360e01b815260040160405180910390fd5b60026016555f838152600e60205260409020548210611d1357604051635878ae8560e11b815260040160405180910390fd5b5f838152600e60205260408120805484908110611d3257611d32612fe1565b5f9182526020909120600590910201600481015490915060ff1615611d6a576040516336ab81e160e11b815260040160405180910390fd5b600481018054600183810154600160a01b900460ff90811615158615151461010090810261ffff19909416939093179091179283905591041615611f86576001810154611dc9906001600160a01b0316680ad78ebc5ac6200000612904565b680ad78ebc5ac620000060085f828254611de39190612e51565b90915550506001818101546001600160a01b03165f9081526015602052604081208054909190611e14908490612e51565b90915550506001818101546001600160a01b03165f9081526014602052604081208054909190611e45908490612e51565b9091555050600181015460405163aaac37a160e01b81526001600160a01b0391821660048201525f917f0000000000000000000000000000000000000000000000000000000000000000169063aaac37a190602401602060405180830381865afa158015611eb5573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190611ed99190612ff5565b60018301549091506001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081169163de50a7959116611f278468056bc75e2d63100000612e51565b6040516001600160e01b031960e085901b1681526001600160a01b03909216600483015260248201526044015f604051808303815f87803b158015611f6a575f5ffd5b505af1158015611f7c573d5f5f3e3d5ffd5b5050505050612072565b5f611f9085612857565b90505f611fa7600268056bc75e2d63100000612e32565b6001830154909150611fc2906001600160a01b031682612904565b604051632770a7eb60e21b8152306004820152602481018290527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690639dc29fac906044015f604051808303815f87803b158015612027575f5ffd5b505af1158015612039573d5f5f3e3d5ffd5b505050508060095f82825461204e9190612e51565b90915550505060018201546001600160a01b03165f90815260156020526040812055505b600181015460048201546001600160a01b039091169085907f8aa1336152b005ddd3ccc39b5a66ed207555053dd23bc9cff1aab405f6348ea590610100900460ff16806120bf575f6120ca565b680ad78ebc5ac62000005b60408051921515835260208301919091520160405180910390a3505060016016555050565b600354600160a01b900460ff161561211a5760405163ab35696f60e01b815260040160405180910390fd5b60165460011461213d57604051631762c6f360e01b815260040160405180910390fd5b60026016555f818152600d6020526040812054900361216f576040516303d4572d60e51b815260040160405180910390fd5b5f81815260126020908152604080832033845290915290205460ff16156121a9576040516328486b6360e11b815260040160405180910390fd5b5f6121b382612857565b600581015490915060ff16156121dc57604051632444f8b760e11b815260040160405180910390fd5b60038101545f6121eb84610d3d565b90508034101561221757604051633ebbc33760e01b81526004810182905234602482015260440161109d565b5f8481526012602090815260408083203384529091528120805460ff1916600190811790915560048501805491929091612252908490612e51565b909155505060048301546103e89061226a9084612e1b565b6122749190612e32565b61227e9083612e51565b60038401555f84815260136020526040812080548392906122a0908490612e51565b909155505060018301546122bd906001600160a01b03168261293c565b803411156122d8576122d8336122d38334612e08565b61293c565b336001600160a01b0316847f2ee8d21874599264c54876b79bf25eae1b396c3771a178e683a9e038b634f1d78460405161232f9181526040602082018190526003908201526208aa8960eb1b606082015260800190565b60405180910390a3837f68520cf07e2f785cba8f9601c758232191b84e9f0a8ec7b3049d2dcc197b67fe846003015460405161236d91815260200190565b60405180910390a2505060016016555050565b5f546001600160a01b031633146123aa576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b0381166123d15760405163e6c4247b60e01b815260040160405180910390fd5b600380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f4ab5be82436d353e61ca18726e984e561f5c1cc7c6d38b29d2553c790434705a905f90a35050565b5f546001600160a01b0316331461244c576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b0381166124735760405163e6c4247b60e01b815260040160405180910390fd5b600180546001600160a01b0319166001600160a01b038381169182179092555f8054604051929316917f38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e227009190a350565b600354600160a01b900460ff16156124ee5760405163ab35696f60e01b815260040160405180910390fd5b60165460011461251157604051631762c6f360e01b815260040160405180910390fd5b60026016555f818152600d60205260408120549003612543576040516303d4572d60e51b815260040160405180910390fd5b5f81815260126020908152604080832033845290915290205460ff161561257d576040516328486b6360e11b815260040160405180910390fd5b5f61258782612857565b600581015490915060ff16156125b057604051632444f8b760e11b815260040160405180910390fd5b60038101545f6125c1600283612e32565b90505f6125ce8284612e08565b90506125db3330856129b1565b604051632770a7eb60e21b8152306004820152602481018390527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690639dc29fac906044015f604051808303815f87803b158015612640575f5ffd5b505af1158015612652573d5f5f3e3d5ffd5b505050508160095f8282546126679190612e51565b90915550506001840154612684906001600160a01b031682612904565b5f8581526012602090815260408083203384529091528120805460ff19166001908117909155600486018054919290916126bf908490612e51565b9250508190555080846006015f8282546126d99190612e51565b909155505060048401546103e8906126f19085612e1b565b6126fb9190612e32565b6127059084612e51565b6003850155604051339086907f2ee8d21874599264c54876b79bf25eae1b396c3771a178e683a9e038b634f1d79061275c9087815260406020820181905260049082015263212aa92760e11b606082015260800190565b60405180910390a3847f68520cf07e2f785cba8f9601c758232191b84e9f0a8ec7b3049d2dcc197b67fe856003015460405161279a91815260200190565b60405180910390a250506001601655505050565b5f5f7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa15801561280c573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190612830919061300c565b61283b90600a61310f565b90508061284d8464e8d4a51000612e1b565b610dac9190612e32565b5f81815260106020526040902060038101541561287357919050565b5f828152601160205260409020546001600160a01b0316806128a8576040516361f2aa0160e11b815260040160405180910390fd5b828255600180830180546001600160a01b0319166001600160a01b0393909316929092179091555f928352600d6020526040909220909101546002820155681b1ae4d6e2ef500000600382015560058101805460ff1916905590565b6129386001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001683836129e6565b5050565b5f826001600160a01b0316826040515f6040518083038185875af1925050503d805f8114612985576040519150601f19603f3d011682016040523d82523d5f602084013e61298a565b606091505b50509050806129ac5760405163022e258160e11b815260040160405180910390fd5b505050565b6129ac6001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016848484612a1b565b6129f38383836001612a57565b6129ac57604051635274afe760e01b81526001600160a01b038416600482015260240161109d565b612a29848484846001612ab9565b612a5157604051635274afe760e01b81526001600160a01b038516600482015260240161109d565b50505050565b60405163a9059cbb60e01b5f8181526001600160a01b038616600452602485905291602083604481808b5af1925060015f51148316612aad578383151615612aa1573d5f823e3d81fd5b5f873b113d1516831692505b60405250949350505050565b6040516323b872dd60e01b5f8181526001600160a01b038781166004528616602452604485905291602083606481808c5af1925060015f51148316612b15578383151615612b09573d5f823e3d81fd5b5f883b113d1516831692505b604052505f60605295945050505050565b5f60208284031215612b36575f5ffd5b5035919050565b80356001600160a01b0381168114612b53575f5ffd5b919050565b5f60208284031215612b68575f5ffd5b610dac82612b3d565b80358015158114612b53575f5ffd5b5f60208284031215612b90575f5ffd5b610dac82612b71565b878152866020820152851515604082015284606082015260e060808201525f84518060e0840152806020870161010085015e5f6101008285018101919091526001600160a01b039590951660a084015260c083019390935250601f909101601f1916010195945050505050565b5f5f83601f840112612c16575f5ffd5b50813567ffffffffffffffff811115612c2d575f5ffd5b602083019150836020828501011115612c44575f5ffd5b9250929050565b5f5f5f5f5f5f5f60a0888a031215612c61575f5ffd5b8735965060208801359550604088013567ffffffffffffffff811115612c85575f5ffd5b612c918a828b01612c06565b909650945050606088013567ffffffffffffffff811115612cb0575f5ffd5b612cbc8a828b01612c06565b9094509250612ccf905060808901612b71565b905092959891949750929550565b5f5f60408385031215612cee575f5ffd5b82359150612cfe60208401612b3d565b90509250929050565b5f5f60408385031215612d18575f5ffd5b50508035926020909101359150565b5f5f60408385031215612d38575f5ffd5b82359150612cfe60208401612b71565b602080825282518282018190525f918401906040840190835b81811015612d7f578351835260209384019390920191600101612d61565b509095945050505050565b5f5f5f60608486031215612d9c575f5ffd5b8335925060208401359150612db360408501612b71565b90509250925092565b600181811c90821680612dd057607f821691505b602082108103612dee57634e487b7160e01b5f52602260045260245ffd5b50919050565b634e487b7160e01b5f52601160045260245ffd5b8181038181111561145e5761145e612df4565b808202811582820484141761145e5761145e612df4565b5f82612e4c57634e487b7160e01b5f52601260045260245ffd5b500490565b8082018082111561145e5761145e612df4565b818382375f9101908152919050565b634e487b7160e01b5f52604160045260245ffd5b601f8211156129ac57828211156129ac57805f5260205f20601f840160051c6020851015612eb257505f5b90810190601f840160051c035f5b81811015612ed5575f83820155600101612ec0565b505050505050565b815167ffffffffffffffff811115612ef757612ef7612e73565b612f0b81612f058454612dbc565b84612e87565b6020601f821160018114612f3d575f8315612f265750848201515b5f19600385901b1c1916600184901b178455612f95565b5f84815260208120601f198516915b82811015612f6c5787850151825560209485019460019092019101612f4c565b5084821015612f8957868401515f19600387901b60f8161c191681555b505060018360011b0184555b5050505050565b858152841515602082015283604082015260806060820152816080820152818360a08301375f81830160a090810191909152601f909201601f19160101949350505050565b634e487b7160e01b5f52603260045260245ffd5b5f60208284031215613005575f5ffd5b5051919050565b5f6020828403121561301c575f5ffd5b815160ff81168114610dac575f5ffd5b6001815b60018411156130675780850481111561304b5761304b612df4565b600184161561305957908102905b60019390931c928002613030565b935093915050565b5f8261307d5750600161145e565b8161308957505f61145e565b816001811461309f57600281146130a9576130c5565b600191505061145e565b60ff8411156130ba576130ba612df4565b50506001821b61145e565b5060208310610133831016604e8410600b84101617156130e8575081810a61145e565b6130f45f19848461302c565b805f190482111561310757613107612df4565b029392505050565b5f610dac60ff84168361306f56fea26469706673582212204ca90de90160a0ad154bfdd373cb9ef64b56dbaa61ecfe109866dac33917c5d364736f6c63430008220033" as const;

export const ghostProtocolArtifact = {
  contractName: ghostProtocolContractName,
  abi: ghostProtocolAbi,
  bytecode: ghostProtocolBytecode,
  deployedBytecode: ghostProtocolDeployedBytecode,
} as const;
