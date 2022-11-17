//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.16;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "./SecurityToken.sol";
import "./aUSD.sol";
import "./KYC.sol";
import "./MarketCalendar.sol";
import "./StakingPool.sol";

contract LiminalMarket is Initializable, PausableUpgradeable, AccessControlUpgradeable, UUPSUpgradeable {

    aUSD public aUsdContract;
    KYC public kycContract;
    MarketCalendar public marketCalendarContract;

    mapping(string => address) public securityTokens;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    string public constant MARKET_CLOSED = "Market is closed";
    string public constant NOT_ENOUGH_AUSD = "You don't have enough aUSD";
    string public constant ONLY_SEND_TO_AUSD = "You can only send to aUSD token";
    string public constant NOT_VALID_TOKEN_ADDRESS = "This is not valid token address";
    string public constant QUANTITY_MORE_THEN_BALANCE = "Quantity cannot be larger then balance";
    string public constant ADDRESS_CANNOT_BE_ZERO = "Address cannot be zero";
    string public constant ONLY_AUSD_CAN_CALL_ME = "Only aUSD contract can call me";
    string public constant SYMBOL_CANNOT_BE_EMPTY = "Symbol cannot be empty";
    string public constant TOKEN_ALREADY_EXISTS = "Security token already exists";
    string public constant TOKEN_NAME = "Liminal.market symbol";

    event TokenCreated(address tokenAddress, string symbol);
    event BuyWithAUsd(address walletAddress, uint amount, string accountId, string symbol, address tokenAddress, address spender);
    event SellSecurityToken(string accountId, address walletAddress, address aUsdAddress, string symbol, uint amount, address spender);
    event OrderExecuted(address recipient, string symbol, uint tsl,
        uint filledQty, uint filledAvgPrice, string side, uint filledAt,
        uint commission, uint aUsdBalance, address spender);
    event OrderFailed(address recipient, string symbol, uint buyingPower, string message, address spender);

    StakingPool public stakingPoolContract;


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

    function setAddresses(aUSD aUsdAddress, KYC kycAddress, MarketCalendar marketCalendarAddress, StakingPool stakingPoolAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
        aUsdContract = aUsdAddress;
        kycContract = kycAddress;
        marketCalendarContract = marketCalendarAddress;
        stakingPoolContract = stakingPoolAddress;
    }

    function getSecurityToken(string memory symbol) public view returns (address) {
        return securityTokens[symbol];
    }

    function buyWithAUsd(address walletAddress, address tokenAddress, uint256 amount, address spender) external whenNotPaused {
        require(msg.sender == address(aUsdContract), ONLY_AUSD_CAN_CALL_ME);
        require(marketCalendarContract.isMarketOpen(), MARKET_CLOSED);

        uint256 ausdBalance = aUsdContract.balanceOf(walletAddress);
        require(ausdBalance >= amount, NOT_ENOUGH_AUSD);

        string memory accountId = kycContract.isValid(walletAddress);

        SecurityToken securityToken = SecurityToken(tokenAddress);
        require(securityToken.owner() == address(this), NOT_VALID_TOKEN_ADDRESS);

        string memory symbol = securityToken.symbol();
        if (spender == address(0)) spender = address(this);

        emit BuyWithAUsd(walletAddress, amount, accountId, symbol, tokenAddress, spender);
        aUsdContract.setBalance(walletAddress, ausdBalance - amount, Action.OrderBuy);
    }

    function sellSecurityToken(address walletAddress, address aUsdAddress, string memory symbol, uint quantity, address spender) external whenNotPaused {
        require(aUsdAddress == address(aUsdContract), ONLY_SEND_TO_AUSD);
        require(marketCalendarContract.isMarketOpen(), MARKET_CLOSED);
        require(getSecurityToken(symbol) == msg.sender, NOT_VALID_TOKEN_ADDRESS);

        string memory accountId = kycContract.isValid(walletAddress);

        SecurityToken token = SecurityToken(msg.sender);
        uint balance = token.balanceOf(walletAddress);
        require(balance >= quantity, QUANTITY_MORE_THEN_BALANCE);
        require(stakingPoolContract.canSellSymbol(walletAddress, symbol, balance, quantity), "Token is staked");

        if (spender == address(0)) spender = address(this);

        emit SellSecurityToken(accountId, walletAddress, aUsdAddress, symbol, quantity, spender);
        token.setBalance(walletAddress, balance - quantity, Action.OrderSell);
    }

    function orderExecuted(address recipient, string memory symbol,
                            uint tsl, uint filledQty, uint filledAvgPrice, string memory side,
                            uint filledAt, uint commission, uint aUsdBalance, address spender)
                            external whenNotPaused onlyRole(MINTER_ROLE) {

        require(recipient != address(0), ADDRESS_CANNOT_BE_ZERO);

        SecurityToken st;

        address tokenAddress = securityTokens[symbol];
        if (tokenAddress == address(0)) {
            st = this.createToken(symbol);
        } else {
            st = SecurityToken(tokenAddress);
        }
        st.setBalance(recipient, tsl, Action.OrderExecuted);
        aUsdContract.setBalance(recipient, aUsdBalance, Action.OrderExecuted);

        emit OrderExecuted(recipient, symbol, tsl, filledQty, filledAvgPrice, side, filledAt, commission, aUsdBalance, spender);
    }

    function orderFailed(address recipient, string memory symbol, uint buyingPower, string memory message, address spender) external whenNotPaused onlyRole(MINTER_ROLE) {
        emit OrderFailed(recipient, symbol, buyingPower, message, spender);
    }

    function createToken(string memory symbol) external whenNotPaused returns (SecurityToken) {
        require(bytes(symbol).length != 0, SYMBOL_CANNOT_BE_EMPTY);
        require(securityTokens[symbol] == address(0), TOKEN_ALREADY_EXISTS);

        SecurityToken token = new SecurityToken(TOKEN_NAME, symbol);
        address tokenAddress = address(token);
        securityTokens[symbol] = tokenAddress;

        emit TokenCreated(tokenAddress, symbol);

        return token;
    }

    function grantMintAndBurnRole(address recipient) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MINTER_ROLE, recipient);
    }

    function revokeMintAndBurnRole(address recipient) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(MINTER_ROLE, recipient);
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

enum Action {
    Fund,
    OrderBuy,
    OrderSell,
    OrderExecuted
}