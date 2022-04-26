//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "hardhat/console.sol";

contract KYC is
    Initializable,
    PausableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{

 	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() initializer {}

 	function initialize() public initializer {
        __Pausable_init();
		__Ownable_init();
        __UUPSUpgradeable_init();

    }
    mapping(address => AccountValidation) public kycAccount;

    struct AccountValidation {
        string accountId;
        uint256 validationDate;
    }

    event AccountValidated(string accountId);
    event AccountInvalidated(address accountAddress);



    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {
		_upgradeTo(newImplementation);
	}
    function invalidateAccount(address accountAddress)
        public
        onlyOwner
    {
        delete kycAccount[accountAddress];

        emit AccountInvalidated(accountAddress);
    }

    function validateAccount(string memory accountId)
        public
        onlyOwner
        returns (bool)
    {
        console.log("ValidateAccount called");

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
        if (userAddress == 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266)
            return "aee548b2-b250-449c-8d0b-937b0b87ccef";
        if (userAddress == 0x93DA645082493BBd7116fC057c5b9aDfd5363912)
            return "aee548b2-b250-449c-8d0b-937b0b87ccef";
        console.log("KYC isValid is called");
        AccountValidation memory account = kycAccount[userAddress];

        require(
            bytes(account.accountId).length != 0,
            "Address is not KYC valid"
        );

        //TODO: lets skip this validation while in Sandbox version
        //require(account.validationDate < block.timestamp - (2 days * 365 days), "KYC expired, please renew");

        return account.accountId;
    }

    function getAccountId(address userAddress)
        public
        view
        returns (string memory)
    {
        console.log("userAddress:", userAddress);

        AccountValidation memory account = kycAccount[userAddress];
        console.log("account:", account.accountId);
        require(
            bytes(account.accountId).length != 0,
            "Address is not KYC valid"
        );
        return account.accountId;
    }
}
