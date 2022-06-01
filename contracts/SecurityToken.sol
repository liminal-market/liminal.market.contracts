//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./LiminalMarket.sol";
import "hardhat/console.sol";

contract SecurityToken is Ownable, ERC20 {

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

    event BalanceSet(address recipient, uint256 amount);

    LiminalMarket private liminalMarketContract;

    constructor(
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {
        liminalMarketContract = LiminalMarket(msg.sender);
    }

    function setQuantity(address recipient, uint256 qty) external onlyOwner {
        uint256 balance = balanceOf(recipient);
        if (qty == balance) return;

        if (qty > balance) {
            _mint(recipient, qty - balance);
        } else {
            _burn(recipient, balance - qty);
        }
        uint256 balanceAfter = balanceOf(recipient);
        require(balanceAfter == qty, "Wrong calculation");

        emit BalanceSet(recipient, qty);
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

    function allowance(address /*owner*/, address /*spender*/)
        public
        view
        virtual
        override
        returns (uint256)
    {
        require(false, "Not supported");
        return 0;
        //return super.allowance(owner, spender);
    }

    function approve(address /*spender*/, uint256 /*amount*/)
        public
        virtual
        override
        returns (bool)
    {
        require(false, "Not supported");
        return false;
        //return super.approve(spender, amount);
    }

    function transferFrom(
        address /*from*/,
        address /*to */,
        uint256 /*amount*/
    ) public virtual override returns (bool) {
        require(false, "Not supported");
        return false;
        /*
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);

        liminalMarketContract.sellSecurityToken(to, from, symbol(), amount);
        return true;
        */
    }

}
