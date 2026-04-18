// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import { ERC20Permit } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import { Ownable2Step, Ownable } from "@openzeppelin/contracts/access/Ownable2Step.sol";

/**
 * @title GhostedToken ($GHOSTED)
 * @notice The native ERC-20 for GhostProtocol.
 *
 *  Supply: 1,000,000,000 (1 B) — fixed, no minting after deploy.
 *  Burn:   The GhostProtocol contract can burn tokens from its own balance
 *          (unlock-by-burn, wrong truth-stake slashing).
 *  Cred:   The protocol can write on-chain credibility scores per holder.
 *  Permit: EIP-2612 gasless approvals built in.
 *
 *  Ownership uses Ownable2Step so a fat-finger `transferOwnership` can't
 *  brick the admin (new owner must accept).
 */
contract GhostedToken is ERC20, ERC20Burnable, ERC20Permit, Ownable2Step {
    // ── Errors ────────────────────────────────────────────────────────────
    error InvalidAddress();
    error NotProtocol();
    error ProtocolAlreadyLocked();

    // ── Events ────────────────────────────────────────────────────────────
    event ProtocolSet(address indexed protocol);
    event ProtocolLocked(address indexed protocol);
    event CredibilityUpdated(address indexed holder, uint256 oldScore, uint256 newScore);

    // ── State ─────────────────────────────────────────────────────────────
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10 ** 18; // 1 B tokens

    address public protocol;
    bool public protocolLocked;
    mapping(address => uint256) public credibilityScore;

    // ── Constructor ───────────────────────────────────────────────────────
    constructor(address initialHolder)
        ERC20("GHOSTED", "GHOSTED")
        ERC20Permit("GHOSTED")
        Ownable(initialHolder)
    {
        if (initialHolder == address(0)) revert InvalidAddress();
        _mint(initialHolder, TOTAL_SUPPLY);
    }

    // ── Protocol management ───────────────────────────────────────────────
    /**
     * @notice Set the GhostProtocol contract address.  Can be called
     *         multiple times until `lockProtocol()` is called.
     */
    function setProtocol(address newProtocol) external onlyOwner {
        if (protocolLocked) revert ProtocolAlreadyLocked();
        if (newProtocol == address(0)) revert InvalidAddress();
        protocol = newProtocol;
        emit ProtocolSet(newProtocol);
    }

    /**
     * @notice Permanently lock the protocol address. Irreversible.
     */
    function lockProtocol() external onlyOwner {
        if (protocol == address(0)) revert InvalidAddress();
        protocolLocked = true;
        emit ProtocolLocked(protocol);
    }

    // ── IGhostedToken interface (called by GhostProtocol) ─────────────────
    /**
     * @notice Burn `amount` tokens held by `from`. Only callable by the
     *         registered GhostProtocol contract.
     */
    function burn(address from, uint256 amount) external {
        if (msg.sender != protocol) revert NotProtocol();
        _burn(from, amount);
    }

    /**
     * @notice Update a holder's credibility score. Only callable by the
     *         registered GhostProtocol contract.
     */
    function updateCredibilityScore(address holder, uint256 newScore) external {
        if (msg.sender != protocol) revert NotProtocol();
        uint256 oldScore = credibilityScore[holder];
        credibilityScore[holder] = newScore;
        emit CredibilityUpdated(holder, oldScore, newScore);
    }
}
