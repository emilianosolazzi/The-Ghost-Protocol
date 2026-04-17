export const ghostProtocolUiConstants = {
  baseUnlockPrice: 500n * 10n ** 18n,
  credibilityUnlockThreshold: 1_000n * 10n ** 18n,
  receiptFeeEth: 95n * 10n ** 14n,
  receiptRewardMultiplier: 50n,
  maxGhostedPerSubmission: 5_000n * 10n ** 18n,
  treasurySplitBps: 3_000n,
  bpsDenominator: 10_000n,
  truthAssertionStake: 100n * 10n ** 18n,
  truthWinReward: 200n * 10n ** 18n,
} as const;