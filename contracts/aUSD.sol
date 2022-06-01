//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";
import "./LiminalMarket.sol";

contract aUSD is Initializable, ERC20Upgradeable, PausableUpgradeable, AccessControlUpgradeable, UUPSUpgradeable {

    LiminalMarket private liminalMarketContract;

    bytes32 public constant SET_BALANCE = keccak256("SET_BALANCE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    event BalanceSet(address recipient, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() external initializer  {
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

	function setBalance(address recipient, uint256 amount) external onlyRole(SET_BALANCE) whenNotPaused returns (uint256) {
		uint256 balance = balanceOf(recipient);
        if (amount == balance) return amount;
        if (amount > balance) {
            _mint(recipient, amount - balance);
        } else {
            _burn(recipient, balance - amount);
        }
        uint balanceAfter = balanceOf(recipient);
        require(balanceAfter == amount, "Wrong calculation");

        emit BalanceSet(recipient, amount);
		return balanceAfter;
	}

    function transfer(address recipient, uint256 amount)
    public
        virtual
        whenNotPaused
        override
        returns (bool)
    {
		return liminalMarketContract.buyWithAUsd(msg.sender, recipient, amount);
	}

    function allowance(address, address)
    public
        view
        virtual
        whenNotPaused
        override
        returns (uint256)
    {
        require(false, "No need for allowance");
        return 0;
    }

    function approve(address, uint256)
    public
        virtual
        whenNotPaused
        override
        returns (bool)
    {
        require(false, "No need for approve");
        return false;
    }

    function transferFrom(
        address,
        address,
        uint256
    ) public
        virtual
        override whenNotPaused returns (bool) {
			require(false, "This token cannot be transfered");
            return false;
		}

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
    internal
    whenNotPaused
    override
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    function _authorizeUpgrade(address newImplementation)
    internal
    onlyRole(UPGRADER_ROLE)
    onlyProxy
    override
    {
        _upgradeTo(newImplementation);
    }
}
