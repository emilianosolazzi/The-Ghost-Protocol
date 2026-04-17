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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "availableAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "requestedAmount",
        "type": "uint256"
      }
    ],
    "name": "InsufficientProtocolEth",
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
    "name": "InvalidQuoteAmount",
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
    "name": "NotPricingOracle",
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "lastUpdatedAt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxAge",
        "type": "uint256"
      }
    ],
    "name": "StaleUnlockPriceQuote",
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
    "inputs": [],
    "name": "UnlockPriceQuoteNotSet",
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
        "name": "previousPricingOracle",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newPricingOracle",
        "type": "address"
      }
    ],
    "name": "PricingOracleUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "previousScore",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newScore",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "reason",
        "type": "string"
      }
    ],
    "name": "ProtocolCredibilityUpdated",
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
        "internalType": "address",
        "name": "treasury",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "ProtocolRevenueWithdrawn",
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
        "indexed": false,
        "internalType": "uint256",
        "name": "previousQuoteWeiPerToken",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newQuoteWeiPerToken",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "updatedAt",
        "type": "uint256"
      }
    ],
    "name": "UnlockPriceQuoteUpdated",
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
    "name": "MAX_UNLOCK_PRICE",
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
    "name": "MAX_UNLOCK_PRICE_QUOTE_AGE",
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
    "name": "UNLOCK_PRICE_STEP",
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
        "name": "protocolRetainedRevenue",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "protocolWithdrawn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "protocolBalance",
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
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "getUserCredibility",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "tokenCredibility",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "protocolCredibility",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "effectiveCredibility",
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
    "name": "pricingOracle",
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
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "protocolCredibilityScore",
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
        "name": "newPricingOracle",
        "type": "address"
      }
    ],
    "name": "setPricingOracle",
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
        "internalType": "uint256",
        "name": "quoteWeiPerToken",
        "type": "uint256"
      }
    ],
    "name": "setUnlockPriceQuote",
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
    "name": "totalProtocolWithdrawn",
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
    "inputs": [],
    "name": "unlockPriceQuoteUpdatedAt",
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
    "name": "unlockPriceQuoteWeiPerToken",
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdrawProtocolETH",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
] as const;

export const ghostProtocolBytecode = "0x60a06040526001601b55348015610014575f5ffd5b5060405161381b38038061381b833981016040819052610033916100ee565b6001600160a01b038316158061005057506001600160a01b038216155b8061006257506001600160a01b038116155b156100805760405163e6c4247b60e01b815260040160405180910390fd5b6001600160a01b039283166080525f8054336001600160a01b031991821617909155600480548216938516939093179092556002805483169190931690811790925560038054909116909117905561012e565b80516001600160a01b03811681146100e9575f5ffd5b919050565b5f5f5f60608486031215610100575f5ffd5b610109846100d3565b9250610117602085016100d3565b9150610125604085016100d3565b90509250925092565b6080516136a46101775f395f81816108050152818161183601528181612302015281816128fe01528181612af901528181612cd401528181612d330152612e7e01526136a45ff3fe6080604052600436106103b6575f3560e01c80638c1a60b2116101e9578063c89e74fb11610108578063e1a452181161009d578063f0f442601161006d578063f0f4426014610cdd578063f2fde38b14610cfc578063f4dceacd14610d1b578063f99156cb14610d3a575f5ffd5b8063e1a4521814610c78578063e30c397814610c8d578063e319c8d114610cac578063e332305d14610cc1575f5ffd5b8063d365d094116100d8578063d365d09414610c09578063d4ade87514610c34578063d73848cc14610c47578063dbd8c05714610c63575f5ffd5b8063c89e74fb14610b8a578063c9ab713014610bb5578063cb3399e814610bd4578063d0f6581b14610bf3575f5ffd5b8063a6d2fcd91161017e578063b87c11141161014e578063b87c111414610b25578063b9fa45da14610b3a578063bf813d8214610b4f578063c69ab50114610b6e575f5ffd5b8063a6d2fcd914610ab6578063af414d4114610ae1578063b3dfbcf814610afb578063b690d8a114610b10575f5ffd5b8063938a8bca116101b9578063938a8bca146109be5780639e33bb86146109d3578063a4fa95bf14610a75578063a60051ae14610aa1575f5ffd5b80638c1a60b2146109525780638c37f11d1461096e5780638da5cb5b14610983578063924d3f56146109a1575f5ffd5b806353093093116102d55780636a65eaa61161026a57806379ba50971161023a57806379ba5097146108e15780637adbf973146108f55780637dc0d1d0146109145780638748c6b914610933575f5ffd5b80636a65eaa6146107df5780636bccc753146107f4578063771aceef1461082757806378f88d67146108c5575f5ffd5b806365137dd0116102a557806365137dd0146106ef57806367310b5a1461075357806368f5c6631461078c5780636a01a775146107ab575f5ffd5b806353093093146106625780635bdf5621146106915780635c975abb146106b057806361d027b3146106d0575f5ffd5b80631a868c401161034b5780632ce13a031161031b5780632ce13a03146105ec57806338902fdb146106085780634a7221a01461061d5780635191e4671461064f575f5ffd5b80631a868c401461057a578063210269501461059957806329ff0d93146105b85780632cad2f65146105cd575f5ffd5b806313b781ab1161038657806313b781ab146104b55780631433219c146104d657806316c38b3c1461050157806319b881e414610520575f5ffd5b8063056962c3146103f657806308104069146104355780630efd66e214610453578063139ab0e71461047e575f5ffd5b366103f25760405134815233907f719feb717c187001672aa98b85a51988a7fab410c32ed1d724838c8377bf90af9060200160405180910390a2005b5f5ffd5b348015610401575f5ffd5b50610415610410366004613044565b610d4f565b604080519384526020840192909252908201526060015b60405180910390f35b348015610440575f5ffd5b506013545b60405190815260200161042c565b34801561045e575f5ffd5b5061044561046d366004613076565b601a6020525f908152604090205481565b348015610489575f5ffd5b5060035461049d906001600160a01b031681565b6040516001600160a01b03909116815260200161042c565b3480156104c0575f5ffd5b506104d46104cf366004613044565b610dde565b005b3480156104e1575f5ffd5b506104456104f0366004613044565b60176020525f908152604090205481565b34801561050c575f5ffd5b506104d461051b36600461309e565b610e7b565b34801561052b575f5ffd5b5061053f61053a366004613044565b610efd565b6040805196875260208701959095529215159385019390935260608401526001600160a01b03909116608083015260a082015260c00161042c565b348015610585575f5ffd5b506104d4610594366004613044565b610ff5565b3480156105a4575f5ffd5b506104456105b3366004613044565b6110ef565b3480156105c3575f5ffd5b5061044560065481565b3480156105d8575f5ffd5b506104d46105e7366004613044565b611165565b3480156105f7575f5ffd5b5061044568878678326eac90000081565b348015610613575f5ffd5b50610445600b5481565b348015610628575f5ffd5b5061063c610637366004613044565b61125c565b60405161042c97969594939291906130e5565b6104d461065d366004613175565b611354565b34801561066d575f5ffd5b5061068161067c366004613207565b6117e5565b604051901515815260200161042c565b34801561069c575f5ffd5b506104156106ab366004613076565b611811565b3480156106bb575f5ffd5b5060045461068190600160a01b900460ff1681565b3480156106db575f5ffd5b5060045461049d906001600160a01b031681565b3480156106fa575f5ffd5b5061070e610709366004613231565b6118d0565b604080519788526001600160a01b039096166020880152931515948601949094526060850191909152608084015290151560a0830152151560c082015260e00161042c565b34801561075e575f5ffd5b5061068161076d366004613207565b601660209081525f928352604080842090915290825290205460ff1681565b348015610797575f5ffd5b506104d46107a6366004613044565b611985565b3480156107b6575f5ffd5b5061049d6107c5366004613044565b60156020525f90815260409020546001600160a01b031681565b3480156107ea575f5ffd5b5061044560085481565b3480156107ff575f5ffd5b5061049d7f000000000000000000000000000000000000000000000000000000000000000081565b348015610832575f5ffd5b50600754600854600954600a8054600b54600c54600d54600e54600f54601054600454604080518d8152602081019c909c528b019990995260608a0196909652608089019490945260a088019290925260c087015260e08601526101008501526101208401524761014084015290921015610160820152600160a01b90910460ff1615156101808201526101a00161042c565b3480156108d0575f5ffd5b50610445681b1ae4d6e2ef50000081565b3480156108ec575f5ffd5b506104d4611ba8565b348015610900575f5ffd5b506104d461090f366004613076565b611c29565b34801561091f575f5ffd5b5060025461049d906001600160a01b031681565b34801561093e575f5ffd5b506104d461094d366004613251565b611ccb565b34801561095d575f5ffd5b50610445680ad78ebc5ac620000081565b348015610979575f5ffd5b50610445600f5481565b34801561098e575f5ffd5b505f5461049d906001600160a01b031681565b3480156109ac575f5ffd5b5061044569010f0cf064dd5920000081565b3480156109c9575f5ffd5b50610445600e5481565b3480156109de575f5ffd5b50610a366109ed366004613044565b60146020525f9081526040902080546001820154600283015460038401546004850154600586015460069096015494956001600160a01b039094169492939192909160ff169087565b604080519788526001600160a01b0390961660208801529486019390935260608501919091526080840152151560a083015260c082015260e00161042c565b348015610a80575f5ffd5b50610a94610a8f366004613231565b611e7d565b60405161042c9190613272565b348015610aac575f5ffd5b50610445610bb881565b348015610ac1575f5ffd5b50610445610ad0366004613076565b60196020525f908152604090205481565b348015610aec575f5ffd5b506104456621c0331d5dc00081565b348015610b06575f5ffd5b5061044560095481565b348015610b1b575f5ffd5b5061044560055481565b348015610b30575f5ffd5b5061044560075481565b348015610b45575f5ffd5b50610445600a5481565b348015610b5a575f5ffd5b506104d4610b69366004613076565b611f6c565b348015610b79575f5ffd5b50610445683635c9adc5dea0000081565b348015610b95575f5ffd5b50610445610ba4366004613076565b60186020525f908152604090205481565b348015610bc0575f5ffd5b50610681610bcf366004613207565b61200e565b348015610bdf575f5ffd5b506104d4610bee3660046132b4565b612080565b348015610bfe575f5ffd5b506104456201518081565b348015610c14575f5ffd5b50610445610c23366004613044565b5f9081526012602052604090205490565b6104d4610c42366004613044565b612413565b348015610c52575f5ffd5b5061044568056bc75e2d6310000081565b348015610c6e575f5ffd5b50610445600d5481565b348015610c83575f5ffd5b5061044561271081565b348015610c98575f5ffd5b5060015461049d906001600160a01b031681565b348015610cb7575f5ffd5b5061044560105481565b348015610ccc575f5ffd5b506104456802b5e3af16b188000081565b348015610ce8575f5ffd5b506104d4610cf7366004613076565b612687565b348015610d07575f5ffd5b506104d4610d16366004613076565b612729565b348015610d26575f5ffd5b506104d4610d35366004613044565b6127ca565b348015610d45575f5ffd5b50610445600c5481565b5f81815260116020526040812054819081908103610d80576040516303d4572d60e51b815260040160405180910390fd5b5f848152601460205260408120600381015490919015610da4578160030154610daf565b681b1ae4d6e2ef5000005b60068301545f8881526017602052604090205491925090610dcf83612a98565b94509450945050509193909250565b6003546001600160a01b03163314610e0957604051631dc610a960e21b815260040160405180910390fd5b805f03610e2957604051637f1402d560e11b815260040160405180910390fd5b6006805490829055426005819055604080518381526020810185905280820192909252517fd9c9c767abc8174b594a5a15dd708b5629ab3a49044a597f8f3c8510dec766899181900360600190a15050565b5f546001600160a01b03163314610ea5576040516330cd747160e01b815260040160405180910390fd5b60048054821515600160a01b0260ff60a01b199091161790556040517fb31006682779d0ac02864bee834675baf4592a679bfe75edd5e5847b52ef6f6e90610ef290831515815260200190565b60405180910390a150565b5f81815260116020526040812054819081908190819081908103610f34576040516303d4572d60e51b815260040160405180910390fd5b5f87815260146020526040812060018101549091906001600160a01b0316610f72575f898152601560205260409020546001600160a01b0316610f81565b60018201546001600160a01b03165b90505f82600201545f03610fa5575f8a815260116020526040902060010154610fab565b82600201545b905082600301545f14610fc2578260030154610fcd565b681b1ae4d6e2ef5000005b60048401546005850154600690950154919c909b5060ff909416995097509095509350915050565b5f546001600160a01b0316331461101f576040516330cd747160e01b815260040160405180910390fd5b601b5460011461104257604051631762c6f360e01b815260040160405180910390fd5b6002601b5547808211156110785760405163f8db689560e01b815260048101829052602481018390526044015b60405180910390fd5b8160105f82825461108991906132fa565b90915550506004546110a4906001600160a01b031683612ba5565b6004546040518381526001600160a01b03909116907ff7595c4fd7fa675e456dd9520ac8266c06d237d52900fc573bccc85b7c177c9e9060200160405180910390a250506001601b55565b5f81815260116020526040812054810361111c576040516303d4572d60e51b815260040160405180910390fd5b5f8281526014602052604081206003015415611148575f83815260146020526040902060030154611153565b681b1ae4d6e2ef5000005b905061115e81612a98565b9392505050565b600454600160a01b900460ff16156111905760405163ab35696f60e01b815260040160405180910390fd5b5f8181526011602052604081205490036111bd576040516303d4572d60e51b815260040160405180910390fd5b5f6111c782612c1a565b60018101549091506001600160a01b031633146111f757604051632731809760e11b815260040160405180910390fd5b600581015460ff161561121d57604051635d51ae1160e11b815260040160405180910390fd5b60058101805460ff19166001179055604051339083907f4fc8ba7f4f3c695895c779eb7fde668149b9eed94bfc8e5dda5899c40eca973b905f90a35050565b5f8181526011602052604081208054600182015460028301546003840154600585015460068601546004870180548998899889986060988a98899894979396929560ff9092169490936001600160a01b039091169183906112bc9061330d565b80601f01602080910402602001604051908101604052809291908181526020018280546112e89061330d565b80156113335780601f1061130a57610100808354040283529160200191611333565b820191905f5260205f20905b81548152906001019060200180831161131657829003601f168201915b50505050509250975097509750975097509750975050919395979092949650565b600454600160a01b900460ff161561137f5760405163ab35696f60e01b815260040160405180910390fd5b601b546001146113a257604051631762c6f360e01b815260040160405180910390fd5b6002601b55866113c55760405163b780d61f60e01b815260040160405180910390fd5b8515806113d25750606486115b156113f057604051630f7fcb2960e21b815260040160405180910390fd5b5f878152601160205260409020541561141c57604051635665e77960e11b815260040160405180910390fd5b6621c0331d5dc00034101561145357604051633ebbc33760e01b81526621c0331d5dc000600482015234602482015260440161106f565b5f6114656621c0331d5dc00034613345565b90505f61271061147e610bb86621c0331d5dc000613358565b611488919061336f565b90505f61149c826621c0331d5dc000613345565b90505f5f90506621c0331d5dc000600d5f8282546114ba91906132fa565b9250508190555082600e5f8282546114d291906132fa565b9250508190555081600f5f8282546114ea91906132fa565b92505081905550600160075f82825461150391906132fa565b909155508590506115a357600160085f82825461152091906132fa565b925050819055506001600a5f82825461153991906132fa565b9091555061154a90508a6032613358565b61155c90670de0b6b3a7640000613358565b905069010f0cf064dd5920000081111561157d575069010f0cf064dd592000005b80600b5f82825461158e91906132fa565b9091555061159e90503382612cc7565b6115bb565b600160095f8282546115b591906132fa565b90915550505b6040518060e001604052804281526020018b815260200186151581526020018a8a6040516115ea92919061338e565b6040518091039020815260200188888080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92018290525093855250503360208085019190915260409384018690528f8352601181529183902084518155918401516001830155509082015160028201805460ff1916911515919091179055606082015160038201556080820151600482019061168d9082613407565b5060a08201516005820180546001600160a01b039092166001600160a01b031992831617905560c0909201516006909101555f8c8152601560205260408120805490921633179091556013805460018101825591527f66de8ffda797e3de9c05e8fc57b3bf0ec28a930d40b0d285d93c06501cf6a090018b90556117108b612c1a565b50821561172d5760045461172d906001600160a01b031684612ba5565b831561173d5761173d3385612ba5565b336001600160a01b03168b7f356e37b4b3a3dbbf61e05450c7d74955350550a659bd8792d406b6c27133a0e18c88858c8c60405161177f9594939291906134c6565b60405180910390a3604080516621c0331d5dc0008152602081018590529081018390528b9033907fd381803faab74092aedc8de24231e595cfd3af1a0997ead17e7bcd54d9777c109060600160405180910390a350506001601b55505050505050505050565b5f8281526016602090815260408083206001600160a01b038516845290915290205460ff165b92915050565b60405163aaac37a160e01b81526001600160a01b0382811660048301525f91829182917f00000000000000000000000000000000000000000000000000000000000000009091169063aaac37a190602401602060405180830381865afa15801561187d573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906118a1919061350b565b6001600160a01b0385165f9081526018602052604090205490935091506118c882846132fa565b929491935050565b5f82815260126020526040812054819081908190819081908190881061190957604051635878ae8560e11b815260040160405180910390fd5b5f89815260126020526040812080548a90811061192857611928613522565b5f91825260209091206005909102018054600182015460028301546003840154600490940154929e6001600160a01b0383169e5060ff600160a01b90930483169d50909b5092995080821698506101009091041695509350505050565b600454600160a01b900460ff16156119b05760405163ab35696f60e01b815260040160405180910390fd5b5f8181526011602052604081205490036119dd576040516303d4572d60e51b815260040160405180910390fd5b5f81815260166020908152604080832033845290915290205460ff1615611a17576040516328486b6360e11b815260040160405180910390fd5b5f611a2182612c1a565b600581015490915060ff1615611a4a57604051632444f8b760e11b815260040160405180910390fd5b5f611a5433612cff565b90505f611a6084612da8565b905080821015611a8d576040516320200bc560e01b8152600481018390526024810182905260440161106f565b683635c9adc5dea00000821015611ac9576040516320200bc560e01b815260048101839052683635c9adc5dea00000602482015260440161106f565b5f8481526016602090815260408083203384529091528120805460ff191660011790556064611af9836005613358565b611b03919061336f565b9050611b3a338260405180604001604052806012815260200171435245444942494c4954595f554e4c4f434b60701b815250612ded565b336001600160a01b0316857f2ee8d21874599264c54876b79bf25eae1b396c3771a178e683a9e038b634f1d75f604051611b99918152604060208201819052600b908201526a435245444942494c49545960a81b606082015260800190565b60405180910390a35050505050565b6001546001600160a01b03163314611bd357604051630614e5c760e21b815260040160405180910390fd5b5f8054336001600160a01b0319808316821784556001805490911690556040516001600160a01b0390921692909183917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a350565b5f546001600160a01b03163314611c53576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b038116611c7a5760405163e6c4247b60e01b815260040160405180910390fd5b600280546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f078c3b417dadf69374a59793b829c52001247130433427049317bde56607b1b7905f90a35050565b600454600160a01b900460ff1615611cf65760405163ab35696f60e01b815260040160405180910390fd5b601b54600114611d1957604051631762c6f360e01b815260040160405180910390fd5b6002601b555f828152601160205260408120549003611d4b576040516303d4572d60e51b815260040160405180910390fd5b611d5f333068056bc75e2d63100000612e71565b5f828152601260209081526040808320815160e0810183528681523381850181815287151583860181815268056bc75e2d6310000060608601818152426080880190815260a088018c815260c089018d81528a5460018082018d559b8f529d8d902099516005909e029099019c8d559551988c01805494511515600160a01b026001600160a81b03199095166001600160a01b03909a169990991793909317909755955160028a0155516003890155905160049097018054935115156101000261ff00199815159890981661ffff199094169390931796909617909155825194855292840152909184917fa04181c550a5111ebee021519f1381f122b78eb4e9b9194a64cd6c9de7737351910160405180910390a350506001601b55565b6013546060908084101580611e90575082155b15611eaa575050604080515f81526020810190915261180b565b5f611eb58583613345565b90505f848210611ec55784611ec7565b815b90508067ffffffffffffffff811115611ee257611ee261339d565b604051908082528060200260200182016040528015611f0b578160200160208202803683370190505b5093505f5b81811015611f62576013611f2482896132fa565b81548110611f3457611f34613522565b905f5260205f200154858281518110611f4f57611f4f613522565b6020908102919091010152600101611f10565b5050505092915050565b5f546001600160a01b03163314611f96576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b038116611fbd5760405163e6c4247b60e01b815260040160405180910390fd5b600380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f038f89ec725a3bc1b18bf38a625bf2ff0407764bd3489886a60cf1d506c7e3a2905f90a35050565b5f82815260116020526040812054810361203b576040516303d4572d60e51b815260040160405180910390fd5b5f8381526014602052604090206005015460ff168061115e5750505f9182526016602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6002546001600160a01b031633146120ab57604051631bc2178f60e01b815260040160405180910390fd5b600454600160a01b900460ff16156120d65760405163ab35696f60e01b815260040160405180910390fd5b601b546001146120f957604051631762c6f360e01b815260040160405180910390fd5b6002601b555f83815260126020526040902054821061212b57604051635878ae8560e11b815260040160405180910390fd5b5f83815260126020526040812080548490811061214a5761214a613522565b5f9182526020909120600590910201600481015490915060ff1615612182576040516336ab81e160e11b815260040160405180910390fd5b600481018054600183810154600160a01b900460ff90811615158615151461010090810261ffff199094169390931790911792839055910416156122aa5760018101546121e1906001600160a01b0316680ad78ebc5ac6200000612cc7565b680ad78ebc5ac6200000600b5f8282546121fb91906132fa565b90915550506001818101546001600160a01b03165f908152601a60205260408120805490919061222c9084906132fa565b90915550506001818101546001600160a01b03165f908152601960205260408120805490919061225d9084906132fa565b909155505060018101546040805180820190915260098152682a292aaa242faba4a760b91b60208201526122a5916001600160a01b03169068056bc75e2d6310000090612ded565b612396565b5f6122b485612c1a565b90505f6122cb600268056bc75e2d6310000061336f565b60018301549091506122e6906001600160a01b031682612cc7565b604051632770a7eb60e21b8152306004820152602481018290527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690639dc29fac906044015f604051808303815f87803b15801561234b575f5ffd5b505af115801561235d573d5f5f3e3d5ffd5b5050505080600c5f82825461237291906132fa565b90915550505060018201546001600160a01b03165f908152601a6020526040812055505b600181015460048201546001600160a01b039091169085907f8aa1336152b005ddd3ccc39b5a66ed207555053dd23bc9cff1aab405f6348ea590610100900460ff16806123e3575f6123ee565b680ad78ebc5ac62000005b60408051921515835260208301919091520160405180910390a350506001601b555050565b600454600160a01b900460ff161561243e5760405163ab35696f60e01b815260040160405180910390fd5b601b5460011461246157604051631762c6f360e01b815260040160405180910390fd5b6002601b555f818152601160205260408120549003612493576040516303d4572d60e51b815260040160405180910390fd5b5f81815260166020908152604080832033845290915290205460ff16156124cd576040516328486b6360e11b815260040160405180910390fd5b5f6124d782612c1a565b600581015490915060ff161561250057604051632444f8b760e11b815260040160405180910390fd5b60038101545f61250f846110ef565b90508034101561253b57604051633ebbc33760e01b81526004810182905234602482015260440161106f565b5f8481526016602090815260408083203384529091528120805460ff19166001908117909155600485018054919290916125769084906132fa565b90915550612585905082612ea6565b60038401555f84815260176020526040812080548392906125a79084906132fa565b909155505060018301546125c4906001600160a01b031682612ba5565b803411156125df576125df336125da8334613345565b612ba5565b336001600160a01b0316847f2ee8d21874599264c54876b79bf25eae1b396c3771a178e683a9e038b634f1d7846040516126369181526040602082018190526003908201526208aa8960eb1b606082015260800190565b60405180910390a3837f68520cf07e2f785cba8f9601c758232191b84e9f0a8ec7b3049d2dcc197b67fe846003015460405161267491815260200190565b60405180910390a250506001601b555050565b5f546001600160a01b031633146126b1576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b0381166126d85760405163e6c4247b60e01b815260040160405180910390fd5b600480546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f4ab5be82436d353e61ca18726e984e561f5c1cc7c6d38b29d2553c790434705a905f90a35050565b5f546001600160a01b03163314612753576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b03811661277a5760405163e6c4247b60e01b815260040160405180910390fd5b600180546001600160a01b0319166001600160a01b038381169182179092555f8054604051929316917f38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e227009190a350565b600454600160a01b900460ff16156127f55760405163ab35696f60e01b815260040160405180910390fd5b601b5460011461281857604051631762c6f360e01b815260040160405180910390fd5b6002601b555f81815260116020526040812054900361284a576040516303d4572d60e51b815260040160405180910390fd5b5f81815260166020908152604080832033845290915290205460ff1615612884576040516328486b6360e11b815260040160405180910390fd5b5f61288e82612c1a565b600581015490915060ff16156128b757604051632444f8b760e11b815260040160405180910390fd5b60038101545f6128c860028361336f565b90505f6128d58284613345565b90506128e2333085612e71565b604051632770a7eb60e21b8152306004820152602481018390527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690639dc29fac906044015f604051808303815f87803b158015612947575f5ffd5b505af1158015612959573d5f5f3e3d5ffd5b5050505081600c5f82825461296e91906132fa565b9091555050600184015461298b906001600160a01b031682612cc7565b5f8581526016602090815260408083203384529091528120805460ff19166001908117909155600486018054919290916129c69084906132fa565b9250508190555080846006015f8282546129e091906132fa565b909155506129ef905083612ea6565b6003850155604051339086907f2ee8d21874599264c54876b79bf25eae1b396c3771a178e683a9e038b634f1d790612a469087815260406020820181905260049082015263212aa92760e11b606082015260800190565b60405180910390a3847f68520cf07e2f785cba8f9601c758232191b84e9f0a8ec7b3049d2dcc197b67fe8560030154604051612a8491815260200190565b60405180910390a250506001601b55505050565b6005545f90808203612abd57604051630b73274760e11b815260040160405180910390fd5b612aca62015180826132fa565b421115612af657604051634487756760e11b81526004810182905262015180602482015260440161106f565b5f7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015612b53573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190612b779190613536565b612b8290600a613639565b90508060065485612b939190613358565b612b9d919061336f565b949350505050565b5f826001600160a01b0316826040515f6040518083038185875af1925050503d805f8114612bee576040519150601f19603f3d011682016040523d82523d5f602084013e612bf3565b606091505b5050905080612c155760405163022e258160e11b815260040160405180910390fd5b505050565b5f818152601460205260409020600381015415612c3657919050565b5f828152601560205260409020546001600160a01b031680612c6b576040516361f2aa0160e11b815260040160405180910390fd5b828255600180830180546001600160a01b0319166001600160a01b0393909316929092179091555f92835260116020526040909220909101546002820155681b1ae4d6e2ef500000600382015560058101805460ff1916905590565b612cfb6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000168383612f04565b5050565b6001600160a01b038181165f8181526018602052604080822054905163aaac37a160e01b81526004810193909352909290917f00000000000000000000000000000000000000000000000000000000000000009091169063aaac37a190602401602060405180830381865afa158015612d7a573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190612d9e919061350b565b61180b91906132fa565b5f818152601160205260408120600101548190612dcc90662386f26fc10000613358565b9050683635c9adc5dea00000811161180b57683635c9adc5dea0000061115e565b6001600160a01b0383165f9081526018602052604081205490612e1084836132fa565b6001600160a01b0386165f818152601860205260409081902083905551919250907f7b750b6736ccb837fea530571f55e8e43f7eeb7bf7f2aadca5b698bd6be22d7a90612e6290859085908890613647565b60405180910390a25050505050565b612c156001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016848484612f39565b5f68878678326eac9000008210612ec7575068878678326eac900000919050565b5f612edb6802b5e3af16b1880000846132fa565b905068878678326eac9000008111612ef3578061115e565b68878678326eac9000009392505050565b612f118383836001612f75565b612c1557604051635274afe760e01b81526001600160a01b038416600482015260240161106f565b612f47848484846001612fd7565b612f6f57604051635274afe760e01b81526001600160a01b038516600482015260240161106f565b50505050565b60405163a9059cbb60e01b5f8181526001600160a01b038616600452602485905291602083604481808b5af1925060015f51148316612fcb578383151615612fbf573d5f823e3d81fd5b5f873b113d1516831692505b60405250949350505050565b6040516323b872dd60e01b5f8181526001600160a01b038781166004528616602452604485905291602083606481808c5af1925060015f51148316613033578383151615613027573d5f823e3d81fd5b5f883b113d1516831692505b604052505f60605295945050505050565b5f60208284031215613054575f5ffd5b5035919050565b80356001600160a01b0381168114613071575f5ffd5b919050565b5f60208284031215613086575f5ffd5b61115e8261305b565b80358015158114613071575f5ffd5b5f602082840312156130ae575f5ffd5b61115e8261308f565b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b878152866020820152851515604082015284606082015260e060808201525f61311160e08301866130b7565b6001600160a01b039490941660a08301525060c0015295945050505050565b5f5f83601f840112613140575f5ffd5b50813567ffffffffffffffff811115613157575f5ffd5b60208301915083602082850101111561316e575f5ffd5b9250929050565b5f5f5f5f5f5f5f60a0888a03121561318b575f5ffd5b8735965060208801359550604088013567ffffffffffffffff8111156131af575f5ffd5b6131bb8a828b01613130565b909650945050606088013567ffffffffffffffff8111156131da575f5ffd5b6131e68a828b01613130565b90945092506131f990506080890161308f565b905092959891949750929550565b5f5f60408385031215613218575f5ffd5b823591506132286020840161305b565b90509250929050565b5f5f60408385031215613242575f5ffd5b50508035926020909101359150565b5f5f60408385031215613262575f5ffd5b823591506132286020840161308f565b602080825282518282018190525f918401906040840190835b818110156132a957835183526020938401939092019160010161328b565b509095945050505050565b5f5f5f606084860312156132c6575f5ffd5b83359250602084013591506132dd6040850161308f565b90509250925092565b634e487b7160e01b5f52601160045260245ffd5b8082018082111561180b5761180b6132e6565b600181811c9082168061332157607f821691505b60208210810361333f57634e487b7160e01b5f52602260045260245ffd5b50919050565b8181038181111561180b5761180b6132e6565b808202811582820484141761180b5761180b6132e6565b5f8261338957634e487b7160e01b5f52601260045260245ffd5b500490565b818382375f9101908152919050565b634e487b7160e01b5f52604160045260245ffd5b601f821115612c155782821115612c1557805f5260205f20601f840160051c60208510156133dc57505f5b90810190601f840160051c035f5b818110156133ff575f838201556001016133ea565b505050505050565b815167ffffffffffffffff8111156134215761342161339d565b6134358161342f845461330d565b846133b1565b6020601f821160018114613467575f83156134505750848201515b5f19600385901b1c1916600184901b1784556134bf565b5f84815260208120601f198516915b828110156134965787850151825560209485019460019092019101613476565b50848210156134b357868401515f19600387901b60f8161c191681555b505060018360011b0184555b5050505050565b858152841515602082015283604082015260806060820152816080820152818360a08301375f81830160a090810191909152601f909201601f19160101949350505050565b5f6020828403121561351b575f5ffd5b5051919050565b634e487b7160e01b5f52603260045260245ffd5b5f60208284031215613546575f5ffd5b815160ff8116811461115e575f5ffd5b6001815b600184111561359157808504811115613575576135756132e6565b600184161561358357908102905b60019390931c92800261355a565b935093915050565b5f826135a75750600161180b565b816135b357505f61180b565b81600181146135c957600281146135d3576135ef565b600191505061180b565b60ff8411156135e4576135e46132e6565b50506001821b61180b565b5060208310610133831016604e8410600b8410161715613612575081810a61180b565b61361e5f198484613556565b805f1904821115613631576136316132e6565b029392505050565b5f61115e60ff841683613599565b838152826020820152606060408201525f61366560608301846130b7565b9594505050505056fea264697066735822122021bdc9f11db9cf325cfbf5d7027a8d5d896c536894794c2c3a3cde9a9f86726964736f6c63430008220033" as const;

export const ghostProtocolDeployedBytecode = "0x6080604052600436106103b6575f3560e01c80638c1a60b2116101e9578063c89e74fb11610108578063e1a452181161009d578063f0f442601161006d578063f0f4426014610cdd578063f2fde38b14610cfc578063f4dceacd14610d1b578063f99156cb14610d3a575f5ffd5b8063e1a4521814610c78578063e30c397814610c8d578063e319c8d114610cac578063e332305d14610cc1575f5ffd5b8063d365d094116100d8578063d365d09414610c09578063d4ade87514610c34578063d73848cc14610c47578063dbd8c05714610c63575f5ffd5b8063c89e74fb14610b8a578063c9ab713014610bb5578063cb3399e814610bd4578063d0f6581b14610bf3575f5ffd5b8063a6d2fcd91161017e578063b87c11141161014e578063b87c111414610b25578063b9fa45da14610b3a578063bf813d8214610b4f578063c69ab50114610b6e575f5ffd5b8063a6d2fcd914610ab6578063af414d4114610ae1578063b3dfbcf814610afb578063b690d8a114610b10575f5ffd5b8063938a8bca116101b9578063938a8bca146109be5780639e33bb86146109d3578063a4fa95bf14610a75578063a60051ae14610aa1575f5ffd5b80638c1a60b2146109525780638c37f11d1461096e5780638da5cb5b14610983578063924d3f56146109a1575f5ffd5b806353093093116102d55780636a65eaa61161026a57806379ba50971161023a57806379ba5097146108e15780637adbf973146108f55780637dc0d1d0146109145780638748c6b914610933575f5ffd5b80636a65eaa6146107df5780636bccc753146107f4578063771aceef1461082757806378f88d67146108c5575f5ffd5b806365137dd0116102a557806365137dd0146106ef57806367310b5a1461075357806368f5c6631461078c5780636a01a775146107ab575f5ffd5b806353093093146106625780635bdf5621146106915780635c975abb146106b057806361d027b3146106d0575f5ffd5b80631a868c401161034b5780632ce13a031161031b5780632ce13a03146105ec57806338902fdb146106085780634a7221a01461061d5780635191e4671461064f575f5ffd5b80631a868c401461057a578063210269501461059957806329ff0d93146105b85780632cad2f65146105cd575f5ffd5b806313b781ab1161038657806313b781ab146104b55780631433219c146104d657806316c38b3c1461050157806319b881e414610520575f5ffd5b8063056962c3146103f657806308104069146104355780630efd66e214610453578063139ab0e71461047e575f5ffd5b366103f25760405134815233907f719feb717c187001672aa98b85a51988a7fab410c32ed1d724838c8377bf90af9060200160405180910390a2005b5f5ffd5b348015610401575f5ffd5b50610415610410366004613044565b610d4f565b604080519384526020840192909252908201526060015b60405180910390f35b348015610440575f5ffd5b506013545b60405190815260200161042c565b34801561045e575f5ffd5b5061044561046d366004613076565b601a6020525f908152604090205481565b348015610489575f5ffd5b5060035461049d906001600160a01b031681565b6040516001600160a01b03909116815260200161042c565b3480156104c0575f5ffd5b506104d46104cf366004613044565b610dde565b005b3480156104e1575f5ffd5b506104456104f0366004613044565b60176020525f908152604090205481565b34801561050c575f5ffd5b506104d461051b36600461309e565b610e7b565b34801561052b575f5ffd5b5061053f61053a366004613044565b610efd565b6040805196875260208701959095529215159385019390935260608401526001600160a01b03909116608083015260a082015260c00161042c565b348015610585575f5ffd5b506104d4610594366004613044565b610ff5565b3480156105a4575f5ffd5b506104456105b3366004613044565b6110ef565b3480156105c3575f5ffd5b5061044560065481565b3480156105d8575f5ffd5b506104d46105e7366004613044565b611165565b3480156105f7575f5ffd5b5061044568878678326eac90000081565b348015610613575f5ffd5b50610445600b5481565b348015610628575f5ffd5b5061063c610637366004613044565b61125c565b60405161042c97969594939291906130e5565b6104d461065d366004613175565b611354565b34801561066d575f5ffd5b5061068161067c366004613207565b6117e5565b604051901515815260200161042c565b34801561069c575f5ffd5b506104156106ab366004613076565b611811565b3480156106bb575f5ffd5b5060045461068190600160a01b900460ff1681565b3480156106db575f5ffd5b5060045461049d906001600160a01b031681565b3480156106fa575f5ffd5b5061070e610709366004613231565b6118d0565b604080519788526001600160a01b039096166020880152931515948601949094526060850191909152608084015290151560a0830152151560c082015260e00161042c565b34801561075e575f5ffd5b5061068161076d366004613207565b601660209081525f928352604080842090915290825290205460ff1681565b348015610797575f5ffd5b506104d46107a6366004613044565b611985565b3480156107b6575f5ffd5b5061049d6107c5366004613044565b60156020525f90815260409020546001600160a01b031681565b3480156107ea575f5ffd5b5061044560085481565b3480156107ff575f5ffd5b5061049d7f000000000000000000000000000000000000000000000000000000000000000081565b348015610832575f5ffd5b50600754600854600954600a8054600b54600c54600d54600e54600f54601054600454604080518d8152602081019c909c528b019990995260608a0196909652608089019490945260a088019290925260c087015260e08601526101008501526101208401524761014084015290921015610160820152600160a01b90910460ff1615156101808201526101a00161042c565b3480156108d0575f5ffd5b50610445681b1ae4d6e2ef50000081565b3480156108ec575f5ffd5b506104d4611ba8565b348015610900575f5ffd5b506104d461090f366004613076565b611c29565b34801561091f575f5ffd5b5060025461049d906001600160a01b031681565b34801561093e575f5ffd5b506104d461094d366004613251565b611ccb565b34801561095d575f5ffd5b50610445680ad78ebc5ac620000081565b348015610979575f5ffd5b50610445600f5481565b34801561098e575f5ffd5b505f5461049d906001600160a01b031681565b3480156109ac575f5ffd5b5061044569010f0cf064dd5920000081565b3480156109c9575f5ffd5b50610445600e5481565b3480156109de575f5ffd5b50610a366109ed366004613044565b60146020525f9081526040902080546001820154600283015460038401546004850154600586015460069096015494956001600160a01b039094169492939192909160ff169087565b604080519788526001600160a01b0390961660208801529486019390935260608501919091526080840152151560a083015260c082015260e00161042c565b348015610a80575f5ffd5b50610a94610a8f366004613231565b611e7d565b60405161042c9190613272565b348015610aac575f5ffd5b50610445610bb881565b348015610ac1575f5ffd5b50610445610ad0366004613076565b60196020525f908152604090205481565b348015610aec575f5ffd5b506104456621c0331d5dc00081565b348015610b06575f5ffd5b5061044560095481565b348015610b1b575f5ffd5b5061044560055481565b348015610b30575f5ffd5b5061044560075481565b348015610b45575f5ffd5b50610445600a5481565b348015610b5a575f5ffd5b506104d4610b69366004613076565b611f6c565b348015610b79575f5ffd5b50610445683635c9adc5dea0000081565b348015610b95575f5ffd5b50610445610ba4366004613076565b60186020525f908152604090205481565b348015610bc0575f5ffd5b50610681610bcf366004613207565b61200e565b348015610bdf575f5ffd5b506104d4610bee3660046132b4565b612080565b348015610bfe575f5ffd5b506104456201518081565b348015610c14575f5ffd5b50610445610c23366004613044565b5f9081526012602052604090205490565b6104d4610c42366004613044565b612413565b348015610c52575f5ffd5b5061044568056bc75e2d6310000081565b348015610c6e575f5ffd5b50610445600d5481565b348015610c83575f5ffd5b5061044561271081565b348015610c98575f5ffd5b5060015461049d906001600160a01b031681565b348015610cb7575f5ffd5b5061044560105481565b348015610ccc575f5ffd5b506104456802b5e3af16b188000081565b348015610ce8575f5ffd5b506104d4610cf7366004613076565b612687565b348015610d07575f5ffd5b506104d4610d16366004613076565b612729565b348015610d26575f5ffd5b506104d4610d35366004613044565b6127ca565b348015610d45575f5ffd5b50610445600c5481565b5f81815260116020526040812054819081908103610d80576040516303d4572d60e51b815260040160405180910390fd5b5f848152601460205260408120600381015490919015610da4578160030154610daf565b681b1ae4d6e2ef5000005b60068301545f8881526017602052604090205491925090610dcf83612a98565b94509450945050509193909250565b6003546001600160a01b03163314610e0957604051631dc610a960e21b815260040160405180910390fd5b805f03610e2957604051637f1402d560e11b815260040160405180910390fd5b6006805490829055426005819055604080518381526020810185905280820192909252517fd9c9c767abc8174b594a5a15dd708b5629ab3a49044a597f8f3c8510dec766899181900360600190a15050565b5f546001600160a01b03163314610ea5576040516330cd747160e01b815260040160405180910390fd5b60048054821515600160a01b0260ff60a01b199091161790556040517fb31006682779d0ac02864bee834675baf4592a679bfe75edd5e5847b52ef6f6e90610ef290831515815260200190565b60405180910390a150565b5f81815260116020526040812054819081908190819081908103610f34576040516303d4572d60e51b815260040160405180910390fd5b5f87815260146020526040812060018101549091906001600160a01b0316610f72575f898152601560205260409020546001600160a01b0316610f81565b60018201546001600160a01b03165b90505f82600201545f03610fa5575f8a815260116020526040902060010154610fab565b82600201545b905082600301545f14610fc2578260030154610fcd565b681b1ae4d6e2ef5000005b60048401546005850154600690950154919c909b5060ff909416995097509095509350915050565b5f546001600160a01b0316331461101f576040516330cd747160e01b815260040160405180910390fd5b601b5460011461104257604051631762c6f360e01b815260040160405180910390fd5b6002601b5547808211156110785760405163f8db689560e01b815260048101829052602481018390526044015b60405180910390fd5b8160105f82825461108991906132fa565b90915550506004546110a4906001600160a01b031683612ba5565b6004546040518381526001600160a01b03909116907ff7595c4fd7fa675e456dd9520ac8266c06d237d52900fc573bccc85b7c177c9e9060200160405180910390a250506001601b55565b5f81815260116020526040812054810361111c576040516303d4572d60e51b815260040160405180910390fd5b5f8281526014602052604081206003015415611148575f83815260146020526040902060030154611153565b681b1ae4d6e2ef5000005b905061115e81612a98565b9392505050565b600454600160a01b900460ff16156111905760405163ab35696f60e01b815260040160405180910390fd5b5f8181526011602052604081205490036111bd576040516303d4572d60e51b815260040160405180910390fd5b5f6111c782612c1a565b60018101549091506001600160a01b031633146111f757604051632731809760e11b815260040160405180910390fd5b600581015460ff161561121d57604051635d51ae1160e11b815260040160405180910390fd5b60058101805460ff19166001179055604051339083907f4fc8ba7f4f3c695895c779eb7fde668149b9eed94bfc8e5dda5899c40eca973b905f90a35050565b5f8181526011602052604081208054600182015460028301546003840154600585015460068601546004870180548998899889986060988a98899894979396929560ff9092169490936001600160a01b039091169183906112bc9061330d565b80601f01602080910402602001604051908101604052809291908181526020018280546112e89061330d565b80156113335780601f1061130a57610100808354040283529160200191611333565b820191905f5260205f20905b81548152906001019060200180831161131657829003601f168201915b50505050509250975097509750975097509750975050919395979092949650565b600454600160a01b900460ff161561137f5760405163ab35696f60e01b815260040160405180910390fd5b601b546001146113a257604051631762c6f360e01b815260040160405180910390fd5b6002601b55866113c55760405163b780d61f60e01b815260040160405180910390fd5b8515806113d25750606486115b156113f057604051630f7fcb2960e21b815260040160405180910390fd5b5f878152601160205260409020541561141c57604051635665e77960e11b815260040160405180910390fd5b6621c0331d5dc00034101561145357604051633ebbc33760e01b81526621c0331d5dc000600482015234602482015260440161106f565b5f6114656621c0331d5dc00034613345565b90505f61271061147e610bb86621c0331d5dc000613358565b611488919061336f565b90505f61149c826621c0331d5dc000613345565b90505f5f90506621c0331d5dc000600d5f8282546114ba91906132fa565b9250508190555082600e5f8282546114d291906132fa565b9250508190555081600f5f8282546114ea91906132fa565b92505081905550600160075f82825461150391906132fa565b909155508590506115a357600160085f82825461152091906132fa565b925050819055506001600a5f82825461153991906132fa565b9091555061154a90508a6032613358565b61155c90670de0b6b3a7640000613358565b905069010f0cf064dd5920000081111561157d575069010f0cf064dd592000005b80600b5f82825461158e91906132fa565b9091555061159e90503382612cc7565b6115bb565b600160095f8282546115b591906132fa565b90915550505b6040518060e001604052804281526020018b815260200186151581526020018a8a6040516115ea92919061338e565b6040518091039020815260200188888080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92018290525093855250503360208085019190915260409384018690528f8352601181529183902084518155918401516001830155509082015160028201805460ff1916911515919091179055606082015160038201556080820151600482019061168d9082613407565b5060a08201516005820180546001600160a01b039092166001600160a01b031992831617905560c0909201516006909101555f8c8152601560205260408120805490921633179091556013805460018101825591527f66de8ffda797e3de9c05e8fc57b3bf0ec28a930d40b0d285d93c06501cf6a090018b90556117108b612c1a565b50821561172d5760045461172d906001600160a01b031684612ba5565b831561173d5761173d3385612ba5565b336001600160a01b03168b7f356e37b4b3a3dbbf61e05450c7d74955350550a659bd8792d406b6c27133a0e18c88858c8c60405161177f9594939291906134c6565b60405180910390a3604080516621c0331d5dc0008152602081018590529081018390528b9033907fd381803faab74092aedc8de24231e595cfd3af1a0997ead17e7bcd54d9777c109060600160405180910390a350506001601b55505050505050505050565b5f8281526016602090815260408083206001600160a01b038516845290915290205460ff165b92915050565b60405163aaac37a160e01b81526001600160a01b0382811660048301525f91829182917f00000000000000000000000000000000000000000000000000000000000000009091169063aaac37a190602401602060405180830381865afa15801561187d573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906118a1919061350b565b6001600160a01b0385165f9081526018602052604090205490935091506118c882846132fa565b929491935050565b5f82815260126020526040812054819081908190819081908190881061190957604051635878ae8560e11b815260040160405180910390fd5b5f89815260126020526040812080548a90811061192857611928613522565b5f91825260209091206005909102018054600182015460028301546003840154600490940154929e6001600160a01b0383169e5060ff600160a01b90930483169d50909b5092995080821698506101009091041695509350505050565b600454600160a01b900460ff16156119b05760405163ab35696f60e01b815260040160405180910390fd5b5f8181526011602052604081205490036119dd576040516303d4572d60e51b815260040160405180910390fd5b5f81815260166020908152604080832033845290915290205460ff1615611a17576040516328486b6360e11b815260040160405180910390fd5b5f611a2182612c1a565b600581015490915060ff1615611a4a57604051632444f8b760e11b815260040160405180910390fd5b5f611a5433612cff565b90505f611a6084612da8565b905080821015611a8d576040516320200bc560e01b8152600481018390526024810182905260440161106f565b683635c9adc5dea00000821015611ac9576040516320200bc560e01b815260048101839052683635c9adc5dea00000602482015260440161106f565b5f8481526016602090815260408083203384529091528120805460ff191660011790556064611af9836005613358565b611b03919061336f565b9050611b3a338260405180604001604052806012815260200171435245444942494c4954595f554e4c4f434b60701b815250612ded565b336001600160a01b0316857f2ee8d21874599264c54876b79bf25eae1b396c3771a178e683a9e038b634f1d75f604051611b99918152604060208201819052600b908201526a435245444942494c49545960a81b606082015260800190565b60405180910390a35050505050565b6001546001600160a01b03163314611bd357604051630614e5c760e21b815260040160405180910390fd5b5f8054336001600160a01b0319808316821784556001805490911690556040516001600160a01b0390921692909183917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a350565b5f546001600160a01b03163314611c53576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b038116611c7a5760405163e6c4247b60e01b815260040160405180910390fd5b600280546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f078c3b417dadf69374a59793b829c52001247130433427049317bde56607b1b7905f90a35050565b600454600160a01b900460ff1615611cf65760405163ab35696f60e01b815260040160405180910390fd5b601b54600114611d1957604051631762c6f360e01b815260040160405180910390fd5b6002601b555f828152601160205260408120549003611d4b576040516303d4572d60e51b815260040160405180910390fd5b611d5f333068056bc75e2d63100000612e71565b5f828152601260209081526040808320815160e0810183528681523381850181815287151583860181815268056bc75e2d6310000060608601818152426080880190815260a088018c815260c089018d81528a5460018082018d559b8f529d8d902099516005909e029099019c8d559551988c01805494511515600160a01b026001600160a81b03199095166001600160a01b03909a169990991793909317909755955160028a0155516003890155905160049097018054935115156101000261ff00199815159890981661ffff199094169390931796909617909155825194855292840152909184917fa04181c550a5111ebee021519f1381f122b78eb4e9b9194a64cd6c9de7737351910160405180910390a350506001601b55565b6013546060908084101580611e90575082155b15611eaa575050604080515f81526020810190915261180b565b5f611eb58583613345565b90505f848210611ec55784611ec7565b815b90508067ffffffffffffffff811115611ee257611ee261339d565b604051908082528060200260200182016040528015611f0b578160200160208202803683370190505b5093505f5b81811015611f62576013611f2482896132fa565b81548110611f3457611f34613522565b905f5260205f200154858281518110611f4f57611f4f613522565b6020908102919091010152600101611f10565b5050505092915050565b5f546001600160a01b03163314611f96576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b038116611fbd5760405163e6c4247b60e01b815260040160405180910390fd5b600380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f038f89ec725a3bc1b18bf38a625bf2ff0407764bd3489886a60cf1d506c7e3a2905f90a35050565b5f82815260116020526040812054810361203b576040516303d4572d60e51b815260040160405180910390fd5b5f8381526014602052604090206005015460ff168061115e5750505f9182526016602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6002546001600160a01b031633146120ab57604051631bc2178f60e01b815260040160405180910390fd5b600454600160a01b900460ff16156120d65760405163ab35696f60e01b815260040160405180910390fd5b601b546001146120f957604051631762c6f360e01b815260040160405180910390fd5b6002601b555f83815260126020526040902054821061212b57604051635878ae8560e11b815260040160405180910390fd5b5f83815260126020526040812080548490811061214a5761214a613522565b5f9182526020909120600590910201600481015490915060ff1615612182576040516336ab81e160e11b815260040160405180910390fd5b600481018054600183810154600160a01b900460ff90811615158615151461010090810261ffff199094169390931790911792839055910416156122aa5760018101546121e1906001600160a01b0316680ad78ebc5ac6200000612cc7565b680ad78ebc5ac6200000600b5f8282546121fb91906132fa565b90915550506001818101546001600160a01b03165f908152601a60205260408120805490919061222c9084906132fa565b90915550506001818101546001600160a01b03165f908152601960205260408120805490919061225d9084906132fa565b909155505060018101546040805180820190915260098152682a292aaa242faba4a760b91b60208201526122a5916001600160a01b03169068056bc75e2d6310000090612ded565b612396565b5f6122b485612c1a565b90505f6122cb600268056bc75e2d6310000061336f565b60018301549091506122e6906001600160a01b031682612cc7565b604051632770a7eb60e21b8152306004820152602481018290527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690639dc29fac906044015f604051808303815f87803b15801561234b575f5ffd5b505af115801561235d573d5f5f3e3d5ffd5b5050505080600c5f82825461237291906132fa565b90915550505060018201546001600160a01b03165f908152601a6020526040812055505b600181015460048201546001600160a01b039091169085907f8aa1336152b005ddd3ccc39b5a66ed207555053dd23bc9cff1aab405f6348ea590610100900460ff16806123e3575f6123ee565b680ad78ebc5ac62000005b60408051921515835260208301919091520160405180910390a350506001601b555050565b600454600160a01b900460ff161561243e5760405163ab35696f60e01b815260040160405180910390fd5b601b5460011461246157604051631762c6f360e01b815260040160405180910390fd5b6002601b555f818152601160205260408120549003612493576040516303d4572d60e51b815260040160405180910390fd5b5f81815260166020908152604080832033845290915290205460ff16156124cd576040516328486b6360e11b815260040160405180910390fd5b5f6124d782612c1a565b600581015490915060ff161561250057604051632444f8b760e11b815260040160405180910390fd5b60038101545f61250f846110ef565b90508034101561253b57604051633ebbc33760e01b81526004810182905234602482015260440161106f565b5f8481526016602090815260408083203384529091528120805460ff19166001908117909155600485018054919290916125769084906132fa565b90915550612585905082612ea6565b60038401555f84815260176020526040812080548392906125a79084906132fa565b909155505060018301546125c4906001600160a01b031682612ba5565b803411156125df576125df336125da8334613345565b612ba5565b336001600160a01b0316847f2ee8d21874599264c54876b79bf25eae1b396c3771a178e683a9e038b634f1d7846040516126369181526040602082018190526003908201526208aa8960eb1b606082015260800190565b60405180910390a3837f68520cf07e2f785cba8f9601c758232191b84e9f0a8ec7b3049d2dcc197b67fe846003015460405161267491815260200190565b60405180910390a250506001601b555050565b5f546001600160a01b031633146126b1576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b0381166126d85760405163e6c4247b60e01b815260040160405180910390fd5b600480546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f4ab5be82436d353e61ca18726e984e561f5c1cc7c6d38b29d2553c790434705a905f90a35050565b5f546001600160a01b03163314612753576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b03811661277a5760405163e6c4247b60e01b815260040160405180910390fd5b600180546001600160a01b0319166001600160a01b038381169182179092555f8054604051929316917f38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e227009190a350565b600454600160a01b900460ff16156127f55760405163ab35696f60e01b815260040160405180910390fd5b601b5460011461281857604051631762c6f360e01b815260040160405180910390fd5b6002601b555f81815260116020526040812054900361284a576040516303d4572d60e51b815260040160405180910390fd5b5f81815260166020908152604080832033845290915290205460ff1615612884576040516328486b6360e11b815260040160405180910390fd5b5f61288e82612c1a565b600581015490915060ff16156128b757604051632444f8b760e11b815260040160405180910390fd5b60038101545f6128c860028361336f565b90505f6128d58284613345565b90506128e2333085612e71565b604051632770a7eb60e21b8152306004820152602481018390527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690639dc29fac906044015f604051808303815f87803b158015612947575f5ffd5b505af1158015612959573d5f5f3e3d5ffd5b5050505081600c5f82825461296e91906132fa565b9091555050600184015461298b906001600160a01b031682612cc7565b5f8581526016602090815260408083203384529091528120805460ff19166001908117909155600486018054919290916129c69084906132fa565b9250508190555080846006015f8282546129e091906132fa565b909155506129ef905083612ea6565b6003850155604051339086907f2ee8d21874599264c54876b79bf25eae1b396c3771a178e683a9e038b634f1d790612a469087815260406020820181905260049082015263212aa92760e11b606082015260800190565b60405180910390a3847f68520cf07e2f785cba8f9601c758232191b84e9f0a8ec7b3049d2dcc197b67fe8560030154604051612a8491815260200190565b60405180910390a250506001601b55505050565b6005545f90808203612abd57604051630b73274760e11b815260040160405180910390fd5b612aca62015180826132fa565b421115612af657604051634487756760e11b81526004810182905262015180602482015260440161106f565b5f7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015612b53573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190612b779190613536565b612b8290600a613639565b90508060065485612b939190613358565b612b9d919061336f565b949350505050565b5f826001600160a01b0316826040515f6040518083038185875af1925050503d805f8114612bee576040519150601f19603f3d011682016040523d82523d5f602084013e612bf3565b606091505b5050905080612c155760405163022e258160e11b815260040160405180910390fd5b505050565b5f818152601460205260409020600381015415612c3657919050565b5f828152601560205260409020546001600160a01b031680612c6b576040516361f2aa0160e11b815260040160405180910390fd5b828255600180830180546001600160a01b0319166001600160a01b0393909316929092179091555f92835260116020526040909220909101546002820155681b1ae4d6e2ef500000600382015560058101805460ff1916905590565b612cfb6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000168383612f04565b5050565b6001600160a01b038181165f8181526018602052604080822054905163aaac37a160e01b81526004810193909352909290917f00000000000000000000000000000000000000000000000000000000000000009091169063aaac37a190602401602060405180830381865afa158015612d7a573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190612d9e919061350b565b61180b91906132fa565b5f818152601160205260408120600101548190612dcc90662386f26fc10000613358565b9050683635c9adc5dea00000811161180b57683635c9adc5dea0000061115e565b6001600160a01b0383165f9081526018602052604081205490612e1084836132fa565b6001600160a01b0386165f818152601860205260409081902083905551919250907f7b750b6736ccb837fea530571f55e8e43f7eeb7bf7f2aadca5b698bd6be22d7a90612e6290859085908890613647565b60405180910390a25050505050565b612c156001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016848484612f39565b5f68878678326eac9000008210612ec7575068878678326eac900000919050565b5f612edb6802b5e3af16b1880000846132fa565b905068878678326eac9000008111612ef3578061115e565b68878678326eac9000009392505050565b612f118383836001612f75565b612c1557604051635274afe760e01b81526001600160a01b038416600482015260240161106f565b612f47848484846001612fd7565b612f6f57604051635274afe760e01b81526001600160a01b038516600482015260240161106f565b50505050565b60405163a9059cbb60e01b5f8181526001600160a01b038616600452602485905291602083604481808b5af1925060015f51148316612fcb578383151615612fbf573d5f823e3d81fd5b5f873b113d1516831692505b60405250949350505050565b6040516323b872dd60e01b5f8181526001600160a01b038781166004528616602452604485905291602083606481808c5af1925060015f51148316613033578383151615613027573d5f823e3d81fd5b5f883b113d1516831692505b604052505f60605295945050505050565b5f60208284031215613054575f5ffd5b5035919050565b80356001600160a01b0381168114613071575f5ffd5b919050565b5f60208284031215613086575f5ffd5b61115e8261305b565b80358015158114613071575f5ffd5b5f602082840312156130ae575f5ffd5b61115e8261308f565b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b878152866020820152851515604082015284606082015260e060808201525f61311160e08301866130b7565b6001600160a01b039490941660a08301525060c0015295945050505050565b5f5f83601f840112613140575f5ffd5b50813567ffffffffffffffff811115613157575f5ffd5b60208301915083602082850101111561316e575f5ffd5b9250929050565b5f5f5f5f5f5f5f60a0888a03121561318b575f5ffd5b8735965060208801359550604088013567ffffffffffffffff8111156131af575f5ffd5b6131bb8a828b01613130565b909650945050606088013567ffffffffffffffff8111156131da575f5ffd5b6131e68a828b01613130565b90945092506131f990506080890161308f565b905092959891949750929550565b5f5f60408385031215613218575f5ffd5b823591506132286020840161305b565b90509250929050565b5f5f60408385031215613242575f5ffd5b50508035926020909101359150565b5f5f60408385031215613262575f5ffd5b823591506132286020840161308f565b602080825282518282018190525f918401906040840190835b818110156132a957835183526020938401939092019160010161328b565b509095945050505050565b5f5f5f606084860312156132c6575f5ffd5b83359250602084013591506132dd6040850161308f565b90509250925092565b634e487b7160e01b5f52601160045260245ffd5b8082018082111561180b5761180b6132e6565b600181811c9082168061332157607f821691505b60208210810361333f57634e487b7160e01b5f52602260045260245ffd5b50919050565b8181038181111561180b5761180b6132e6565b808202811582820484141761180b5761180b6132e6565b5f8261338957634e487b7160e01b5f52601260045260245ffd5b500490565b818382375f9101908152919050565b634e487b7160e01b5f52604160045260245ffd5b601f821115612c155782821115612c1557805f5260205f20601f840160051c60208510156133dc57505f5b90810190601f840160051c035f5b818110156133ff575f838201556001016133ea565b505050505050565b815167ffffffffffffffff8111156134215761342161339d565b6134358161342f845461330d565b846133b1565b6020601f821160018114613467575f83156134505750848201515b5f19600385901b1c1916600184901b1784556134bf565b5f84815260208120601f198516915b828110156134965787850151825560209485019460019092019101613476565b50848210156134b357868401515f19600387901b60f8161c191681555b505060018360011b0184555b5050505050565b858152841515602082015283604082015260806060820152816080820152818360a08301375f81830160a090810191909152601f909201601f19160101949350505050565b5f6020828403121561351b575f5ffd5b5051919050565b634e487b7160e01b5f52603260045260245ffd5b5f60208284031215613546575f5ffd5b815160ff8116811461115e575f5ffd5b6001815b600184111561359157808504811115613575576135756132e6565b600184161561358357908102905b60019390931c92800261355a565b935093915050565b5f826135a75750600161180b565b816135b357505f61180b565b81600181146135c957600281146135d3576135ef565b600191505061180b565b60ff8411156135e4576135e46132e6565b50506001821b61180b565b5060208310610133831016604e8410600b8410161715613612575081810a61180b565b61361e5f198484613556565b805f1904821115613631576136316132e6565b029392505050565b5f61115e60ff841683613599565b838152826020820152606060408201525f61366560608301846130b7565b9594505050505056fea264697066735822122021bdc9f11db9cf325cfbf5d7027a8d5d896c536894794c2c3a3cde9a9f86726964736f6c63430008220033" as const;

export const ghostProtocolArtifact = {
  contractName: ghostProtocolContractName,
  abi: ghostProtocolAbi,
  bytecode: ghostProtocolBytecode,
  deployedBytecode: ghostProtocolDeployedBytecode,
} as const;
