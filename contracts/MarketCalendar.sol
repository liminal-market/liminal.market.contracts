//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.9;

import "hardhat/console.sol";

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";


contract MarketCalendar is Initializable, AccessControlUpgradeable, UUPSUpgradeable {
    Calendar[] public calendar;

    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant SET_CALENDAR_ROLE = keccak256("SET_CALENDAR_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() public initializer  {
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
        _grantRole(SET_CALENDAR_ROLE, msg.sender);

    }

    function setCalendar(uint o0, uint c0, uint o1, uint c1, uint o2, uint c2, uint o3, uint c3, uint o4, uint c4)
                public onlyRole(SET_CALENDAR_ROLE) {
        calendar[0].opens = o0;
        calendar[0].closes = c0;
        calendar[1].opens = o1;
        calendar[1].closes = c1;
        calendar[2].opens = o2;
        calendar[2].closes = c2;
        calendar[3].opens = o3;
        calendar[3].closes = c3;
        calendar[4].opens = o4;
        calendar[4].closes = c4;
    }

    function isMarketOpen() public view returns (bool) {
        uint timestamp = block.timestamp;
        for (uint i=0;i<calendar.length;i++) {
            if (timestamp > calendar[i].opens && timestamp < calendar[i].closes) return true;
        }

        return false;
    }

    function setCalendarRole(address newAddress) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(SET_CALENDAR_ROLE, newAddress);
    }

    function removeCalendarRole(address addr) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(SET_CALENDAR_ROLE, addr);
    }

    function _authorizeUpgrade(address newImplementation) internal onlyRole(UPGRADER_ROLE) override
    {
        _upgradeTo(newImplementation);
    }

    struct Calendar {
        uint opens;
        uint closes;
    }
}