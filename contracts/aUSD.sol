//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.16;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "./LiminalMarket.sol";

contract aUSD is Initializable, ERC20Upgradeable, PausableUpgradeable, AccessControlUpgradeable, UUPSUpgradeable {

    LiminalMarket private liminalMarketContract;

    bytes32 public constant SET_BALANCE = keccak256("SET_BALANCE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    event BalanceSet(address recipient, uint256 balance, Action action);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {
    }

    function initialize() external initializer {
        __ERC20_init("USD at Broker", "aUSD");
        __Pausable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
        _grantRole(SET_BALANCE, msg.sender);
    }


    function setLiminalMarketAddress(address liminalMarketAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
        liminalMarketContract = LiminalMarket(liminalMarketAddress);
    }

    function grantRoleForBalance(address recipient) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(SET_BALANCE, recipient);
    }

    function revokeRoleForBalance(address recipient) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(SET_BALANCE, recipient);
    }

    function setBalance(address recipient, uint256 balance, Action action) external onlyRole(SET_BALANCE) whenNotPaused {
        uint256 currentBalance = balanceOf(recipient);
        if (balance == currentBalance) return;

        if (balance > currentBalance) {
            _mint(recipient, balance - currentBalance);
        } else {
            _burn(recipient, currentBalance - balance);
        }

        emit BalanceSet(recipient, balance, action);
    }

    function transfer(address to, uint256 amount) public virtual whenNotPaused override returns (bool) {
        liminalMarketContract.buyWithAUsd(msg.sender, to, amount, address(0));
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public virtual override whenNotPaused returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);

        liminalMarketContract.buyWithAUsd(from, to, amount, spender);
        return true;
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _authorizeUpgrade(address newImplementation) internal onlyRole(UPGRADER_ROLE) onlyProxy override
    {
        _upgradeTo(newImplementation);
    }
}