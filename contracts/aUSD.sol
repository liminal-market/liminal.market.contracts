//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./LiminalExchange.sol";
import "hardhat/console.sol";

contract aUSD is ERC20, Ownable, AccessControl {

    LiminalExchange liminalExchangeAddress;

    bytes32 public constant SET_BALANCE = keccak256("SET_BALANCE");
    event BalanceSet(address recipient, uint256 amount);

    constructor()
        ERC20("USD at Broker", "aUSD")
        Ownable()
    {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(SET_BALANCE, msg.sender);
    }

    function setAddresses(address payable _liminalExchangeAddress) public {
        require(msg.sender == owner(), "Only owner can set address");

        liminalExchangeAddress = LiminalExchange(_liminalExchangeAddress);
    }

    function grantRoleForBalance(address recipient) public {
        require(msg.sender == owner(), "Only owner can set role");
        grantRole(SET_BALANCE, recipient);
    }

	function setBalance(address recipient, uint256 amount) public returns (uint256) {
        console.log('aUsd - sender:', msg.sender);
        console.log('aUsd - amount:', amount);
        require(hasRole(SET_BALANCE, msg.sender), "You dont have permission to set balance");

		uint256 balance = balanceOf(recipient);
        if (amount == balance) return amount;
        if (amount > balance) {
            _mint(recipient, amount - balance);
        } else {
            _burn(recipient, balance - amount);
        }
        console.log('aUsd - balanceBefore:', balance);


console.log('aUsd - balanceAfter:', balanceOf(recipient));
        emit BalanceSet(recipient, amount);
		return amount;
	}

    function transfer(address recipient, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
		return liminalExchangeAddress.buyWithAUsd(msg.sender, recipient, amount);
	}

    function allowance(address, address)
        public
        view
        virtual
        override
        returns (uint256)
    {
        require(false, "No need for allowance");
        return 0;
    }

    function approve(address, uint256)
        public
        virtual
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
        override returns (bool) {
			require(false, "This token cannot be transfered");
            return false;
		}


}
