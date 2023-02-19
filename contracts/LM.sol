// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./ServiceContract.sol";


contract LM is Initializable, ERC20Upgradeable, ERC20BurnableUpgradeable, PausableUpgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant SERVICE_FEE_ROLE = keccak256("SERVICE_FEE_ROLE");

    string public constant NOT_ENOUGH_FOR_SERVICE_FEE = "You do not have enough LM tokens for service fee";
    string public constant NOT_ENOUGH_FOR_PREV_SERVICE_FEE = "You do not have enough LM tokens for unpaid service fee";
    string public constant SPENDER_MISSING_SERVICE_FEE_ADDRESS = "Spender does not have service fee address to pay to. Create contract with Liminal.market";

    mapping(address => uint) private unpaidLMServiceFee;
    mapping(address => uint) private unpaidServiceFee;

    ServiceContract serviceContract;

    event ServiceFeePaid(address from, address liminalMarketAddress, uint lmServiceFee, address serviceAddress, uint serviceFee);
    event ServiceFeePaidFailed(address from, address liminalMarketAddress, uint ServiceFee, address serviceAddress, uint serviceFee);
    event ServiceContractAddressSet(address serviceContractAddress);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() initializer public {
        __ERC20_init("LiminalMarket utility token", "LM");
        __ERC20Burnable_init();
        __AccessControl_init();

        _mint(msg.sender, 100000000 * 10 ** decimals());
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(SERVICE_FEE_ROLE, msg.sender);
    }

    function grantServiceFeeRole(address serviceFeeWithdrawAddress) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(SERVICE_FEE_ROLE, serviceFeeWithdrawAddress);
    }

    function revokeServiceFeeRole(address serviceFeeWithdrawAddress) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(SERVICE_FEE_ROLE, serviceFeeWithdrawAddress);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function setServiceContractAddress(ServiceContract serviceContractAddress) public onlyRole(DEFAULT_ADMIN_ROLE) {
        serviceContract = serviceContractAddress;

        emit ServiceContractAddressSet(address(serviceContractAddress));
    }

    function validateBalance(address walletAddress, uint amount, address spender) public view {
        require(serviceContract.getTotalServiceFee(amount, spender) <= balanceOf(walletAddress), NOT_ENOUGH_FOR_SERVICE_FEE);
    }

    function payOutstandingServiceFeeAndValidateBalance(address walletAddress, uint amount, address spender) public onlyRole(SERVICE_FEE_ROLE) {
        //if there are any unpaid service fee from last trade that couldn't be transferred
        uint lmUnpaid = unpaidLMServiceFee[walletAddress];
        uint serviceUnpaid = unpaidServiceFee[walletAddress];

        require(balanceOf(walletAddress) >= (lmUnpaid + serviceUnpaid), NOT_ENOUGH_FOR_PREV_SERVICE_FEE);

        address lmServiceFeeAddress = serviceContract.getLMServiceFeeAddress();
        address serviceFeeAddress = serviceContract.getServiceFeeAddress(spender);
        require(serviceFeeAddress != address(0), SPENDER_MISSING_SERVICE_FEE_ADDRESS);

        if (lmUnpaid > 0) {
            _transfer(walletAddress, lmServiceFeeAddress, lmUnpaid);
            unpaidLMServiceFee[walletAddress] = 0;
        }

        if (serviceUnpaid > 0) {
            _transfer(walletAddress, serviceFeeAddress, serviceUnpaid);
            unpaidServiceFee[walletAddress] = 0;
        }

        uint serviceFee = serviceContract.getTotalServiceFee(amount, spender);
        require(balanceOf(walletAddress) >= serviceFee, NOT_ENOUGH_FOR_SERVICE_FEE);

        if (lmUnpaid > 0 || serviceUnpaid > 0) {
            emit ServiceFeePaid(walletAddress, lmServiceFeeAddress, lmUnpaid, serviceFeeAddress, serviceUnpaid);
        }
    }

    function payServiceFee(address walletAddress, uint amount, address spender) public onlyRole(SERVICE_FEE_ROLE) returns (uint) {
        address serviceFeeAddress = serviceContract.getServiceFeeAddress(spender);
        require(serviceFeeAddress != address(0), SPENDER_MISSING_SERVICE_FEE_ADDRESS);

        uint lmServiceFee = serviceContract.getLMServiceFee(amount);
        uint serviceFee = serviceContract.getServiceFee(amount, spender);
        address lmServiceFeeAddress = serviceContract.getLMServiceFeeAddress();
        if (balanceOf(walletAddress) >= lmServiceFee + serviceFee) {
            if (lmServiceFee > 0) {
                _transfer(walletAddress, lmServiceFeeAddress, lmServiceFee);
            }

            if (serviceFee > 0) {
                _transfer(walletAddress, serviceFeeAddress, serviceFee);
            }

            emit ServiceFeePaid(walletAddress, lmServiceFeeAddress, lmServiceFee, serviceFeeAddress, serviceFee);
        } else {
            unpaidLMServiceFee[walletAddress] = lmServiceFee;
            unpaidServiceFee[walletAddress] = serviceFee;

            emit ServiceFeePaidFailed(walletAddress, lmServiceFeeAddress, lmServiceFee, serviceFeeAddress, serviceFee);
        }
        return lmServiceFee + serviceFee;
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