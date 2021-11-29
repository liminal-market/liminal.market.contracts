//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./KYC.sol";
import "./aUSD.sol";
import "./SecurityFactory.sol";
import "hardhat/console.sol";

contract SecurityToken is Ownable, ERC20 {
    //using Chainlink for Chainlink.Request;

    event Mint(
        address recipient,
        uint256 amount,
        string symbol,
        uint256 balance
    );
    event Burn(
        address recipient,
        uint256 amount,
        string symbol,
        uint256 balance,
		address aUSDAddress,
        uint256 aUsdBalance
    );

    SecurityFactory securityFactoryContract;
    KYC kycContract;

    constructor(
        string memory name,
        string memory symbol,
        KYC _kycContract,
        SecurityFactory _securityFactoryContract
    ) ERC20(name, symbol) {
        kycContract = _kycContract;
        securityFactoryContract = _securityFactoryContract;
    }


    function mint(address recipient, uint256 amount) public {
        require(msg.sender == owner(), "You don't have permission to mint");
console.log("SecurityToken - balanceBefore:", balanceOf(recipient));
        _mint(recipient, amount);
console.log("SecurityToken - recipient:", recipient);
console.log("SecurityToken - amount:", amount);
console.log("SecurityToken - symbol:", symbol());
console.log("SecurityToken - balanceAfter:", balanceOf(recipient));

        emit Mint(recipient, amount, symbol(), balanceOf(recipient));
    }
      //should be called by Chainlink
    function burn(/*bytes32,*/ address account, uint256 amount) public {
        require(msg.sender == owner(), "You don't have permission");

        uint balance = balanceOf(account);
        if (balance < amount) amount = balance;

        _burn(account, amount);

    }

    function transfer(address recipient, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        require(recipient == owner(), "V0.1 doesn't support transfer");

        string memory accountId = kycContract.isValid(msg.sender);

        securityFactoryContract.sellSecurityToken(accountId, recipient, msg.sender, symbol(), amount);

        return true;
    }



    function allowance(address, address)
        public
        view
        virtual
        override
        returns (uint256)
    {
        require(false, "V0.1 doesn't support allowance");
        return 0;
    }

    function approve(address, uint256)
        public
        virtual
        override
        returns (bool)
    {
        require(false, "V0.1 doesn't support approve");
        return false;
    }

    function transferFrom(
        address,
        address,
        uint256
    ) public virtual override returns (bool) {
        require(false, "V0.1 doesn't support tranferFrom");
        return false;
    }

}
