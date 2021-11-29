//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./KYC.sol";
import "./SecurityFactory.sol";

contract LiminalExchange is Ownable {
    //using Chainlink for Chainlink.Request;

    address public securityFactoryAddress;
    address public kycAddress;
    address public aUSDAddress;
    address public usdcContractAddress;
    address public usdcAddress;
    address public liminalWalletAddress;
    address public usdcBrokerAddress;

    event Bought(
        uint256 amount,
        string accountId,
        string symbol,
        uint256 fee,
        address tokenAddress
    );

    constructor(
        address _securityFactoryAddress,
        address /*_oracleAddress*/,
        address _kycAddress,
        address _aUSDAddress,
        address _liminalWalletAddress,
        address _brokerAddress,
        address /*_linkTokenAddress*/,
        address _usdcContractAddress
    ) {
        securityFactoryAddress = _securityFactoryAddress;
        kycAddress = _kycAddress;
        aUSDAddress = _aUSDAddress;

        liminalWalletAddress = _liminalWalletAddress;
        usdcBrokerAddress = _brokerAddress;
        usdcContractAddress = _usdcContractAddress;

       // setChainlinkToken(_linkTokenAddress);
        //setChainlinkOracle(_oracleAddress);

        console.log("Deploying a LiminalExchange");
    }

    receive() external payable {
        console.log("recieve is called");
    }

    function calculateFee(uint256 amount) public pure returns (uint256) {
        //fee is 0.5%
        return (amount / 1000) * 5;
    }

    function buyWithAUsd(address from, address recipient, uint256 amount) public returns (bool) {
        IERC20 aUsdContract = IERC20(aUSDAddress);
        uint256 ausdValue = aUsdContract.balanceOf(from);
        require(ausdValue >= amount, "You don't have enough USDC");

        KYC kyc = KYC(kycAddress);
        string memory accountId = kyc.isValid(from);

        SecurityToken securityToken = SecurityToken(recipient);
        string memory symbol = securityToken.symbol();

        emit Bought(
            amount,
            accountId,
            symbol,
            0,
            msg.sender
        );

        return true;

    }

    function buy(string memory symbol, uint256 amount)
        public
        payable
        returns (bool)
    {
        require(bytes(symbol).length > 0, "You need to select symbol");
        require(amount > 0, "You need to give amount to buy for");

        IERC20 usdcContract = IERC20(usdcContractAddress);
        uint256 usdcValue = usdcContract.balanceOf(msg.sender);
        require(usdcValue >= amount, "You don't have enough USDC");

        usdcValue = usdcContract.allowance(msg.sender, address(this));
        require(usdcValue >= amount, "Check the token allowance");

        KYC kyc = KYC(kycAddress);
        string memory accountId = kyc.isValid(msg.sender);

        usdcContract.transferFrom(msg.sender, address(this), amount);

        uint256 fee = calculateFee(amount);
        uint256 amountAfterFee = amount - fee;

        usdcContract.transfer(usdcBrokerAddress, amountAfterFee);
        usdcContract.transfer(liminalWalletAddress, fee);

        SecurityFactory sf = SecurityFactory(securityFactoryAddress);
        address securityTokenAddress = sf.getSecurityToken(symbol);
        if (securityTokenAddress == address(0)) {
            securityTokenAddress = sf.createToken("Liminal symbol", symbol);
        }

        emit Bought(
            amountAfterFee,
            accountId,
            symbol,
            fee,
            securityTokenAddress
        );

        return true;
    }

}
