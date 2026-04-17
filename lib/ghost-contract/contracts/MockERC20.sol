// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockERC20
 * @dev Mock ERC20 token for testing
 */
contract MockERC20 is ERC20, ERC20Burnable, Ownable {
    error InvalidProtocol();
    error NotProtocol();

    address public protocol;
    mapping(address => uint256) public credibilityScore;

    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }

    function setProtocol(address newProtocol) external onlyOwner {
        if (newProtocol == address(0)) revert InvalidProtocol();
        protocol = newProtocol;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        if (msg.sender != protocol) revert NotProtocol();
        _burn(from, amount);
    }

    function updateCredibilityScore(address holder, uint256 newScore) external {
        if (msg.sender != protocol) revert NotProtocol();
        credibilityScore[holder] = newScore;
    }

    function seedCredibilityScore(address holder, uint256 newScore) external onlyOwner {
        credibilityScore[holder] = newScore;
    }
}
