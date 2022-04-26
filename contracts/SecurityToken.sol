//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
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

    LiminalMarket private liminalMarketContract;

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
console.log("amount:", amount);
console.log("balance", balance);

        if (balance < amount) amount = balance;
console.log("burning:", amount);

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

    function allowance(address owner, address spender)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return super.allowance(owner, spender);
    }

    function approve(address spender, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        return super.approve(spender, amount);
    }

    function transferFrom(
        address from,
        address to ,
        uint256 amount
    ) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);

        liminalMarketContract.sellSecurityToken(to, from, symbol(), amount);
        return true;
    }

}
