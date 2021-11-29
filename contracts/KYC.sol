//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract KYC is Ownable  {

	mapping(address => AccountValidation) public kycAccount;


	constructor() Ownable() {
	}

	struct AccountValidation {
		string accountId;
		uint validationDate;
	}

	event AccountValidated(string accountId);

	function validateAccount(string memory accountId) public returns(bool) {
		console.log("ValidateAccount called");
		//validation will probably need some authentication, although
		//the broker is the ultimate validator, so even if somebody calls this
		//function to add him as valid, he will need to know the correct user id from the broker
		//and even if he does that, broker still has the final say.
		require(bytes(accountId).length == 36, "Looks like invalid accountId");

		kycAccount[msg.sender] = AccountValidation(accountId, block.timestamp);
console.log("address to kycAccount", msg.sender);
console.log("accountId", accountId);
console.log("kycAccount", kycAccount[msg.sender].accountId);

		emit AccountValidated(accountId);

		return true;
	}

	function isValid(address userAddress) public view returns (string memory) {
		//TODO: Remove this, this is hardhat test wallet #1
		if (userAddress == 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266) return "aee548b2-b250-449c-8d0b-937b0b87ccef";
console.log("KYC isValid is called");
		AccountValidation memory account = kycAccount[userAddress];

        require(bytes(account.accountId).length != 0, "Address is not KYC valid");

		//TODO: lets skip this validation while in Sandbox version
        //require(account.validationDate < block.timestamp - (2 days * 365 days), "KYC expired, please renew");

		return account.accountId;
	}

	function getAccountId(address userAddress) public view returns(string memory) {

console.log("userAddress:", userAddress);

		AccountValidation memory account = kycAccount[userAddress];
console.log("account:", account.accountId);
        require(bytes(account.accountId).length != 0, "Address is not KYC valid");
		return account.accountId;
	}

}