//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.16;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "hardhat/console.sol";

import "./SecurityToken.sol";
import "./MarketCalendar.sol";
import "./ServiceSettings.sol";

contract StakingPool is Initializable, PausableUpgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    ServiceSettings serviceSettings;
    LiminalMarket liminalMarket;

    enum Status{STAKED, MARGIN_CALL, RELEASE}

    //walletAddress => symbol => StakingInfo
    mapping(address => mapping(string => StakingInfo)) public stakings;
    mapping(address => string[]) public symbols;

    struct StakingInfo {
        address service;
        uint quantity;
        Status status;
    }

    event Staked(address wallet, string symbol, uint quantity, uint totalStakedQuantity, address service);
    event Unstaked(address wallet, string symbol, uint quantity, uint totalStakedQuantity, address service);
    event Liquidate(address wallet, string symbol, uint quantity, address service);
    event Liquidated(address wallet, string symbol, address service);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() external initializer {
        __Pausable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
    }

    function setAddresses(address liminalMarketAddress, address serviceSettingsAddress) onlyRole(DEFAULT_ADMIN_ROLE) public {
        liminalMarket = LiminalMarket(liminalMarketAddress);
        serviceSettings = ServiceSettings(serviceSettingsAddress);
    }

    function getStakingInfo(address wallet, string memory symbol) public view returns (StakingInfo memory) {
        return stakings[wallet][symbol];
    }

    function getSymbols(address wallet) public view returns (string[] memory) {
        return symbols[wallet];
    }

    function canSellSymbol(address wallet, string memory symbol, uint balance, uint quantityToSell) public view returns (bool) {
        if (stakings[wallet][symbol].quantity == 0) return true;
        if (stakings[wallet][symbol].quantity > (balance - quantityToSell)) return false;
        return true;
    }


    function stake(address wallet, string memory symbol, uint quantity) public {
        address serviceInfo = serviceSettings.getService(msg.sender);
        require(serviceInfo != address(0), "You don't have service contract and cannot stake");

        address symbolAddress = liminalMarket.getSecurityToken(symbol);
        require(symbolAddress != address(0), "Symbol couldn't be found");

        SecurityToken securityToken = SecurityToken(symbolAddress);
        require(securityToken.allowance(wallet, msg.sender) >= quantity, "Service doesn't have allowance");
        console.log("1");
        require(stakings[wallet][symbol].service == msg.sender || stakings[wallet][symbol].service == address(0), "Symbol already staked with another service");
        console.log("2");
        uint balance = securityToken.balanceOf(wallet);
        console.log("3 balance:", balance);
        uint availableQtyToStake = balance - stakings[wallet][symbol].quantity;
        console.log("4 availableQtyToStake:", availableQtyToStake);
        console.log("5 quantity:", quantity);

        require(availableQtyToStake >= quantity, "Don't have enough qty to stake");

        console.log("6 service:", stakings[wallet][symbol].service);

        if (stakings[wallet][symbol].service == address(0)) {
            stakings[wallet][symbol] = StakingInfo(msg.sender, quantity, Status.STAKED);
            symbols[wallet].push(symbol);
        } else {
            stakings[wallet][symbol].quantity += quantity;
        }
        console.log('Staked wallet', wallet);
        console.log('symbol', symbol);
        console.log('quantity', quantity);
        console.log('total quantity', stakings[wallet][symbol].quantity);
        console.log('sender', msg.sender);
        emit Staked(wallet, symbol, quantity, stakings[wallet][symbol].quantity, msg.sender);
    }

    function unstake(address wallet, string memory symbol, uint quantity) public {
        address serviceInfo = serviceSettings.getService(msg.sender);
        require(serviceInfo != address(0), "You don't have service contract and cannot stake");
        require(stakings[wallet][symbol].service == msg.sender, "Service doesn't have anything staked");
        require(stakings[wallet][symbol].quantity >= quantity, "Quantity staked is not enough");

        stakings[wallet][symbol].quantity -= quantity;
        if (stakings[wallet][symbol].quantity == 0) {
            delete stakings[wallet][symbol].quantity;
        }
        console.log('Unstaked wallet', wallet);
        console.log('symbol', symbol);
        console.log('quantity', quantity);
        console.log('totalStaked', stakings[wallet][symbol].quantity);
        console.log('sender', msg.sender);
        emit Unstaked(wallet, symbol, quantity, stakings[wallet][symbol].quantity, msg.sender);
    }

    function liquidate(address wallet) public {
        address serviceInfo = serviceSettings.getService(msg.sender);
        require(serviceInfo != address(0), "You don't have service contract and cannot stake");

        string[] memory symbolsArray = getSymbols(wallet);
        for (uint i = 0; i < symbolsArray.length; i++) {
            if (stakings[wallet][symbolsArray[i]].service == msg.sender) {
                //console.log('Liquidate wallet', wallet, symbolsArray[i], stakings[wallet][symbolsArray[i]].quantity, msg.sender);
                emit Liquidate(wallet, symbolsArray[i], stakings[wallet][symbolsArray[i]].quantity, msg.sender);
            }
        }
    }

    function liquidated(address wallet, string memory symbol, address service) public {
        delete stakings[wallet][symbol];
        console.log('Liquidated wallet', wallet);
        console.log('symbol', symbol);
        console.log('service', service);
        emit Liquidated(wallet, symbol, service);
    }


    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _authorizeUpgrade(address newImplementation) internal onlyRole(UPGRADER_ROLE) onlyProxy override {
        _upgradeTo(newImplementation);
    }
}