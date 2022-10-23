//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./LiminalMarket.sol";

contract SecurityToken is Ownable, ERC20 {
    event BalanceSet(address recipient, uint256 amount);

    LiminalMarket private liminalMarketContract;

    constructor(
        string memory tokenName,
        string memory tokenSymbol
    ) ERC20(tokenName, tokenSymbol) {
        liminalMarketContract = LiminalMarket(msg.sender);
    }

    function setBalance(address recipient, uint256 qty) external onlyOwner {
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

    function transfer(address to, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        liminalMarketContract.sellSecurityToken(msg.sender, to, symbol(), amount, address(0));
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {

        address spender = _msgSender();
        _spendAllowance(from, spender, amount);

        liminalMarketContract.sellSecurityToken(from, to, symbol(), amount, spender);

        emit Transfer(from, to, amount);
        return true;
    }

}
