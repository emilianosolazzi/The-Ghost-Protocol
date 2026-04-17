// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IGhostedToken is IERC20 {
    function burn(address from, uint256 amount) external;
    function credibilityScore(address holder) external view returns (uint256);
    function decimals() external view returns (uint8);
    function updateCredibilityScore(address holder, uint256 newScore) external;
}

contract GhostProtocol {
    using SafeERC20 for IERC20;

    struct Evidence {
        uint256 timestamp;
        uint256 weight;
        bool isProxy;
        bytes32 descriptionHash;
        string dramaType;
        address submitter;
        uint256 ghostedRewarded;
    }

    struct LockedStory {
        bytes32 proofHash;
        address submitter;
        uint256 severity;
        uint256 unlockPrice;
        uint256 timesUnlocked;
        bool isPublic;
        uint256 totalEarnedFromUnlocks;
    }

    struct TruthAssertion {
        bytes32 proofHash;
        address assertor;
        bool believesReal;
        uint256 stakeAmount;
        uint256 timestamp;
        bool resolved;
        bool wasCorrect;
    }

    error AlreadyResolved();
    error AlreadyUnlocked();
    error ContractPaused();
    error EvidenceAlreadyExists();
    error InsufficientCredibility(uint256 currentCredibility, uint256 requiredCredibility);
    error InsufficientEth(uint256 requiredAmount, uint256 receivedAmount);
    error InvalidAddress();
    error InvalidAssertionIndex();
    error NotPendingOwner();
    error InvalidProofHash();
    error InvalidSeverity();
    error NotOracle();
    error NotOwner();
    error OnlySubmitter();
    error ReentrancyGuardActive();
    error StoryAlreadyPublic();
    error StoryDoesNotExist();
    error StoryIsPublic();
    error SubmitterNotRecorded();
    error TokenTransferFailed();

    event EvidenceSubmitted(
        bytes32 indexed proofHash,
        address indexed submitter,
        uint256 severity,
        bool isProxy,
        uint256 ghostedRewarded,
        string dramaType
    );
    event GhostingReceiptSubmitted(
        address indexed submitter,
        bytes32 indexed proofHash,
        uint256 feePaid,
        uint256 treasuryCut,
        uint256 protocolCut
    );
    event OracleUpdated(address indexed previousOracle, address indexed newOracle);
    event OwnershipTransferStarted(address indexed previousOwner, address indexed pendingOwner);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event PauseStateUpdated(bool paused);
    event ProtocolFunded(address indexed sender, uint256 amount);
    event StoryMadePublic(bytes32 indexed proofHash, address indexed submitter);
    event StoryUnlocked(bytes32 indexed proofHash, address indexed unlocker, uint256 cost, string method);
    event TreasuryUpdated(address indexed previousTreasury, address indexed newTreasury);
    event TruthAsserted(bytes32 indexed proofHash, address indexed assertor, bool believesReal, uint256 stake);
    event TruthResolved(bytes32 indexed proofHash, address indexed assertor, bool wasCorrect, uint256 reward);
    event UnlockPriceUpdated(bytes32 indexed proofHash, uint256 newPrice);

    uint256 public constant BASE_UNLOCK_PRICE = 500 * 10 ** 18;
    uint256 public constant CREDIBILITY_UNLOCK_THRESHOLD = 1000 * 10 ** 18;
    uint256 public constant GHOSTING_RECEIPT_FEE = 0.0095 ether;
    uint256 public constant MAX_GHOSTED_PER_SUBMISSION = 5_000 * 10 ** 18;
    uint256 public constant TREASURY_SPLIT_BPS = 3_000;
    uint256 public constant BPS_DENOMINATOR = 10_000;
    uint256 public constant TRUTH_ASSERTION_STAKE = 100 * 10 ** 18;
    uint256 public constant TRUTH_WIN_REWARD = 200 * 10 ** 18;

    IGhostedToken public immutable ghostedToken;

    address public owner;
    address public pendingOwner;
    address public oracle;
    address public treasury;
    bool public paused;

    uint256 public evidenceCounter;
    uint256 public directEvidenceCount;
    uint256 public proxyEvidenceCount;
    uint256 public truthAssertionCount;
    uint256 public totalGhostedRewarded;
    uint256 public totalGhostedBurned;
    uint256 public totalRevenueCollected;
    uint256 public totalTreasuryDistributed;
    uint256 public totalProtocolRevenue;

    mapping(bytes32 => Evidence) private _evidenceLog;
    mapping(bytes32 => TruthAssertion[]) private _truthAssertions;
    bytes32[] private _submittedProofHashes;

    mapping(bytes32 => LockedStory) public lockedStories;
    mapping(bytes32 => address) public evidenceSubmitter;
    mapping(bytes32 => mapping(address => bool)) public hasUnlockedStory;
    mapping(bytes32 => uint256) public storyEthEarnings;
    mapping(address => uint256) public totalTruthWins;
    mapping(address => uint256) public truthWinStreak;

    uint256 private _reentrancyStatus = 1;

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyOracle() {
        if (msg.sender != oracle) revert NotOracle();
        _;
    }

    modifier whenNotPaused() {
        if (paused) revert ContractPaused();
        _;
    }

    modifier nonReentrant() {
        if (_reentrancyStatus != 1) revert ReentrancyGuardActive();
        _reentrancyStatus = 2;
        _;
        _reentrancyStatus = 1;
    }

    constructor(address ghostedTokenAddress, address treasuryAddress, address oracleAddress) {
        if (ghostedTokenAddress == address(0) || treasuryAddress == address(0) || oracleAddress == address(0)) {
            revert InvalidAddress();
        }

        ghostedToken = IGhostedToken(ghostedTokenAddress);
        owner = msg.sender;
        treasury = treasuryAddress;
        oracle = oracleAddress;
    }

    receive() external payable {
        emit ProtocolFunded(msg.sender, msg.value);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidAddress();
        pendingOwner = newOwner;
        emit OwnershipTransferStarted(owner, newOwner);
    }

    function acceptOwnership() external {
        if (msg.sender != pendingOwner) revert NotPendingOwner();
        address previousOwner = owner;
        owner = msg.sender;
        pendingOwner = address(0);
        emit OwnershipTransferred(previousOwner, msg.sender);
    }

    function setOracle(address newOracle) external onlyOwner {
        if (newOracle == address(0)) revert InvalidAddress();
        address previousOracle = oracle;
        oracle = newOracle;
        emit OracleUpdated(previousOracle, newOracle);
    }

    function setTreasury(address newTreasury) external onlyOwner {
        if (newTreasury == address(0)) revert InvalidAddress();
        address previousTreasury = treasury;
        treasury = newTreasury;
        emit TreasuryUpdated(previousTreasury, newTreasury);
    }

    function setPaused(bool nextPaused) external onlyOwner {
        paused = nextPaused;
        emit PauseStateUpdated(nextPaused);
    }

    function submitEvidence(
        bytes32 proofHash,
        uint256 severity,
        string calldata description,
        string calldata dramaType,
        bool isProxy
    ) external payable whenNotPaused nonReentrant {
        if (proofHash == bytes32(0)) revert InvalidProofHash();
        if (severity == 0 || severity > 100) revert InvalidSeverity();
        if (_evidenceLog[proofHash].timestamp != 0) revert EvidenceAlreadyExists();
        if (msg.value < GHOSTING_RECEIPT_FEE) revert InsufficientEth(GHOSTING_RECEIPT_FEE, msg.value);

        uint256 overpayment = msg.value - GHOSTING_RECEIPT_FEE;
        uint256 treasuryCut = (GHOSTING_RECEIPT_FEE * TREASURY_SPLIT_BPS) / BPS_DENOMINATOR;
        uint256 protocolCut = GHOSTING_RECEIPT_FEE - treasuryCut;
        uint256 ghostedReward = 0;

        totalRevenueCollected += GHOSTING_RECEIPT_FEE;
        totalTreasuryDistributed += treasuryCut;
        totalProtocolRevenue += protocolCut;
        evidenceCounter += 1;

        if (!isProxy) {
            directEvidenceCount += 1;
            truthAssertionCount += 1;
            ghostedReward = severity * 50 * 10 ** 18;
            if (ghostedReward > MAX_GHOSTED_PER_SUBMISSION) {
                ghostedReward = MAX_GHOSTED_PER_SUBMISSION;
            }
            totalGhostedRewarded += ghostedReward;
            _safeTokenTransfer(msg.sender, ghostedReward);
        } else {
            proxyEvidenceCount += 1;
        }

        _evidenceLog[proofHash] = Evidence({
            timestamp: block.timestamp,
            weight: severity,
            isProxy: isProxy,
            descriptionHash: keccak256(bytes(description)),
            dramaType: dramaType,
            submitter: msg.sender,
            ghostedRewarded: ghostedReward
        });

        evidenceSubmitter[proofHash] = msg.sender;
        _submittedProofHashes.push(proofHash);
        _ensureStoryInitialized(proofHash);

        if (treasuryCut > 0) {
            _safeTransferETH(treasury, treasuryCut);
        }

        if (overpayment > 0) {
            _safeTransferETH(msg.sender, overpayment);
        }

        emit EvidenceSubmitted(proofHash, msg.sender, severity, isProxy, ghostedReward, dramaType);
        emit GhostingReceiptSubmitted(msg.sender, proofHash, GHOSTING_RECEIPT_FEE, treasuryCut, protocolCut);
    }

    function unlockStoryByBurn(bytes32 proofHash) external whenNotPaused nonReentrant {
        if (_evidenceLog[proofHash].timestamp == 0) revert StoryDoesNotExist();
        if (hasUnlockedStory[proofHash][msg.sender]) revert AlreadyUnlocked();

        LockedStory storage story = _ensureStoryInitialized(proofHash);
        if (story.isPublic) revert StoryIsPublic();

        uint256 currentPrice = story.unlockPrice;
        uint256 burnedAmount = currentPrice / 2;
        uint256 submitterShare = currentPrice - burnedAmount;

        _safeTokenTransferFrom(msg.sender, address(this), currentPrice);
        ghostedToken.burn(address(this), burnedAmount);
        totalGhostedBurned += burnedAmount;
        _safeTokenTransfer(story.submitter, submitterShare);

        hasUnlockedStory[proofHash][msg.sender] = true;
        story.timesUnlocked += 1;
        story.totalEarnedFromUnlocks += submitterShare;
        story.unlockPrice = currentPrice + (currentPrice * story.timesUnlocked) / 1_000;

        emit StoryUnlocked(proofHash, msg.sender, currentPrice, "BURN");
        emit UnlockPriceUpdated(proofHash, story.unlockPrice);
    }

    function unlockStoryByCredibility(bytes32 proofHash) external whenNotPaused {
        if (_evidenceLog[proofHash].timestamp == 0) revert StoryDoesNotExist();
        if (hasUnlockedStory[proofHash][msg.sender]) revert AlreadyUnlocked();

        LockedStory storage story = _ensureStoryInitialized(proofHash);
        if (story.isPublic) revert StoryIsPublic();

        uint256 myCredibility = ghostedToken.credibilityScore(msg.sender);
        uint256 requiredCredibility = _evidenceLog[proofHash].weight * 10 ** 16;

        if (myCredibility < requiredCredibility) {
            revert InsufficientCredibility(myCredibility, requiredCredibility);
        }

        if (myCredibility < CREDIBILITY_UNLOCK_THRESHOLD) {
            revert InsufficientCredibility(myCredibility, CREDIBILITY_UNLOCK_THRESHOLD);
        }

        hasUnlockedStory[proofHash][msg.sender] = true;

        uint256 credibilityBoost = (requiredCredibility * 5) / 100;
        ghostedToken.updateCredibilityScore(msg.sender, myCredibility + credibilityBoost);

        emit StoryUnlocked(proofHash, msg.sender, 0, "CREDIBILITY");
    }

    function assertTruth(bytes32 proofHash, bool believesReal) external whenNotPaused nonReentrant {
        if (_evidenceLog[proofHash].timestamp == 0) revert StoryDoesNotExist();

        _safeTokenTransferFrom(msg.sender, address(this), TRUTH_ASSERTION_STAKE);

        _truthAssertions[proofHash].push(TruthAssertion({
            proofHash: proofHash,
            assertor: msg.sender,
            believesReal: believesReal,
            stakeAmount: TRUTH_ASSERTION_STAKE,
            timestamp: block.timestamp,
            resolved: false,
            wasCorrect: false
        }));

        emit TruthAsserted(proofHash, msg.sender, believesReal, TRUTH_ASSERTION_STAKE);
    }

    function resolveTruth(bytes32 proofHash, uint256 assertionIndex, bool isActuallyReal) external onlyOracle whenNotPaused nonReentrant {
        if (assertionIndex >= _truthAssertions[proofHash].length) revert InvalidAssertionIndex();

        TruthAssertion storage assertion = _truthAssertions[proofHash][assertionIndex];
        if (assertion.resolved) revert AlreadyResolved();

        assertion.resolved = true;
        assertion.wasCorrect = (assertion.believesReal == isActuallyReal);

        if (assertion.wasCorrect) {
            _safeTokenTransfer(assertion.assertor, TRUTH_WIN_REWARD);
            totalGhostedRewarded += TRUTH_WIN_REWARD;
            truthWinStreak[assertion.assertor] += 1;
            totalTruthWins[assertion.assertor] += 1;

            uint256 currentCredibility = ghostedToken.credibilityScore(assertion.assertor);
            ghostedToken.updateCredibilityScore(assertion.assertor, currentCredibility + (100 * 10 ** 18));
        } else {
            LockedStory storage story = _ensureStoryInitialized(proofHash);
            uint256 halfStake = TRUTH_ASSERTION_STAKE / 2;
            _safeTokenTransfer(story.submitter, halfStake);
            ghostedToken.burn(address(this), halfStake);
            totalGhostedBurned += halfStake;
            truthWinStreak[assertion.assertor] = 0;
        }

        emit TruthResolved(
            proofHash,
            assertion.assertor,
            assertion.wasCorrect,
            assertion.wasCorrect ? TRUTH_WIN_REWARD : 0
        );
    }

    function makeStoryPublic(bytes32 proofHash) external whenNotPaused {
        if (_evidenceLog[proofHash].timestamp == 0) revert StoryDoesNotExist();

        LockedStory storage story = _ensureStoryInitialized(proofHash);
        if (msg.sender != story.submitter) revert OnlySubmitter();
        if (story.isPublic) revert StoryAlreadyPublic();

        story.isPublic = true;
        emit StoryMadePublic(proofHash, msg.sender);
    }

    function unlockStoryWithETH(bytes32 proofHash) external payable whenNotPaused nonReentrant {
        if (_evidenceLog[proofHash].timestamp == 0) revert StoryDoesNotExist();
        if (hasUnlockedStory[proofHash][msg.sender]) revert AlreadyUnlocked();

        LockedStory storage story = _ensureStoryInitialized(proofHash);
        if (story.isPublic) revert StoryIsPublic();

        uint256 currentPrice = story.unlockPrice;
        uint256 ethPrice = previewUnlockPriceInEth(proofHash);
        if (msg.value < ethPrice) revert InsufficientEth(ethPrice, msg.value);

        hasUnlockedStory[proofHash][msg.sender] = true;
        story.timesUnlocked += 1;
        story.unlockPrice = currentPrice + (currentPrice * story.timesUnlocked) / 1_000;
        storyEthEarnings[proofHash] += ethPrice;

        _safeTransferETH(story.submitter, ethPrice);

        if (msg.value > ethPrice) {
            _safeTransferETH(msg.sender, msg.value - ethPrice);
        }

        emit StoryUnlocked(proofHash, msg.sender, currentPrice, "ETH");
        emit UnlockPriceUpdated(proofHash, story.unlockPrice);
    }

    function getProtocolStats()
        external
        view
        returns (
            uint256 totalEvidence,
            uint256 directEvidence,
            uint256 proxyEvidence,
            uint256 totalTruthAssertions,
            uint256 rewardedGhosted,
            uint256 burnedGhosted,
            uint256 revenueCollected,
            uint256 treasuryDistributed,
            uint256 protocolRevenue,
            bool gaslightUnlocked,
            bool isPaused
        )
    {
        return (
            evidenceCounter,
            directEvidenceCount,
            proxyEvidenceCount,
            truthAssertionCount,
            totalGhostedRewarded,
            totalGhostedBurned,
            totalRevenueCollected,
            totalTreasuryDistributed,
            totalProtocolRevenue,
            evidenceCounter >= 10,
            paused
        );
    }

    function getEvidence(bytes32 proofHash)
        external
        view
        returns (
            uint256 timestamp,
            uint256 weight,
            bool isProxy,
            bytes32 descriptionHash,
            string memory dramaType,
            address submitter,
            uint256 ghostedRewarded
        )
    {
        Evidence storage evidence = _evidenceLog[proofHash];
        return (
            evidence.timestamp,
            evidence.weight,
            evidence.isProxy,
            evidence.descriptionHash,
            evidence.dramaType,
            evidence.submitter,
            evidence.ghostedRewarded
        );
    }

    function getStoryUnlockInfo(bytes32 proofHash)
        external
        view
        returns (
            uint256 unlockPriceTokens,
            uint256 timesUnlocked,
            bool isPublic,
            uint256 totalEarned,
            address submitter,
            uint256 severity
        )
    {
        if (_evidenceLog[proofHash].timestamp == 0) revert StoryDoesNotExist();

        LockedStory storage story = lockedStories[proofHash];
        address submitterAddress = story.submitter != address(0) ? story.submitter : evidenceSubmitter[proofHash];
        uint256 storySeverity = story.severity != 0 ? story.severity : _evidenceLog[proofHash].weight;

        return (
            story.unlockPrice == 0 ? BASE_UNLOCK_PRICE : story.unlockPrice,
            story.timesUnlocked,
            story.isPublic,
            story.totalEarnedFromUnlocks,
            submitterAddress,
            storySeverity
        );
    }

    function getStoryPayoutInfo(bytes32 proofHash)
        external
        view
        returns (uint256 tokenPayouts, uint256 ethPayouts, uint256 currentEthUnlockPrice)
    {
        if (_evidenceLog[proofHash].timestamp == 0) revert StoryDoesNotExist();

        LockedStory storage story = lockedStories[proofHash];
        uint256 unlockPrice = story.unlockPrice == 0 ? BASE_UNLOCK_PRICE : story.unlockPrice;
        return (story.totalEarnedFromUnlocks, storyEthEarnings[proofHash], _convertTokensToETH(unlockPrice));
    }

    function getTruthAssertion(bytes32 proofHash, uint256 assertionIndex)
        external
        view
        returns (
            bytes32 assertionProofHash,
            address assertor,
            bool believesReal,
            uint256 stakeAmount,
            uint256 timestamp,
            bool resolved,
            bool wasCorrect
        )
    {
        if (assertionIndex >= _truthAssertions[proofHash].length) revert InvalidAssertionIndex();

        TruthAssertion storage assertion = _truthAssertions[proofHash][assertionIndex];
        return (
            assertion.proofHash,
            assertion.assertor,
            assertion.believesReal,
            assertion.stakeAmount,
            assertion.timestamp,
            assertion.resolved,
            assertion.wasCorrect
        );
    }

    function getTruthAssertionCount(bytes32 proofHash) external view returns (uint256) {
        return _truthAssertions[proofHash].length;
    }

    function hasUserUnlockedStory(bytes32 proofHash, address user) external view returns (bool) {
        return hasUnlockedStory[proofHash][user];
    }

    function canUserAccessStory(bytes32 proofHash, address user) external view returns (bool) {
        if (_evidenceLog[proofHash].timestamp == 0) revert StoryDoesNotExist();
        return lockedStories[proofHash].isPublic || hasUnlockedStory[proofHash][user];
    }

    function submittedProofHashesCount() external view returns (uint256) {
        return _submittedProofHashes.length;
    }

    function getSubmittedProofHashes(uint256 cursor, uint256 limit) external view returns (bytes32[] memory proofHashes) {
        uint256 total = _submittedProofHashes.length;
        if (cursor >= total || limit == 0) {
            return new bytes32[](0);
        }

        uint256 remaining = total - cursor;
        uint256 size = remaining < limit ? remaining : limit;
        proofHashes = new bytes32[](size);

        for (uint256 index = 0; index < size; index++) {
            proofHashes[index] = _submittedProofHashes[cursor + index];
        }
    }

    function previewUnlockPriceInEth(bytes32 proofHash) public view returns (uint256) {
        if (_evidenceLog[proofHash].timestamp == 0) revert StoryDoesNotExist();
        uint256 unlockPrice = lockedStories[proofHash].unlockPrice == 0
            ? BASE_UNLOCK_PRICE
            : lockedStories[proofHash].unlockPrice;
        return _convertTokensToETH(unlockPrice);
    }

    function _ensureStoryInitialized(bytes32 proofHash) internal returns (LockedStory storage story) {
        story = lockedStories[proofHash];
        if (story.unlockPrice != 0) {
            return story;
        }

        address submitter = evidenceSubmitter[proofHash];
        if (submitter == address(0)) revert SubmitterNotRecorded();

        story.proofHash = proofHash;
        story.submitter = submitter;
        story.severity = _evidenceLog[proofHash].weight;
        story.unlockPrice = BASE_UNLOCK_PRICE;
        story.isPublic = false;
    }

    function _safeTokenTransfer(address to, uint256 amount) internal {
        IERC20(address(ghostedToken)).safeTransfer(to, amount);
    }

    function _safeTokenTransferFrom(address from, address to, uint256 amount) internal {
        IERC20(address(ghostedToken)).safeTransferFrom(from, to, amount);
    }

    function _safeTransferETH(address to, uint256 amount) internal {
        (bool success, ) = to.call{value: amount}("");
        if (!success) revert TokenTransferFailed();
    }

    function _convertTokensToETH(uint256 tokenAmount) internal view returns (uint256) {
        uint256 tokenUnit = 10 ** ghostedToken.decimals();
        return (tokenAmount * 10 ** 12) / tokenUnit;
    }
}