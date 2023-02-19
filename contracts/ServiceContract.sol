//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.16;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "./LiminalMarketExternalService.sol";

contract ServiceContract is Initializable, PausableUpgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    string public constant ADDRESS_CANNOT_BE_ZERO = "Address cannot be zero";

    LiminalMarket liminalMarket;
    address lmServiceFeeAddress;
    uint lmServiceFeePoints;

    struct ServiceInfo {
        address owner;
        address serviceFeeAddress;
        uint serviceFeePoints;
        bool active;
    }

    mapping(address => ServiceInfo) public services;
    mapping(address => address[]) public owners;

    event LiminalMarketAddressSet(address liminalMarketAddress);
    event LMServiceFeeAddressSet(address lmServiceFeeAddress);
    event LMServiceFeePointsSet(uint points);

    event ServiceContractCreated(address indexed owner, address contractAddress, address serviceFeeAddress, uint serviceFeePoints, string name, string url);
    event ServiceContractUpdated(address indexed owner, address contractAddress, address serviceFeeAddress, uint serviceFeePoints, string name, string url);
    event NewOwnerOnServiceContract(address contractAddress, address prevOwner, address newOwner);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() initializer public {
        __Pausable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);

        //equals 0.2%
        lmServiceFeePoints = 200;
    }

    function setAddress(address liminalMarketAddress) onlyRole(DEFAULT_ADMIN_ROLE) public {
        require(liminalMarketAddress != address(0), ADDRESS_CANNOT_BE_ZERO);
        liminalMarket = LiminalMarket(liminalMarketAddress);
        emit LiminalMarketAddressSet(liminalMarketAddress);
    }

    function setLMServiceFeeAddress(address lmAddress) onlyRole(DEFAULT_ADMIN_ROLE) public {
        require(lmAddress != address(0), ADDRESS_CANNOT_BE_ZERO);
        lmServiceFeeAddress = lmAddress;
        emit LMServiceFeeAddressSet(lmAddress);
    }

    function getLMServiceFeeAddress() public view returns (address) {
        return lmServiceFeeAddress;
    }

    /**
    * This function set the service fee points that Liminal.market takes
    * Setting 200 points is equal 0.2%
    * Setting 5 points is equal to 0.005%
    */
    function setLMServiceFee(uint points) onlyRole(DEFAULT_ADMIN_ROLE) public {
        lmServiceFeePoints = points;
        emit LMServiceFeePointsSet(points);
    }

    function getLMServiceFee(uint amount) public view returns (uint) {
        return amount * lmServiceFeePoints / 10 ** 5;
    }

    fallback() external payable {

    }

    receive() external payable {
    }

    function createContract(address contractAddress, address serviceFeeAddress, uint serviceFeePoints, string memory name, string memory url)
    public whenNotPaused returns (address)
    {
        require(serviceFeeAddress != address(0), ADDRESS_CANNOT_BE_ZERO);
        if (contractAddress == address(0)) {
            LiminalMarketExternalService externalContract = new LiminalMarketExternalService(address(liminalMarket));
            contractAddress = address(externalContract);
        }

        ServiceInfo memory serviceInfo = services[contractAddress];
        require(serviceInfo.owner == address(0), "This contract already exists. Use updateContract");

        serviceInfo = ServiceInfo(msg.sender, serviceFeeAddress, serviceFeePoints, true);
        services[contractAddress] = serviceInfo;

        owners[msg.sender].push(contractAddress);

        emit ServiceContractCreated(msg.sender, contractAddress, serviceFeeAddress, serviceFeePoints, name, url);

        return contractAddress;
    }

    function updateContract(address contractAddress, address serviceFeeAddress, uint serviceFeePoints, string memory name, string memory url)
    public whenNotPaused
    {
        require(contractAddress != address(0), ADDRESS_CANNOT_BE_ZERO);
        require(serviceFeeAddress != address(0), ADDRESS_CANNOT_BE_ZERO);

        ServiceInfo memory serviceInfo = services[contractAddress];
        require(serviceInfo.owner != address(0), "This address does not have service agreement. Use createContract");
        require(serviceInfo.owner == msg.sender, "Only owner can change contract");

        serviceInfo.serviceFeeAddress = serviceFeeAddress;
        serviceInfo.serviceFeePoints = serviceFeePoints;
        services[contractAddress] = serviceInfo;

        emit ServiceContractUpdated(msg.sender, contractAddress, serviceFeeAddress, serviceFeePoints, name, url);
    }

    function setServiceContractOwner(address newOwner, address contractAddress) public {
        ServiceInfo memory serviceInfo = services[contractAddress];
        require(serviceInfo.owner == msg.sender, "Only owner can set owner of service contract");
        require(newOwner != address(0), ADDRESS_CANNOT_BE_ZERO);

        serviceInfo.owner = newOwner;
        services[contractAddress] = serviceInfo;

        address[] memory contracts = owners[msg.sender];
        owners[newOwner] = contracts;
        delete owners[msg.sender];

        emit NewOwnerOnServiceContract(contractAddress, msg.sender, newOwner);
    }

    function getContractsByOwner(address owner) public view returns (ServiceInfo[] memory) {
        ServiceInfo[] memory contractList = new ServiceInfo[](owners[owner].length);
        for (uint i = 0; i < owners[owner].length; i++) {
            contractList[i] = services[owners[owner][i]];
        }
        return contractList;
    }


    function getServiceFeeAddress(address spender) public view returns (address) {
        ServiceInfo memory serviceInfo = services[spender];
        return serviceInfo.serviceFeeAddress;
    }

    function getServiceFee(uint amount, address spender) public view returns (uint) {
        ServiceInfo memory serviceInfo = services[spender];
        return amount * serviceInfo.serviceFeePoints / 10 ** 5;
    }

    function getTotalServiceFee(uint amount, address spender) public view returns (uint) {
        uint totalServiceFee = getLMServiceFee(amount) + getServiceFee(amount, spender);
        return totalServiceFee;
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