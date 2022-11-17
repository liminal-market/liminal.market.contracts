//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.16;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "hardhat/console.sol";

contract ServiceSettings is Initializable, PausableUpgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    string public constant ADDRESS_CANNOT_BE_ZERO = "Address cannot be zero";

    struct ServiceInfo {
        address signerAddress;
        string name;
        string url;
    }

    mapping(address => ServiceInfo) public services;

    event ServiceContractCreated(address signer, address service, string name, string url);
    event ServiceContractUpdated(address service, string name, string url);

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

    function createContract(address serviceAddress, string memory name, string memory url)
        public whenNotPaused
    {
        require(serviceAddress != address(0), ADDRESS_CANNOT_BE_ZERO);

        ServiceInfo memory serviceInfo = services[serviceAddress];
        require(serviceInfo.signerAddress == address(0), "This address already has service agreement. Use updateContract");

        serviceInfo = ServiceInfo(msg.sender, name, url);
        services[serviceAddress] = serviceInfo;

        emit ServiceContractCreated(msg.sender, serviceAddress, name, url);
    }

    function updateContract(address serviceAddress, string memory name, string memory url, address[] calldata allowedStaking, address[] calldata allowedUnstaking)
    public whenNotPaused
    {
        //not implemented
    }

    function getService(address serviceAddress) public view returns (address) {
        ServiceInfo memory serviceInfo = services[serviceAddress];
        return serviceInfo.signerAddress;
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