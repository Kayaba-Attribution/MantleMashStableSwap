// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";

contract MantleCash is
    ERC20,
    ERC20Burnable,
    Pausable,
    AccessControl,
    ERC20FlashMint
{
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    mapping(address => uint256) public lastClaimTime;
    mapping(address => uint256) public totalClaimed;
    uint256 public constant MAX_CLAIM_PER_DAY = 1000 ether;
    uint256 public constant DAY_IN_SECONDS = 86400;

    constructor() ERC20("MantleCash", "MCASH") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _mint(msg.sender, 2_000_000 * 10**decimals());
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function drip() public {
        require(
            block.timestamp - lastClaimTime[msg.sender] >= DAY_IN_SECONDS,
            "Already claimed today"
        );

        lastClaimTime[msg.sender] = block.timestamp;

        _mint(msg.sender, MAX_CLAIM_PER_DAY);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
