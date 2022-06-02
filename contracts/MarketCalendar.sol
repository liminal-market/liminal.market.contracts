//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.7;

import "hardhat/console.sol";

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";


contract MarketCalendar is Initializable, AccessControlUpgradeable, UUPSUpgradeable {
    Calendar[] public s_calendar;

    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant SET_CALENDAR_ROLE = keccak256("SET_CALENDAR_ROLE");

    event CalendarSet(uint startTimestamp, uint endTimestamp);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() external initializer  {
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
        _grantRole(SET_CALENDAR_ROLE, msg.sender);

    }

    function setCalendar(uint[] calldata opens, uint[] calldata closes) external onlyRole(SET_CALENDAR_ROLE) {
        require(opens.length == closes.length, "opens & closes need to be same length");
        delete s_calendar;

        for (uint i=0;i<opens.length;i++) {
            s_calendar.push(Calendar(opens[i], closes[i]));
        }

        emit CalendarSet(opens[0], closes[closes.length-1]);
    }

    function isMarketOpen() external view returns (bool) {
        uint timestamp = block.timestamp;
        Calendar[] memory calArray = s_calendar;

        for (uint i=0;i<calArray.length;i++) {
            if (timestamp > calArray[i].opens && timestamp < calArray[i].closes) return true;
        }

        return false;
    }

    function grantCalendarRole(address newAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(SET_CALENDAR_ROLE, newAddress);
    }

    function revokeCalendarRole(address addr) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(SET_CALENDAR_ROLE, addr);
    }

    function _authorizeUpgrade(address newImplementation) internal onlyRole(UPGRADER_ROLE) onlyProxy override
    {
        _upgradeTo(newImplementation);
    }

    struct Calendar {
        uint opens;
        uint closes;
    }
}