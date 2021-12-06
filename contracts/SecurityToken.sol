//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./LiminalMarket.sol";
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

    LiminalMarket liminalMarketContract;

    constructor(
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {
        liminalMarketContract = LiminalMarket(msg.sender);
    }


    function mint(address recipient, uint256 amount) public onlyOwner {
        _mint(recipient, amount);

        emit Mint(recipient, amount, symbol(), balanceOf(recipient));
    }
      //should be called by Chainlink
    function burn(/*bytes32,*/ address account, uint256 amount) public onlyOwner {
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
        liminalMarketContract.sellSecurityToken(recipient, msg.sender, symbol(), amount);

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
