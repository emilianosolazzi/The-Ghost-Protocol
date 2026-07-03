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
    "name": "EthTransferFailed",
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "providedLength",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxLength",
        "type": "uint256"
      }
    ],
    "name": "InvalidContentCidLength",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "providedLength",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxLength",
        "type": "uint256"
      }
    ],
    "name": "InvalidDramaTypeLength",
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
    "name": "ReentrancyGuardReentrantCall",
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
        "name": "unlocker",
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
        "internalType": "string",
        "name": "method",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "cost",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "unlockNumber",
        "type": "uint256"
      }
    ],
    "name": "ExposureReceipt",
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
        "name": "assertor",
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
        "name": "stakeLost",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "burnedAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "submitterCompensation",
        "type": "uint256"
      }
    ],
    "name": "HumiliationReceipt",
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
    "name": "ProtocolTokensWithdrawn",
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
        "internalType": "address",
        "name": "staker",
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
        "internalType": "bool",
        "name": "believesReal",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "stakeAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "globalAssertionNumber",
        "type": "uint256"
      }
    ],
    "name": "TruthStakeReceipt",
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
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "assertor",
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
        "name": "reward",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "currentStreak",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalWins",
        "type": "uint256"
      }
    ],
    "name": "VindicationReceipt",
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
        "name": "totalEarned",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timesUnlocked",
        "type": "uint256"
      }
    ],
    "name": "WhistleblowerReceipt",
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
    "name": "MAX_CONTENT_CID_LENGTH",
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
    "name": "MAX_DRAMA_TYPE_LENGTH",
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
    "name": "SEVERITY_CREDIBILITY_MULTIPLIER",
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
        "internalType": "string",
        "name": "contentCid",
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
        "internalType": "string",
        "name": "contentCid",
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdrawProtocolTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
] as const;

export const ghostProtocolBytecode = "0x60a060405234801561000f575f5ffd5b50604051613dd1380380613dd183398101604081905261002e9161010d565b60017f9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00556001600160a01b038316158061006f57506001600160a01b038216155b8061008157506001600160a01b038116155b1561009f5760405163e6c4247b60e01b815260040160405180910390fd5b6001600160a01b039283166080525f8054336001600160a01b031991821617909155600480548216938516939093179092556002805483169190931690811790925560038054909116909117905561014d565b80516001600160a01b0381168114610108575f5ffd5b919050565b5f5f5f6060848603121561011f575f5ffd5b610128846100f2565b9250610136602085016100f2565b9150610144604085016100f2565b90509250925092565b608051613c3b6101965f395f8181610852015281816115b3015281816125fc01528181612c5901528181612e8c01528181612fd0015281816130d801526132260152613c3b5ff3fe6080604052600436106103e2575f3560e01c80638c37f11d116101ff578063c89e74fb11610113578063e1a45218116100a8578063e535a61411610078578063e535a61414610d51578063f0f4426014610d6d578063f2fde38b14610d8c578063f4dceacd14610dab578063f99156cb14610dca575f5ffd5b8063e1a4521814610cec578063e30c397814610d01578063e319c8d114610d20578063e332305d14610d35575f5ffd5b8063d365d094116100e3578063d365d09414610c7d578063d4ade87514610ca8578063d73848cc14610cbb578063dbd8c05714610cd7575f5ffd5b8063c89e74fb14610bfe578063c9ab713014610c29578063cb3399e814610c48578063d0f6581b14610c67575f5ffd5b8063a6d2fcd911610194578063b87c111411610164578063b87c111414610b85578063b9fa45da14610b9a578063bf813d8214610baf578063c69ab50114610bce578063c6a27efd14610bea575f5ffd5b8063a6d2fcd914610b16578063af414d4114610b41578063b3dfbcf814610b5b578063b690d8a114610b70575f5ffd5b806398933e3a116101cf57806398933e3a14610a205780639e33bb8614610a33578063a4fa95bf14610ad5578063a60051ae14610b01575f5ffd5b80638c37f11d146109bb5780638da5cb5b146109d0578063924d3f56146109ee578063938a8bca14610a0b575f5ffd5b806353093093116102f65780636a65eaa61161028b57806379ba50971161025b57806379ba50971461092e5780637adbf973146109425780637dc0d1d0146109615780638748c6b9146109805780638c1a60b21461099f575f5ffd5b80636a65eaa61461082c5780636bccc75314610841578063771aceef1461087457806378f88d6714610912575f5ffd5b806365137dd0116102c657806365137dd01461073c57806367310b5a146107a057806368f5c663146107d95780636a01a775146107f8575f5ffd5b806353093093146106af5780635bdf5621146106de5780635c975abb146106fd57806361d027b31461071d575f5ffd5b80631a868c40116103775780632cad2f65116103475780632cad2f65146106185780632ce13a031461063757806338902fdb1461065357806340df08dc146106685780634a7221a01461067c575f5ffd5b80631a868c40146105a657806321026950146105c55780632666185a146105e457806329ff0d9314610603575f5ffd5b806313b781ab116103b257806313b781ab146104e15780631433219c1461050257806316c38b3c1461052d57806319b881e41461054c575f5ffd5b8063056962c31461042257806308104069146104615780630efd66e21461047f578063139ab0e7146104aa575f5ffd5b3661041e5760405134815233907f719feb717c187001672aa98b85a51988a7fab410c32ed1d724838c8377bf90af9060200160405180910390a2005b5f5ffd5b34801561042d575f5ffd5b5061044161043c36600461347f565b610ddf565b604080519384526020840192909252908201526060015b60405180910390f35b34801561046c575f5ffd5b506013545b604051908152602001610458565b34801561048a575f5ffd5b506104716104993660046134b1565b601a6020525f908152604090205481565b3480156104b5575f5ffd5b506003546104c9906001600160a01b031681565b6040516001600160a01b039091168152602001610458565b3480156104ec575f5ffd5b506105006104fb36600461347f565b610e6e565b005b34801561050d575f5ffd5b5061047161051c36600461347f565b60176020525f908152604090205481565b348015610538575f5ffd5b506105006105473660046134d9565b610f0b565b348015610557575f5ffd5b5061056b61056636600461347f565b610f8d565b6040805196875260208701959095529215159385019390935260608401526001600160a01b03909116608083015260a082015260c001610458565b3480156105b1575f5ffd5b506105006105c036600461347f565b611085565b3480156105d0575f5ffd5b506104716105df36600461347f565b611170565b3480156105ef575f5ffd5b506105006105fe36600461347f565b6111e6565b34801561060e575f5ffd5b5061047160065481565b348015610623575f5ffd5b5061050061063236600461347f565b611286565b348015610642575f5ffd5b5061047168878678326eac90000081565b34801561065e575f5ffd5b50610471600b5481565b348015610673575f5ffd5b50610471602081565b348015610687575f5ffd5b5061069b61069636600461347f565b6113d2565b604051610458989796959493929190613520565b3480156106ba575f5ffd5b506106ce6106c9366004613581565b611562565b6040519015158152602001610458565b3480156106e9575f5ffd5b506104416106f83660046134b1565b61158e565b348015610708575f5ffd5b506004546106ce90600160a01b900460ff1681565b348015610728575f5ffd5b506004546104c9906001600160a01b031681565b348015610747575f5ffd5b5061075b6107563660046135ab565b61164d565b604080519788526001600160a01b039096166020880152931515948601949094526060850191909152608084015290151560a0830152151560c082015260e001610458565b3480156107ab575f5ffd5b506106ce6107ba366004613581565b601660209081525f928352604080842090915290825290205460ff1681565b3480156107e4575f5ffd5b506105006107f336600461347f565b611702565b348015610803575f5ffd5b506104c961081236600461347f565b60156020525f90815260409020546001600160a01b031681565b348015610837575f5ffd5b5061047160085481565b34801561084c575f5ffd5b506104c97f000000000000000000000000000000000000000000000000000000000000000081565b34801561087f575f5ffd5b50600754600854600954600a8054600b54600c54600d54600e54600f54601054600454604080518d8152602081019c909c528b019990995260608a0196909652608089019490945260a088019290925260c087015260e08601526101008501526101208401524761014084015290921015610160820152600160a01b90910460ff1615156101808201526101a001610458565b34801561091d575f5ffd5b50610471681b1ae4d6e2ef50000081565b348015610939575f5ffd5b50610500611908565b34801561094d575f5ffd5b5061050061095c3660046134b1565b611989565b34801561096c575f5ffd5b506002546104c9906001600160a01b031681565b34801561098b575f5ffd5b5061050061099a3660046135cb565b611a2b565b3480156109aa575f5ffd5b50610471680ad78ebc5ac620000081565b3480156109c6575f5ffd5b50610471600f5481565b3480156109db575f5ffd5b505f546104c9906001600160a01b031681565b3480156109f9575f5ffd5b5061047169010f0cf064dd5920000081565b348015610a16575f5ffd5b50610471600e5481565b610500610a2e366004613631565b611c36565b348015610a3e575f5ffd5b50610a96610a4d36600461347f565b60146020525f9081526040902080546001820154600283015460038401546004850154600586015460069096015494956001600160a01b039094169492939192909160ff169087565b604080519788526001600160a01b0390961660208801529486019390935260608501919091526080840152151560a083015260c082015260e001610458565b348015610ae0575f5ffd5b50610af4610aef3660046135ab565b612124565b60405161045891906136f1565b348015610b0c575f5ffd5b50610471610bb881565b348015610b21575f5ffd5b50610471610b303660046134b1565b60196020525f908152604090205481565b348015610b4c575f5ffd5b506104716621c0331d5dc00081565b348015610b66575f5ffd5b5061047160095481565b348015610b7b575f5ffd5b5061047160055481565b348015610b90575f5ffd5b5061047160075481565b348015610ba5575f5ffd5b50610471600a5481565b348015610bba575f5ffd5b50610500610bc93660046134b1565b612213565b348015610bd9575f5ffd5b50610471683635c9adc5dea0000081565b348015610bf5575f5ffd5b50610471608081565b348015610c09575f5ffd5b50610471610c183660046134b1565b60186020525f908152604090205481565b348015610c34575f5ffd5b506106ce610c43366004613581565b6122b5565b348015610c53575f5ffd5b50610500610c62366004613733565b612327565b348015610c72575f5ffd5b506104716201518081565b348015610c88575f5ffd5b50610471610c9736600461347f565b5f9081526012602052604090205490565b610500610cb636600461347f565b612775565b348015610cc6575f5ffd5b5061047168056bc75e2d6310000081565b348015610ce2575f5ffd5b50610471600d5481565b348015610cf7575f5ffd5b5061047161271081565b348015610d0c575f5ffd5b506001546104c9906001600160a01b031681565b348015610d2b575f5ffd5b5061047160105481565b348015610d40575f5ffd5b506104716802b5e3af16b188000081565b348015610d5c575f5ffd5b5061047168015af1d78b58c4000081565b348015610d78575f5ffd5b50610500610d873660046134b1565b612a02565b348015610d97575f5ffd5b50610500610da63660046134b1565b612aa4565b348015610db6575f5ffd5b50610500610dc536600461347f565b612b45565b348015610dd5575f5ffd5b50610471600c5481565b5f81815260116020526040812054819081908103610e10576040516303d4572d60e51b815260040160405180910390fd5b5f848152601460205260408120600381015490919015610e34578160030154610e3f565b681b1ae4d6e2ef5000005b60068301545f8881526017602052604090205491925090610e5f83612e2b565b94509450945050509193909250565b6003546001600160a01b03163314610e9957604051631dc610a960e21b815260040160405180910390fd5b805f03610eb957604051637f1402d560e11b815260040160405180910390fd5b6006805490829055426005819055604080518381526020810185905280820192909252517fd9c9c767abc8174b594a5a15dd708b5629ab3a49044a597f8f3c8510dec766899181900360600190a15050565b5f546001600160a01b03163314610f35576040516330cd747160e01b815260040160405180910390fd5b60048054821515600160a01b0260ff60a01b199091161790556040517fb31006682779d0ac02864bee834675baf4592a679bfe75edd5e5847b52ef6f6e90610f8290831515815260200190565b60405180910390a150565b5f81815260116020526040812054819081908190819081908103610fc4576040516303d4572d60e51b815260040160405180910390fd5b5f87815260146020526040812060018101549091906001600160a01b0316611002575f898152601560205260409020546001600160a01b0316611011565b60018201546001600160a01b03165b90505f82600201545f03611035575f8a81526011602052604090206001015461103b565b82600201545b905082600301545f1461105257826003015461105d565b681b1ae4d6e2ef5000005b60048401546005850154600690950154919c909b5060ff909416995097509095509350915050565b5f546001600160a01b031633146110af576040516330cd747160e01b815260040160405180910390fd5b6110b7612f38565b47808211156110e85760405163f8db689560e01b815260048101829052602481018390526044015b60405180910390fd5b8160105f8282546110f99190613779565b9091555050600454611114906001600160a01b031683612f53565b6004546040518381526001600160a01b03909116907ff7595c4fd7fa675e456dd9520ac8266c06d237d52900fc573bccc85b7c177c9e9060200160405180910390a25061116d60015f516020613be65f395f51905f5255565b50565b5f81815260116020526040812054810361119d576040516303d4572d60e51b815260040160405180910390fd5b5f82815260146020526040812060030154156111c9575f838152601460205260409020600301546111d4565b681b1ae4d6e2ef5000005b90506111df81612e2b565b9392505050565b5f546001600160a01b03163314611210576040516330cd747160e01b815260040160405180910390fd5b611218612f38565b60045461122e906001600160a01b031682612fc3565b6004546040518281526001600160a01b03909116907fdc28230e59577914a436cfb62db26b700e51bf8f88a5ee37cb632984f058e7fc9060200160405180910390a261116d60015f516020613be65f395f51905f5255565b600454600160a01b900460ff16156112b15760405163ab35696f60e01b815260040160405180910390fd5b5f8181526011602052604081205490036112de576040516303d4572d60e51b815260040160405180910390fd5b5f6112e882612ff7565b60018101549091506001600160a01b0316331461131857604051632731809760e11b815260040160405180910390fd5b600581015460ff161561133e57604051635d51ae1160e11b815260040160405180910390fd5b60058101805460ff19166001179055604051339083907f4fc8ba7f4f3c695895c779eb7fde668149b9eed94bfc8e5dda5899c40eca973b905f90a381336001600160a01b03167fa6ee3ef6571010d3ffb2d35d43b13206e21caa75cbf77746e93fb0aaa57093be836006015484600401546040516113c6929190918252602082015260400190565b60405180910390a35050565b5f5f5f5f6060805f5f5f60115f8b81526020019081526020015f209050805f01548160010154826002015f9054906101000a900460ff1683600301548460040185600501866006015f9054906101000a90046001600160a01b0316876007015483805461143e9061378c565b80601f016020809104026020016040519081016040528092919081815260200182805461146a9061378c565b80156114b55780601f1061148c576101008083540402835291602001916114b5565b820191905f5260205f20905b81548152906001019060200180831161149857829003601f168201915b505050505093508280546114c89061378c565b80601f01602080910402602001604051908101604052809291908181526020018280546114f49061378c565b801561153f5780601f106115165761010080835404028352916020019161153f565b820191905f5260205f20905b81548152906001019060200180831161152257829003601f168201915b505050505092509850985098509850985098509850985050919395975091939597565b5f8281526016602090815260408083206001600160a01b038516845290915290205460ff165b92915050565b60405163aaac37a160e01b81526001600160a01b0382811660048301525f91829182917f00000000000000000000000000000000000000000000000000000000000000009091169063aaac37a190602401602060405180830381865afa1580156115fa573d5f5f3e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061161e91906137c4565b6001600160a01b0385165f9081526018602052604090205490935091506116458284613779565b929491935050565b5f82815260126020526040812054819081908190819081908190881061168657604051635878ae8560e11b815260040160405180910390fd5b5f89815260126020526040812080548a9081106116a5576116a56137db565b5f91825260209091206005909102018054600182015460028301546003840154600490940154929e6001600160a01b0383169e5060ff600160a01b90930483169d50909b5092995080821698506101009091041695509350505050565b600454600160a01b900460ff161561172d5760405163ab35696f60e01b815260040160405180910390fd5b5f81815260116020526040812054900361175a576040516303d4572d60e51b815260040160405180910390fd5b5f81815260166020908152604080832033845290915290205460ff1615611794576040516328486b6360e11b815260040160405180910390fd5b5f61179e82612ff7565b600581015490915060ff16156117c757604051632444f8b760e11b815260040160405180910390fd5b5f6117d1336130a4565b90505f6117dd8461314d565b90508082101561180a576040516320200bc560e01b815260048101839052602481018290526044016110df565b5f8481526016602090815260408083203384529091528120805460ff19166001179055606461183a8360056137ef565b6118449190613806565b905061187b338260405180604001604052806012815260200171435245444942494c4954595f554e4c4f434b60701b815250613195565b336001600160a01b0316857f2ee8d21874599264c54876b79bf25eae1b396c3771a178e683a9e038b634f1d75f6040516118b59190613825565b60405180910390a384336001600160a01b03167f424f6c71ca4b96f4b4f4e8e8515b9505cbce4502fd2245d26d4e367265d3a14b5f5f6040516118f9929190613855565b60405180910390a35050505050565b6001546001600160a01b0316331461193357604051630614e5c760e21b815260040160405180910390fd5b5f8054336001600160a01b0319808316821784556001805490911690556040516001600160a01b0390921692909183917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a350565b5f546001600160a01b031633146119b3576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b0381166119da5760405163e6c4247b60e01b815260040160405180910390fd5b600280546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f078c3b417dadf69374a59793b829c52001247130433427049317bde56607b1b7905f90a35050565b600454600160a01b900460ff1615611a565760405163ab35696f60e01b815260040160405180910390fd5b611a5e612f38565b5f828152601160205260408120549003611a8b576040516303d4572d60e51b815260040160405180910390fd5b611a9f333068056bc75e2d63100000613219565b6001600a5f828254611ab19190613779565b90915550505f828152601260209081526040808320815160e0810183528681523381850181815287151583860181815268056bc75e2d6310000060608601818152426080880190815260a088018c815260c089018d81528a5460018082018d559b8f529d8d902099516005909e029099019c8d559551988c01805494511515600160a01b026001600160a81b03199095166001600160a01b03909a169990991793909317909755955160028a0155516003890155905160049097018054935115156101000261ff00199815159890981661ffff199094169390931796909617909155825194855292840152909184917fa04181c550a5111ebee021519f1381f122b78eb4e9b9194a64cd6c9de7737351910160405180910390a3600a5460408051831515815268056bc75e2d6310000060208201528082019290925251839133917fdd27f0b6e7de579d714cf2d97515bd34a9d32d1fc13e4135ac9155193b6d87489181900360600190a3611c3260015f516020613be65f395f51905f5255565b5050565b600454600160a01b900460ff1615611c615760405163ab35696f60e01b815260040160405180910390fd5b611c69612f38565b88611c875760405163b780d61f60e01b815260040160405180910390fd5b871580611c945750606488115b15611cb257604051630f7fcb2960e21b815260040160405180910390fd5b611cbe8585858561324e565b5f8981526011602052604090205415611cea57604051635665e77960e11b815260040160405180910390fd5b6621c0331d5dc000341015611d2157604051633ebbc33760e01b81526621c0331d5dc00060048201523460248201526044016110df565b5f611d336621c0331d5dc0003461388f565b90505f612710611d4c610bb86621c0331d5dc0006137ef565b611d569190613806565b90505f611d6a826621c0331d5dc00061388f565b90505f5f90506621c0331d5dc000600d5f828254611d889190613779565b9250508190555082600e5f828254611da09190613779565b9250508190555081600f5f828254611db89190613779565b92505081905550600160075f828254611dd19190613779565b90915550859050611e5857600160085f828254611dee9190613779565b90915550611dff90508c60326137ef565b611e1190670de0b6b3a76400006137ef565b905069010f0cf064dd59200000811115611e32575069010f0cf064dd592000005b80600b5f828254611e439190613779565b90915550611e5390503382612fc3565b611e70565b600160095f828254611e6a9190613779565b90915550505b6040518061010001604052804281526020018d815260200186151581526020018c8c604051611ea09291906138a2565b604051809103902081526020018a8a8080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92019190915250505090825250604080516020601f8b0181900481028201810190925289815291810191908a908a90819084018382808284375f81840152601f19601f820116905080830192505050505050508152602001336001600160a01b031681526020018281525060115f8f81526020019081526020015f205f820151815f0155602082015181600101556040820151816002015f6101000a81548160ff021916908315150217905550606082015181600301556080820151816004019081611fa49190613913565b5060a08201516005820190611fb99082613913565b5060c08201516006820180546001600160a01b039092166001600160a01b031992831617905560e0909201516007909101555f8e8152601560205260408120805490921633179091556013805460018101825591527f66de8ffda797e3de9c05e8fc57b3bf0ec28a930d40b0d285d93c06501cf6a090018d905561203c8d612ff7565b50821561205957600454612059906001600160a01b031684612f53565b8315612069576120693385612f53565b336001600160a01b03168d7f356e37b4b3a3dbbf61e05450c7d74955350550a659bd8792d406b6c27133a0e18e88858e8e6040516120ab9594939291906139d2565b60405180910390a3604080516621c0331d5dc0008152602081018590529081018390528d9033907fd381803faab74092aedc8de24231e595cfd3af1a0997ead17e7bcd54d9777c109060600160405180910390a35050505061211960015f516020613be65f395f51905f5255565b505050505050505050565b6013546060908084101580612137575082155b15612151575050604080515f815260208101909152611588565b5f61215c858361388f565b90505f84821061216c578461216e565b815b90508067ffffffffffffffff811115612189576121896138b1565b6040519080825280602002602001820160405280156121b2578160200160208202803683370190505b5093505f5b818110156122095760136121cb8289613779565b815481106121db576121db6137db565b905f5260205f2001548582815181106121f6576121f66137db565b60209081029190910101526001016121b7565b5050505092915050565b5f546001600160a01b0316331461223d576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b0381166122645760405163e6c4247b60e01b815260040160405180910390fd5b600380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f038f89ec725a3bc1b18bf38a625bf2ff0407764bd3489886a60cf1d506c7e3a2905f90a35050565b5f8281526011602052604081205481036122e2576040516303d4572d60e51b815260040160405180910390fd5b5f8381526014602052604090206005015460ff16806111df5750505f9182526016602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6002546001600160a01b0316331461235257604051631bc2178f60e01b815260040160405180910390fd5b600454600160a01b900460ff161561237d5760405163ab35696f60e01b815260040160405180910390fd5b612385612f38565b5f8381526012602052604090205482106123b257604051635878ae8560e11b815260040160405180910390fd5b5f8381526012602052604081208054849081106123d1576123d16137db565b5f9182526020909120600590910201600481015490915060ff1615612409576040516336ab81e160e11b815260040160405180910390fd5b600481018054600183810154600160a01b900460ff90811615158615151461010090810261ffff199094169390931790911792839055910416156125a4576001810154612468906001600160a01b0316680ad78ebc5ac6200000612fc3565b680ad78ebc5ac6200000600b5f8282546124829190613779565b90915550506001818101546001600160a01b03165f908152601a6020526040812080549091906124b3908490613779565b90915550506001818101546001600160a01b03165f90815260196020526040812080549091906124e4908490613779565b909155505060018101546040805180820190915260098152682a292aaa242faba4a760b91b602082015261252c916001600160a01b03169068056bc75e2d6310000090613195565b60018101546001600160a01b03165f818152601a60209081526040808320546019835292819020548151680ad78ebc5ac62000008152928301939093528101919091528591907f2bf5610a3160f50d1cc55d7fa21f75955c18cfa17bd68d4e51dc77dfeda5733a9060600160405180910390a36126e7565b5f6125ae85612ff7565b90505f6125c5600268056bc75e2d63100000613806565b60018301549091506125e0906001600160a01b031682612fc3565b604051632770a7eb60e21b8152306004820152602481018290527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690639dc29fac906044015f604051808303815f87803b158015612645575f5ffd5b505af1158015612657573d5f5f3e3d5ffd5b5050505080600c5f82825461266c9190613779565b90915550506001830180546001600160a01b039081165f908152601a60209081526040808320929092559254815168056bc75e2d63100000815293840185905290830184905288929116907fbcf65737654e7229f3fffa7a8ddf1ca4000e2b39d0c90220e745ccf77b3938259060600160405180910390a350505b600181015460048201546001600160a01b039091169085907f8aa1336152b005ddd3ccc39b5a66ed207555053dd23bc9cff1aab405f6348ea590610100900460ff1680612734575f61273f565b680ad78ebc5ac62000005b60408051921515835260208301919091520160405180910390a35061277060015f516020613be65f395f51905f5255565b505050565b600454600160a01b900460ff16156127a05760405163ab35696f60e01b815260040160405180910390fd5b6127a8612f38565b5f8181526011602052604081205490036127d5576040516303d4572d60e51b815260040160405180910390fd5b5f81815260166020908152604080832033845290915290205460ff161561280f576040516328486b6360e11b815260040160405180910390fd5b5f61281982612ff7565b600581015490915060ff161561284257604051632444f8b760e11b815260040160405180910390fd5b60038101545f61285184611170565b90508034101561287d57604051633ebbc33760e01b8152600481018290523460248201526044016110df565b5f8481526016602090815260408083203384529091528120805460ff19166001908117909155600485018054919290916128b8908490613779565b909155506128c79050826132b0565b60038401555f84815260176020526040812080548392906128e9908490613779565b90915550506001830154612906906001600160a01b031682612f53565b80341115612921576129213361291c833461388f565b612f53565b336001600160a01b0316847f2ee8d21874599264c54876b79bf25eae1b396c3771a178e683a9e038b634f1d78460405161295b9190613a17565b60405180910390a3837f68520cf07e2f785cba8f9601c758232191b84e9f0a8ec7b3049d2dcc197b67fe846003015460405161299991815260200190565b60405180910390a283336001600160a01b03167f424f6c71ca4b96f4b4f4e8e8515b9505cbce4502fd2245d26d4e367265d3a14b8386600401546040516129e1929190613a3f565b60405180910390a350505061116d60015f516020613be65f395f51905f5255565b5f546001600160a01b03163314612a2c576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b038116612a535760405163e6c4247b60e01b815260040160405180910390fd5b600480546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f4ab5be82436d353e61ca18726e984e561f5c1cc7c6d38b29d2553c790434705a905f90a35050565b5f546001600160a01b03163314612ace576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b038116612af55760405163e6c4247b60e01b815260040160405180910390fd5b600180546001600160a01b0319166001600160a01b038381169182179092555f8054604051929316917f38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e227009190a350565b600454600160a01b900460ff1615612b705760405163ab35696f60e01b815260040160405180910390fd5b612b78612f38565b5f818152601160205260408120549003612ba5576040516303d4572d60e51b815260040160405180910390fd5b5f81815260166020908152604080832033845290915290205460ff1615612bdf576040516328486b6360e11b815260040160405180910390fd5b5f612be982612ff7565b600581015490915060ff1615612c1257604051632444f8b760e11b815260040160405180910390fd5b60038101545f612c23600283613806565b90505f612c30828461388f565b9050612c3d333085613219565b604051632770a7eb60e21b8152306004820152602481018390527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690639dc29fac906044015f604051808303815f87803b158015612ca2575f5ffd5b505af1158015612cb4573d5f5f3e3d5ffd5b5050505081600c5f828254612cc99190613779565b90915550506001840154612ce6906001600160a01b031682612fc3565b5f8581526016602090815260408083203384529091528120805460ff1916600190811790915560048601805491929091612d21908490613779565b9250508190555080846006015f828254612d3b9190613779565b90915550612d4a9050836132b0565b6003850155604051339086907f2ee8d21874599264c54876b79bf25eae1b396c3771a178e683a9e038b634f1d790612d83908790613a61565b60405180910390a3847f68520cf07e2f785cba8f9601c758232191b84e9f0a8ec7b3049d2dcc197b67fe8560030154604051612dc191815260200190565b60405180910390a284336001600160a01b03167f424f6c71ca4b96f4b4f4e8e8515b9505cbce4502fd2245d26d4e367265d3a14b858760040154604051612e09929190613a8a565b60405180910390a35050505061116d60015f516020613be65f395f51905f5255565b6005545f90808203612e5057604051630b73274760e11b815260040160405180910390fd5b612e5d6201518082613779565b421115612e8957604051634487756760e11b8152600481018290526201518060248201526044016110df565b5f7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015612ee6573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190612f0a9190613aad565b612f1590600a613bb0565b90508060065485612f2691906137ef565b612f309190613806565b949350505050565b612f4061330e565b60025f516020613be65f395f51905f5255565b5f826001600160a01b0316826040515f6040518083038185875af1925050503d805f8114612f9c576040519150601f19603f3d011682016040523d82523d5f602084013e612fa1565b606091505b505090508061277057604051630db2c7f160e31b815260040160405180910390fd5b611c326001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016838361333f565b5f81815260146020526040902060038101541561301357919050565b5f828152601560205260409020546001600160a01b031680613048576040516361f2aa0160e11b815260040160405180910390fd5b828255600180830180546001600160a01b0319166001600160a01b0393909316929092179091555f92835260116020526040909220909101546002820155681b1ae4d6e2ef500000600382015560058101805460ff1916905590565b6001600160a01b038181165f8181526018602052604080822054905163aaac37a160e01b81526004810193909352909290917f00000000000000000000000000000000000000000000000000000000000000009091169063aaac37a190602401602060405180830381865afa15801561311f573d5f5f3e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061314391906137c4565b6115889190613779565b5f8181526011602052604081206001015481906131749068015af1d78b58c40000906137ef565b9050683635c9adc5dea00000811161158857683635c9adc5dea000006111df565b6001600160a01b0383165f90815260186020526040812054906131b88483613779565b6001600160a01b0386165f818152601860205260409081902083905551919250907f7b750b6736ccb837fea530571f55e8e43f7eeb7bf7f2aadca5b698bd6be22d7a9061320a90859085908890613bbe565b60405180910390a25050505050565b6127706001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016848484613374565b8281602082111561327c576040516350d6487960e11b815260048101839052602060248201526044016110df565b60808111156132a857604051630912bec560e11b815260048101829052608060248201526044016110df565b505050505050565b5f68878678326eac90000082106132d1575068878678326eac900000919050565b5f6132e56802b5e3af16b188000084613779565b905068878678326eac90000081116132fd57806111df565b68878678326eac9000009392505050565b5f516020613be65f395f51905f525460020361333d57604051633ee5aeb560e01b815260040160405180910390fd5b565b61334c83838360016133b0565b61277057604051635274afe760e01b81526001600160a01b03841660048201526024016110df565b613382848484846001613412565b6133aa57604051635274afe760e01b81526001600160a01b03851660048201526024016110df565b50505050565b60405163a9059cbb60e01b5f8181526001600160a01b038616600452602485905291602083604481808b5af1925060015f511483166134065783831516156133fa573d5f823e3d81fd5b5f873b113d1516831692505b60405250949350505050565b6040516323b872dd60e01b5f8181526001600160a01b038781166004528616602452604485905291602083606481808c5af1925060015f5114831661346e578383151615613462573d5f823e3d81fd5b5f883b113d1516831692505b604052505f60605295945050505050565b5f6020828403121561348f575f5ffd5b5035919050565b80356001600160a01b03811681146134ac575f5ffd5b919050565b5f602082840312156134c1575f5ffd5b6111df82613496565b803580151581146134ac575f5ffd5b5f602082840312156134e9575f5ffd5b6111df826134ca565b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b888152876020820152861515604082015285606082015261010060808201525f61354e6101008301876134f2565b82810360a084015261356081876134f2565b6001600160a01b039590951660c0840152505060e001529695505050505050565b5f5f60408385031215613592575f5ffd5b823591506135a260208401613496565b90509250929050565b5f5f604083850312156135bc575f5ffd5b50508035926020909101359150565b5f5f604083850312156135dc575f5ffd5b823591506135a2602084016134ca565b5f5f83601f8401126135fc575f5ffd5b50813567ffffffffffffffff811115613613575f5ffd5b60208301915083602082850101111561362a575f5ffd5b9250929050565b5f5f5f5f5f5f5f5f5f60c08a8c031215613649575f5ffd5b8935985060208a0135975060408a013567ffffffffffffffff81111561366d575f5ffd5b6136798c828d016135ec565b90985096505060608a013567ffffffffffffffff811115613698575f5ffd5b6136a48c828d016135ec565b90965094505060808a013567ffffffffffffffff8111156136c3575f5ffd5b6136cf8c828d016135ec565b90945092506136e2905060a08b016134ca565b90509295985092959850929598565b602080825282518282018190525f918401906040840190835b8181101561372857835183526020938401939092019160010161370a565b509095945050505050565b5f5f5f60608486031215613745575f5ffd5b833592506020840135915061375c604085016134ca565b90509250925092565b634e487b7160e01b5f52601160045260245ffd5b8082018082111561158857611588613765565b600181811c908216806137a057607f821691505b6020821081036137be57634e487b7160e01b5f52602260045260245ffd5b50919050565b5f602082840312156137d4575f5ffd5b5051919050565b634e487b7160e01b5f52603260045260245ffd5b808202811582820484141761158857611588613765565b5f8261382057634e487b7160e01b5f52601260045260245ffd5b500490565b818152604060208201525f6111df60408301600b81526a435245444942494c49545960a81b602082015260400190565b606081525f61387f60608301600b81526a435245444942494c49545960a81b602082015260400190565b6020830194909452506040015290565b8181038181111561158857611588613765565b818382375f9101908152919050565b634e487b7160e01b5f52604160045260245ffd5b601f821115612770578282111561277057805f5260205f20601f840160051c60208510156138f057505f5b90810190601f840160051c035f5b818110156132a8575f838201556001016138fe565b815167ffffffffffffffff81111561392d5761392d6138b1565b6139418161393b845461378c565b846138c5565b6020601f821160018114613973575f831561395c5750848201515b5f19600385901b1c1916600184901b1784556139cb565b5f84815260208120601f198516915b828110156139a25787850151825560209485019460019092019101613982565b50848210156139bf57868401515f19600387901b60f8161c191681555b505060018360011b0184555b5050505050565b858152841515602082015283604082015260806060820152816080820152818360a08301375f81830160a090810191909152601f909201601f19160101949350505050565b818152604060208201525f6111df60408301600381526208aa8960eb1b602082015260400190565b606081525f61387f60608301600381526208aa8960eb1b602082015260400190565b818152604060208201525f6111df604083016004815263212aa92760e11b602082015260400190565b606081525f61387f606083016004815263212aa92760e11b602082015260400190565b5f60208284031215613abd575f5ffd5b815160ff811681146111df575f5ffd5b6001815b6001841115613b0857808504811115613aec57613aec613765565b6001841615613afa57908102905b60019390931c928002613ad1565b935093915050565b5f82613b1e57506001611588565b81613b2a57505f611588565b8160018114613b405760028114613b4a57613b66565b6001915050611588565b60ff841115613b5b57613b5b613765565b50506001821b611588565b5060208310610133831016604e8410600b8410161715613b89575081810a611588565b613b955f198484613acd565b805f1904821115613ba857613ba8613765565b029392505050565b5f6111df60ff841683613b10565b838152826020820152606060408201525f613bdc60608301846134f2565b9594505050505056fe9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00a264697066735822122084422131e1a1c9942b9bfb50d5cfd69d2a2154da993f1f3cbd03bee21207002c64736f6c63430008220033" as const;

export const ghostProtocolDeployedBytecode = "0x6080604052600436106103e2575f3560e01c80638c37f11d116101ff578063c89e74fb11610113578063e1a45218116100a8578063e535a61411610078578063e535a61414610d51578063f0f4426014610d6d578063f2fde38b14610d8c578063f4dceacd14610dab578063f99156cb14610dca575f5ffd5b8063e1a4521814610cec578063e30c397814610d01578063e319c8d114610d20578063e332305d14610d35575f5ffd5b8063d365d094116100e3578063d365d09414610c7d578063d4ade87514610ca8578063d73848cc14610cbb578063dbd8c05714610cd7575f5ffd5b8063c89e74fb14610bfe578063c9ab713014610c29578063cb3399e814610c48578063d0f6581b14610c67575f5ffd5b8063a6d2fcd911610194578063b87c111411610164578063b87c111414610b85578063b9fa45da14610b9a578063bf813d8214610baf578063c69ab50114610bce578063c6a27efd14610bea575f5ffd5b8063a6d2fcd914610b16578063af414d4114610b41578063b3dfbcf814610b5b578063b690d8a114610b70575f5ffd5b806398933e3a116101cf57806398933e3a14610a205780639e33bb8614610a33578063a4fa95bf14610ad5578063a60051ae14610b01575f5ffd5b80638c37f11d146109bb5780638da5cb5b146109d0578063924d3f56146109ee578063938a8bca14610a0b575f5ffd5b806353093093116102f65780636a65eaa61161028b57806379ba50971161025b57806379ba50971461092e5780637adbf973146109425780637dc0d1d0146109615780638748c6b9146109805780638c1a60b21461099f575f5ffd5b80636a65eaa61461082c5780636bccc75314610841578063771aceef1461087457806378f88d6714610912575f5ffd5b806365137dd0116102c657806365137dd01461073c57806367310b5a146107a057806368f5c663146107d95780636a01a775146107f8575f5ffd5b806353093093146106af5780635bdf5621146106de5780635c975abb146106fd57806361d027b31461071d575f5ffd5b80631a868c40116103775780632cad2f65116103475780632cad2f65146106185780632ce13a031461063757806338902fdb1461065357806340df08dc146106685780634a7221a01461067c575f5ffd5b80631a868c40146105a657806321026950146105c55780632666185a146105e457806329ff0d9314610603575f5ffd5b806313b781ab116103b257806313b781ab146104e15780631433219c1461050257806316c38b3c1461052d57806319b881e41461054c575f5ffd5b8063056962c31461042257806308104069146104615780630efd66e21461047f578063139ab0e7146104aa575f5ffd5b3661041e5760405134815233907f719feb717c187001672aa98b85a51988a7fab410c32ed1d724838c8377bf90af9060200160405180910390a2005b5f5ffd5b34801561042d575f5ffd5b5061044161043c36600461347f565b610ddf565b604080519384526020840192909252908201526060015b60405180910390f35b34801561046c575f5ffd5b506013545b604051908152602001610458565b34801561048a575f5ffd5b506104716104993660046134b1565b601a6020525f908152604090205481565b3480156104b5575f5ffd5b506003546104c9906001600160a01b031681565b6040516001600160a01b039091168152602001610458565b3480156104ec575f5ffd5b506105006104fb36600461347f565b610e6e565b005b34801561050d575f5ffd5b5061047161051c36600461347f565b60176020525f908152604090205481565b348015610538575f5ffd5b506105006105473660046134d9565b610f0b565b348015610557575f5ffd5b5061056b61056636600461347f565b610f8d565b6040805196875260208701959095529215159385019390935260608401526001600160a01b03909116608083015260a082015260c001610458565b3480156105b1575f5ffd5b506105006105c036600461347f565b611085565b3480156105d0575f5ffd5b506104716105df36600461347f565b611170565b3480156105ef575f5ffd5b506105006105fe36600461347f565b6111e6565b34801561060e575f5ffd5b5061047160065481565b348015610623575f5ffd5b5061050061063236600461347f565b611286565b348015610642575f5ffd5b5061047168878678326eac90000081565b34801561065e575f5ffd5b50610471600b5481565b348015610673575f5ffd5b50610471602081565b348015610687575f5ffd5b5061069b61069636600461347f565b6113d2565b604051610458989796959493929190613520565b3480156106ba575f5ffd5b506106ce6106c9366004613581565b611562565b6040519015158152602001610458565b3480156106e9575f5ffd5b506104416106f83660046134b1565b61158e565b348015610708575f5ffd5b506004546106ce90600160a01b900460ff1681565b348015610728575f5ffd5b506004546104c9906001600160a01b031681565b348015610747575f5ffd5b5061075b6107563660046135ab565b61164d565b604080519788526001600160a01b039096166020880152931515948601949094526060850191909152608084015290151560a0830152151560c082015260e001610458565b3480156107ab575f5ffd5b506106ce6107ba366004613581565b601660209081525f928352604080842090915290825290205460ff1681565b3480156107e4575f5ffd5b506105006107f336600461347f565b611702565b348015610803575f5ffd5b506104c961081236600461347f565b60156020525f90815260409020546001600160a01b031681565b348015610837575f5ffd5b5061047160085481565b34801561084c575f5ffd5b506104c97f000000000000000000000000000000000000000000000000000000000000000081565b34801561087f575f5ffd5b50600754600854600954600a8054600b54600c54600d54600e54600f54601054600454604080518d8152602081019c909c528b019990995260608a0196909652608089019490945260a088019290925260c087015260e08601526101008501526101208401524761014084015290921015610160820152600160a01b90910460ff1615156101808201526101a001610458565b34801561091d575f5ffd5b50610471681b1ae4d6e2ef50000081565b348015610939575f5ffd5b50610500611908565b34801561094d575f5ffd5b5061050061095c3660046134b1565b611989565b34801561096c575f5ffd5b506002546104c9906001600160a01b031681565b34801561098b575f5ffd5b5061050061099a3660046135cb565b611a2b565b3480156109aa575f5ffd5b50610471680ad78ebc5ac620000081565b3480156109c6575f5ffd5b50610471600f5481565b3480156109db575f5ffd5b505f546104c9906001600160a01b031681565b3480156109f9575f5ffd5b5061047169010f0cf064dd5920000081565b348015610a16575f5ffd5b50610471600e5481565b610500610a2e366004613631565b611c36565b348015610a3e575f5ffd5b50610a96610a4d36600461347f565b60146020525f9081526040902080546001820154600283015460038401546004850154600586015460069096015494956001600160a01b039094169492939192909160ff169087565b604080519788526001600160a01b0390961660208801529486019390935260608501919091526080840152151560a083015260c082015260e001610458565b348015610ae0575f5ffd5b50610af4610aef3660046135ab565b612124565b60405161045891906136f1565b348015610b0c575f5ffd5b50610471610bb881565b348015610b21575f5ffd5b50610471610b303660046134b1565b60196020525f908152604090205481565b348015610b4c575f5ffd5b506104716621c0331d5dc00081565b348015610b66575f5ffd5b5061047160095481565b348015610b7b575f5ffd5b5061047160055481565b348015610b90575f5ffd5b5061047160075481565b348015610ba5575f5ffd5b50610471600a5481565b348015610bba575f5ffd5b50610500610bc93660046134b1565b612213565b348015610bd9575f5ffd5b50610471683635c9adc5dea0000081565b348015610bf5575f5ffd5b50610471608081565b348015610c09575f5ffd5b50610471610c183660046134b1565b60186020525f908152604090205481565b348015610c34575f5ffd5b506106ce610c43366004613581565b6122b5565b348015610c53575f5ffd5b50610500610c62366004613733565b612327565b348015610c72575f5ffd5b506104716201518081565b348015610c88575f5ffd5b50610471610c9736600461347f565b5f9081526012602052604090205490565b610500610cb636600461347f565b612775565b348015610cc6575f5ffd5b5061047168056bc75e2d6310000081565b348015610ce2575f5ffd5b50610471600d5481565b348015610cf7575f5ffd5b5061047161271081565b348015610d0c575f5ffd5b506001546104c9906001600160a01b031681565b348015610d2b575f5ffd5b5061047160105481565b348015610d40575f5ffd5b506104716802b5e3af16b188000081565b348015610d5c575f5ffd5b5061047168015af1d78b58c4000081565b348015610d78575f5ffd5b50610500610d873660046134b1565b612a02565b348015610d97575f5ffd5b50610500610da63660046134b1565b612aa4565b348015610db6575f5ffd5b50610500610dc536600461347f565b612b45565b348015610dd5575f5ffd5b50610471600c5481565b5f81815260116020526040812054819081908103610e10576040516303d4572d60e51b815260040160405180910390fd5b5f848152601460205260408120600381015490919015610e34578160030154610e3f565b681b1ae4d6e2ef5000005b60068301545f8881526017602052604090205491925090610e5f83612e2b565b94509450945050509193909250565b6003546001600160a01b03163314610e9957604051631dc610a960e21b815260040160405180910390fd5b805f03610eb957604051637f1402d560e11b815260040160405180910390fd5b6006805490829055426005819055604080518381526020810185905280820192909252517fd9c9c767abc8174b594a5a15dd708b5629ab3a49044a597f8f3c8510dec766899181900360600190a15050565b5f546001600160a01b03163314610f35576040516330cd747160e01b815260040160405180910390fd5b60048054821515600160a01b0260ff60a01b199091161790556040517fb31006682779d0ac02864bee834675baf4592a679bfe75edd5e5847b52ef6f6e90610f8290831515815260200190565b60405180910390a150565b5f81815260116020526040812054819081908190819081908103610fc4576040516303d4572d60e51b815260040160405180910390fd5b5f87815260146020526040812060018101549091906001600160a01b0316611002575f898152601560205260409020546001600160a01b0316611011565b60018201546001600160a01b03165b90505f82600201545f03611035575f8a81526011602052604090206001015461103b565b82600201545b905082600301545f1461105257826003015461105d565b681b1ae4d6e2ef5000005b60048401546005850154600690950154919c909b5060ff909416995097509095509350915050565b5f546001600160a01b031633146110af576040516330cd747160e01b815260040160405180910390fd5b6110b7612f38565b47808211156110e85760405163f8db689560e01b815260048101829052602481018390526044015b60405180910390fd5b8160105f8282546110f99190613779565b9091555050600454611114906001600160a01b031683612f53565b6004546040518381526001600160a01b03909116907ff7595c4fd7fa675e456dd9520ac8266c06d237d52900fc573bccc85b7c177c9e9060200160405180910390a25061116d60015f516020613be65f395f51905f5255565b50565b5f81815260116020526040812054810361119d576040516303d4572d60e51b815260040160405180910390fd5b5f82815260146020526040812060030154156111c9575f838152601460205260409020600301546111d4565b681b1ae4d6e2ef5000005b90506111df81612e2b565b9392505050565b5f546001600160a01b03163314611210576040516330cd747160e01b815260040160405180910390fd5b611218612f38565b60045461122e906001600160a01b031682612fc3565b6004546040518281526001600160a01b03909116907fdc28230e59577914a436cfb62db26b700e51bf8f88a5ee37cb632984f058e7fc9060200160405180910390a261116d60015f516020613be65f395f51905f5255565b600454600160a01b900460ff16156112b15760405163ab35696f60e01b815260040160405180910390fd5b5f8181526011602052604081205490036112de576040516303d4572d60e51b815260040160405180910390fd5b5f6112e882612ff7565b60018101549091506001600160a01b0316331461131857604051632731809760e11b815260040160405180910390fd5b600581015460ff161561133e57604051635d51ae1160e11b815260040160405180910390fd5b60058101805460ff19166001179055604051339083907f4fc8ba7f4f3c695895c779eb7fde668149b9eed94bfc8e5dda5899c40eca973b905f90a381336001600160a01b03167fa6ee3ef6571010d3ffb2d35d43b13206e21caa75cbf77746e93fb0aaa57093be836006015484600401546040516113c6929190918252602082015260400190565b60405180910390a35050565b5f5f5f5f6060805f5f5f60115f8b81526020019081526020015f209050805f01548160010154826002015f9054906101000a900460ff1683600301548460040185600501866006015f9054906101000a90046001600160a01b0316876007015483805461143e9061378c565b80601f016020809104026020016040519081016040528092919081815260200182805461146a9061378c565b80156114b55780601f1061148c576101008083540402835291602001916114b5565b820191905f5260205f20905b81548152906001019060200180831161149857829003601f168201915b505050505093508280546114c89061378c565b80601f01602080910402602001604051908101604052809291908181526020018280546114f49061378c565b801561153f5780601f106115165761010080835404028352916020019161153f565b820191905f5260205f20905b81548152906001019060200180831161152257829003601f168201915b505050505092509850985098509850985098509850985050919395975091939597565b5f8281526016602090815260408083206001600160a01b038516845290915290205460ff165b92915050565b60405163aaac37a160e01b81526001600160a01b0382811660048301525f91829182917f00000000000000000000000000000000000000000000000000000000000000009091169063aaac37a190602401602060405180830381865afa1580156115fa573d5f5f3e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061161e91906137c4565b6001600160a01b0385165f9081526018602052604090205490935091506116458284613779565b929491935050565b5f82815260126020526040812054819081908190819081908190881061168657604051635878ae8560e11b815260040160405180910390fd5b5f89815260126020526040812080548a9081106116a5576116a56137db565b5f91825260209091206005909102018054600182015460028301546003840154600490940154929e6001600160a01b0383169e5060ff600160a01b90930483169d50909b5092995080821698506101009091041695509350505050565b600454600160a01b900460ff161561172d5760405163ab35696f60e01b815260040160405180910390fd5b5f81815260116020526040812054900361175a576040516303d4572d60e51b815260040160405180910390fd5b5f81815260166020908152604080832033845290915290205460ff1615611794576040516328486b6360e11b815260040160405180910390fd5b5f61179e82612ff7565b600581015490915060ff16156117c757604051632444f8b760e11b815260040160405180910390fd5b5f6117d1336130a4565b90505f6117dd8461314d565b90508082101561180a576040516320200bc560e01b815260048101839052602481018290526044016110df565b5f8481526016602090815260408083203384529091528120805460ff19166001179055606461183a8360056137ef565b6118449190613806565b905061187b338260405180604001604052806012815260200171435245444942494c4954595f554e4c4f434b60701b815250613195565b336001600160a01b0316857f2ee8d21874599264c54876b79bf25eae1b396c3771a178e683a9e038b634f1d75f6040516118b59190613825565b60405180910390a384336001600160a01b03167f424f6c71ca4b96f4b4f4e8e8515b9505cbce4502fd2245d26d4e367265d3a14b5f5f6040516118f9929190613855565b60405180910390a35050505050565b6001546001600160a01b0316331461193357604051630614e5c760e21b815260040160405180910390fd5b5f8054336001600160a01b0319808316821784556001805490911690556040516001600160a01b0390921692909183917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a350565b5f546001600160a01b031633146119b3576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b0381166119da5760405163e6c4247b60e01b815260040160405180910390fd5b600280546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f078c3b417dadf69374a59793b829c52001247130433427049317bde56607b1b7905f90a35050565b600454600160a01b900460ff1615611a565760405163ab35696f60e01b815260040160405180910390fd5b611a5e612f38565b5f828152601160205260408120549003611a8b576040516303d4572d60e51b815260040160405180910390fd5b611a9f333068056bc75e2d63100000613219565b6001600a5f828254611ab19190613779565b90915550505f828152601260209081526040808320815160e0810183528681523381850181815287151583860181815268056bc75e2d6310000060608601818152426080880190815260a088018c815260c089018d81528a5460018082018d559b8f529d8d902099516005909e029099019c8d559551988c01805494511515600160a01b026001600160a81b03199095166001600160a01b03909a169990991793909317909755955160028a0155516003890155905160049097018054935115156101000261ff00199815159890981661ffff199094169390931796909617909155825194855292840152909184917fa04181c550a5111ebee021519f1381f122b78eb4e9b9194a64cd6c9de7737351910160405180910390a3600a5460408051831515815268056bc75e2d6310000060208201528082019290925251839133917fdd27f0b6e7de579d714cf2d97515bd34a9d32d1fc13e4135ac9155193b6d87489181900360600190a3611c3260015f516020613be65f395f51905f5255565b5050565b600454600160a01b900460ff1615611c615760405163ab35696f60e01b815260040160405180910390fd5b611c69612f38565b88611c875760405163b780d61f60e01b815260040160405180910390fd5b871580611c945750606488115b15611cb257604051630f7fcb2960e21b815260040160405180910390fd5b611cbe8585858561324e565b5f8981526011602052604090205415611cea57604051635665e77960e11b815260040160405180910390fd5b6621c0331d5dc000341015611d2157604051633ebbc33760e01b81526621c0331d5dc00060048201523460248201526044016110df565b5f611d336621c0331d5dc0003461388f565b90505f612710611d4c610bb86621c0331d5dc0006137ef565b611d569190613806565b90505f611d6a826621c0331d5dc00061388f565b90505f5f90506621c0331d5dc000600d5f828254611d889190613779565b9250508190555082600e5f828254611da09190613779565b9250508190555081600f5f828254611db89190613779565b92505081905550600160075f828254611dd19190613779565b90915550859050611e5857600160085f828254611dee9190613779565b90915550611dff90508c60326137ef565b611e1190670de0b6b3a76400006137ef565b905069010f0cf064dd59200000811115611e32575069010f0cf064dd592000005b80600b5f828254611e439190613779565b90915550611e5390503382612fc3565b611e70565b600160095f828254611e6a9190613779565b90915550505b6040518061010001604052804281526020018d815260200186151581526020018c8c604051611ea09291906138a2565b604051809103902081526020018a8a8080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92019190915250505090825250604080516020601f8b0181900481028201810190925289815291810191908a908a90819084018382808284375f81840152601f19601f820116905080830192505050505050508152602001336001600160a01b031681526020018281525060115f8f81526020019081526020015f205f820151815f0155602082015181600101556040820151816002015f6101000a81548160ff021916908315150217905550606082015181600301556080820151816004019081611fa49190613913565b5060a08201516005820190611fb99082613913565b5060c08201516006820180546001600160a01b039092166001600160a01b031992831617905560e0909201516007909101555f8e8152601560205260408120805490921633179091556013805460018101825591527f66de8ffda797e3de9c05e8fc57b3bf0ec28a930d40b0d285d93c06501cf6a090018d905561203c8d612ff7565b50821561205957600454612059906001600160a01b031684612f53565b8315612069576120693385612f53565b336001600160a01b03168d7f356e37b4b3a3dbbf61e05450c7d74955350550a659bd8792d406b6c27133a0e18e88858e8e6040516120ab9594939291906139d2565b60405180910390a3604080516621c0331d5dc0008152602081018590529081018390528d9033907fd381803faab74092aedc8de24231e595cfd3af1a0997ead17e7bcd54d9777c109060600160405180910390a35050505061211960015f516020613be65f395f51905f5255565b505050505050505050565b6013546060908084101580612137575082155b15612151575050604080515f815260208101909152611588565b5f61215c858361388f565b90505f84821061216c578461216e565b815b90508067ffffffffffffffff811115612189576121896138b1565b6040519080825280602002602001820160405280156121b2578160200160208202803683370190505b5093505f5b818110156122095760136121cb8289613779565b815481106121db576121db6137db565b905f5260205f2001548582815181106121f6576121f66137db565b60209081029190910101526001016121b7565b5050505092915050565b5f546001600160a01b0316331461223d576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b0381166122645760405163e6c4247b60e01b815260040160405180910390fd5b600380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f038f89ec725a3bc1b18bf38a625bf2ff0407764bd3489886a60cf1d506c7e3a2905f90a35050565b5f8281526011602052604081205481036122e2576040516303d4572d60e51b815260040160405180910390fd5b5f8381526014602052604090206005015460ff16806111df5750505f9182526016602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6002546001600160a01b0316331461235257604051631bc2178f60e01b815260040160405180910390fd5b600454600160a01b900460ff161561237d5760405163ab35696f60e01b815260040160405180910390fd5b612385612f38565b5f8381526012602052604090205482106123b257604051635878ae8560e11b815260040160405180910390fd5b5f8381526012602052604081208054849081106123d1576123d16137db565b5f9182526020909120600590910201600481015490915060ff1615612409576040516336ab81e160e11b815260040160405180910390fd5b600481018054600183810154600160a01b900460ff90811615158615151461010090810261ffff199094169390931790911792839055910416156125a4576001810154612468906001600160a01b0316680ad78ebc5ac6200000612fc3565b680ad78ebc5ac6200000600b5f8282546124829190613779565b90915550506001818101546001600160a01b03165f908152601a6020526040812080549091906124b3908490613779565b90915550506001818101546001600160a01b03165f90815260196020526040812080549091906124e4908490613779565b909155505060018101546040805180820190915260098152682a292aaa242faba4a760b91b602082015261252c916001600160a01b03169068056bc75e2d6310000090613195565b60018101546001600160a01b03165f818152601a60209081526040808320546019835292819020548151680ad78ebc5ac62000008152928301939093528101919091528591907f2bf5610a3160f50d1cc55d7fa21f75955c18cfa17bd68d4e51dc77dfeda5733a9060600160405180910390a36126e7565b5f6125ae85612ff7565b90505f6125c5600268056bc75e2d63100000613806565b60018301549091506125e0906001600160a01b031682612fc3565b604051632770a7eb60e21b8152306004820152602481018290527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690639dc29fac906044015f604051808303815f87803b158015612645575f5ffd5b505af1158015612657573d5f5f3e3d5ffd5b5050505080600c5f82825461266c9190613779565b90915550506001830180546001600160a01b039081165f908152601a60209081526040808320929092559254815168056bc75e2d63100000815293840185905290830184905288929116907fbcf65737654e7229f3fffa7a8ddf1ca4000e2b39d0c90220e745ccf77b3938259060600160405180910390a350505b600181015460048201546001600160a01b039091169085907f8aa1336152b005ddd3ccc39b5a66ed207555053dd23bc9cff1aab405f6348ea590610100900460ff1680612734575f61273f565b680ad78ebc5ac62000005b60408051921515835260208301919091520160405180910390a35061277060015f516020613be65f395f51905f5255565b505050565b600454600160a01b900460ff16156127a05760405163ab35696f60e01b815260040160405180910390fd5b6127a8612f38565b5f8181526011602052604081205490036127d5576040516303d4572d60e51b815260040160405180910390fd5b5f81815260166020908152604080832033845290915290205460ff161561280f576040516328486b6360e11b815260040160405180910390fd5b5f61281982612ff7565b600581015490915060ff161561284257604051632444f8b760e11b815260040160405180910390fd5b60038101545f61285184611170565b90508034101561287d57604051633ebbc33760e01b8152600481018290523460248201526044016110df565b5f8481526016602090815260408083203384529091528120805460ff19166001908117909155600485018054919290916128b8908490613779565b909155506128c79050826132b0565b60038401555f84815260176020526040812080548392906128e9908490613779565b90915550506001830154612906906001600160a01b031682612f53565b80341115612921576129213361291c833461388f565b612f53565b336001600160a01b0316847f2ee8d21874599264c54876b79bf25eae1b396c3771a178e683a9e038b634f1d78460405161295b9190613a17565b60405180910390a3837f68520cf07e2f785cba8f9601c758232191b84e9f0a8ec7b3049d2dcc197b67fe846003015460405161299991815260200190565b60405180910390a283336001600160a01b03167f424f6c71ca4b96f4b4f4e8e8515b9505cbce4502fd2245d26d4e367265d3a14b8386600401546040516129e1929190613a3f565b60405180910390a350505061116d60015f516020613be65f395f51905f5255565b5f546001600160a01b03163314612a2c576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b038116612a535760405163e6c4247b60e01b815260040160405180910390fd5b600480546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f4ab5be82436d353e61ca18726e984e561f5c1cc7c6d38b29d2553c790434705a905f90a35050565b5f546001600160a01b03163314612ace576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b038116612af55760405163e6c4247b60e01b815260040160405180910390fd5b600180546001600160a01b0319166001600160a01b038381169182179092555f8054604051929316917f38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e227009190a350565b600454600160a01b900460ff1615612b705760405163ab35696f60e01b815260040160405180910390fd5b612b78612f38565b5f818152601160205260408120549003612ba5576040516303d4572d60e51b815260040160405180910390fd5b5f81815260166020908152604080832033845290915290205460ff1615612bdf576040516328486b6360e11b815260040160405180910390fd5b5f612be982612ff7565b600581015490915060ff1615612c1257604051632444f8b760e11b815260040160405180910390fd5b60038101545f612c23600283613806565b90505f612c30828461388f565b9050612c3d333085613219565b604051632770a7eb60e21b8152306004820152602481018390527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690639dc29fac906044015f604051808303815f87803b158015612ca2575f5ffd5b505af1158015612cb4573d5f5f3e3d5ffd5b5050505081600c5f828254612cc99190613779565b90915550506001840154612ce6906001600160a01b031682612fc3565b5f8581526016602090815260408083203384529091528120805460ff1916600190811790915560048601805491929091612d21908490613779565b9250508190555080846006015f828254612d3b9190613779565b90915550612d4a9050836132b0565b6003850155604051339086907f2ee8d21874599264c54876b79bf25eae1b396c3771a178e683a9e038b634f1d790612d83908790613a61565b60405180910390a3847f68520cf07e2f785cba8f9601c758232191b84e9f0a8ec7b3049d2dcc197b67fe8560030154604051612dc191815260200190565b60405180910390a284336001600160a01b03167f424f6c71ca4b96f4b4f4e8e8515b9505cbce4502fd2245d26d4e367265d3a14b858760040154604051612e09929190613a8a565b60405180910390a35050505061116d60015f516020613be65f395f51905f5255565b6005545f90808203612e5057604051630b73274760e11b815260040160405180910390fd5b612e5d6201518082613779565b421115612e8957604051634487756760e11b8152600481018290526201518060248201526044016110df565b5f7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015612ee6573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190612f0a9190613aad565b612f1590600a613bb0565b90508060065485612f2691906137ef565b612f309190613806565b949350505050565b612f4061330e565b60025f516020613be65f395f51905f5255565b5f826001600160a01b0316826040515f6040518083038185875af1925050503d805f8114612f9c576040519150601f19603f3d011682016040523d82523d5f602084013e612fa1565b606091505b505090508061277057604051630db2c7f160e31b815260040160405180910390fd5b611c326001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016838361333f565b5f81815260146020526040902060038101541561301357919050565b5f828152601560205260409020546001600160a01b031680613048576040516361f2aa0160e11b815260040160405180910390fd5b828255600180830180546001600160a01b0319166001600160a01b0393909316929092179091555f92835260116020526040909220909101546002820155681b1ae4d6e2ef500000600382015560058101805460ff1916905590565b6001600160a01b038181165f8181526018602052604080822054905163aaac37a160e01b81526004810193909352909290917f00000000000000000000000000000000000000000000000000000000000000009091169063aaac37a190602401602060405180830381865afa15801561311f573d5f5f3e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061314391906137c4565b6115889190613779565b5f8181526011602052604081206001015481906131749068015af1d78b58c40000906137ef565b9050683635c9adc5dea00000811161158857683635c9adc5dea000006111df565b6001600160a01b0383165f90815260186020526040812054906131b88483613779565b6001600160a01b0386165f818152601860205260409081902083905551919250907f7b750b6736ccb837fea530571f55e8e43f7eeb7bf7f2aadca5b698bd6be22d7a9061320a90859085908890613bbe565b60405180910390a25050505050565b6127706001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016848484613374565b8281602082111561327c576040516350d6487960e11b815260048101839052602060248201526044016110df565b60808111156132a857604051630912bec560e11b815260048101829052608060248201526044016110df565b505050505050565b5f68878678326eac90000082106132d1575068878678326eac900000919050565b5f6132e56802b5e3af16b188000084613779565b905068878678326eac90000081116132fd57806111df565b68878678326eac9000009392505050565b5f516020613be65f395f51905f525460020361333d57604051633ee5aeb560e01b815260040160405180910390fd5b565b61334c83838360016133b0565b61277057604051635274afe760e01b81526001600160a01b03841660048201526024016110df565b613382848484846001613412565b6133aa57604051635274afe760e01b81526001600160a01b03851660048201526024016110df565b50505050565b60405163a9059cbb60e01b5f8181526001600160a01b038616600452602485905291602083604481808b5af1925060015f511483166134065783831516156133fa573d5f823e3d81fd5b5f873b113d1516831692505b60405250949350505050565b6040516323b872dd60e01b5f8181526001600160a01b038781166004528616602452604485905291602083606481808c5af1925060015f5114831661346e578383151615613462573d5f823e3d81fd5b5f883b113d1516831692505b604052505f60605295945050505050565b5f6020828403121561348f575f5ffd5b5035919050565b80356001600160a01b03811681146134ac575f5ffd5b919050565b5f602082840312156134c1575f5ffd5b6111df82613496565b803580151581146134ac575f5ffd5b5f602082840312156134e9575f5ffd5b6111df826134ca565b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b888152876020820152861515604082015285606082015261010060808201525f61354e6101008301876134f2565b82810360a084015261356081876134f2565b6001600160a01b039590951660c0840152505060e001529695505050505050565b5f5f60408385031215613592575f5ffd5b823591506135a260208401613496565b90509250929050565b5f5f604083850312156135bc575f5ffd5b50508035926020909101359150565b5f5f604083850312156135dc575f5ffd5b823591506135a2602084016134ca565b5f5f83601f8401126135fc575f5ffd5b50813567ffffffffffffffff811115613613575f5ffd5b60208301915083602082850101111561362a575f5ffd5b9250929050565b5f5f5f5f5f5f5f5f5f60c08a8c031215613649575f5ffd5b8935985060208a0135975060408a013567ffffffffffffffff81111561366d575f5ffd5b6136798c828d016135ec565b90985096505060608a013567ffffffffffffffff811115613698575f5ffd5b6136a48c828d016135ec565b90965094505060808a013567ffffffffffffffff8111156136c3575f5ffd5b6136cf8c828d016135ec565b90945092506136e2905060a08b016134ca565b90509295985092959850929598565b602080825282518282018190525f918401906040840190835b8181101561372857835183526020938401939092019160010161370a565b509095945050505050565b5f5f5f60608486031215613745575f5ffd5b833592506020840135915061375c604085016134ca565b90509250925092565b634e487b7160e01b5f52601160045260245ffd5b8082018082111561158857611588613765565b600181811c908216806137a057607f821691505b6020821081036137be57634e487b7160e01b5f52602260045260245ffd5b50919050565b5f602082840312156137d4575f5ffd5b5051919050565b634e487b7160e01b5f52603260045260245ffd5b808202811582820484141761158857611588613765565b5f8261382057634e487b7160e01b5f52601260045260245ffd5b500490565b818152604060208201525f6111df60408301600b81526a435245444942494c49545960a81b602082015260400190565b606081525f61387f60608301600b81526a435245444942494c49545960a81b602082015260400190565b6020830194909452506040015290565b8181038181111561158857611588613765565b818382375f9101908152919050565b634e487b7160e01b5f52604160045260245ffd5b601f821115612770578282111561277057805f5260205f20601f840160051c60208510156138f057505f5b90810190601f840160051c035f5b818110156132a8575f838201556001016138fe565b815167ffffffffffffffff81111561392d5761392d6138b1565b6139418161393b845461378c565b846138c5565b6020601f821160018114613973575f831561395c5750848201515b5f19600385901b1c1916600184901b1784556139cb565b5f84815260208120601f198516915b828110156139a25787850151825560209485019460019092019101613982565b50848210156139bf57868401515f19600387901b60f8161c191681555b505060018360011b0184555b5050505050565b858152841515602082015283604082015260806060820152816080820152818360a08301375f81830160a090810191909152601f909201601f19160101949350505050565b818152604060208201525f6111df60408301600381526208aa8960eb1b602082015260400190565b606081525f61387f60608301600381526208aa8960eb1b602082015260400190565b818152604060208201525f6111df604083016004815263212aa92760e11b602082015260400190565b606081525f61387f606083016004815263212aa92760e11b602082015260400190565b5f60208284031215613abd575f5ffd5b815160ff811681146111df575f5ffd5b6001815b6001841115613b0857808504811115613aec57613aec613765565b6001841615613afa57908102905b60019390931c928002613ad1565b935093915050565b5f82613b1e57506001611588565b81613b2a57505f611588565b8160018114613b405760028114613b4a57613b66565b6001915050611588565b60ff841115613b5b57613b5b613765565b50506001821b611588565b5060208310610133831016604e8410600b8410161715613b89575081810a611588565b613b955f198484613acd565b805f1904821115613ba857613ba8613765565b029392505050565b5f6111df60ff841683613b10565b838152826020820152606060408201525f613bdc60608301846134f2565b9594505050505056fe9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00a264697066735822122084422131e1a1c9942b9bfb50d5cfd69d2a2154da993f1f3cbd03bee21207002c64736f6c63430008220033" as const;

export const ghostProtocolArtifact = {
  contractName: ghostProtocolContractName,
  abi: ghostProtocolAbi,
  bytecode: ghostProtocolBytecode,
  deployedBytecode: ghostProtocolDeployedBytecode,
} as const;
