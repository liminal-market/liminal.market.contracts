# MarketCalendar.sol

`MarketCalendar.sol` is a Solidity smart contract that manages a market calendar, allowing users to set and query the market's open and close times. The contract utilizes OpenZeppelin's upgradeable contracts for access control, pausing, and UUPS proxy upgrades.

## Table of Contents

- [Overview](#overview)
- [Initialization](#initialization)
- [Methods](#methods)
  - [setCalendar](#setcalendar)
  - [isMarketOpen](#ismarketopen)
  - [getCalendar](#getcalendar)
  - [grantCalendarRole](#grantcalendarrole)
  - [revokeCalendarRole](#revokecalendarrole)
  - [_authorizeUpgrade](#_authorizeupgrade)
- [Events](#events)
  - [CalendarSet](#calendarset)

## Overview

The `MarketCalendar` contract inherits from `Initializable`, `AccessControlUpgradeable`, and `UUPSUpgradeable`. It defines a struct `Calendar` with two properties: `opens` and `closes`, representing the opening and closing timestamps of the market. The contract also defines two roles: `UPGRADER_ROLE` and `SET_CALENDAR_ROLE`.

## Initialization

The `initialize` function initializes the contract, setting up access control and UUPS upgradeability. It grants the `DEFAULT_ADMIN_ROLE`, `UPGRADER_ROLE`, and `SET_CALENDAR_ROLE` to the contract deployer.

## Methods

### setCalendar

```solidity
function setCalendar(uint[] calldata opens, uint[] calldata closes) external onlyRole(SET_CALENDAR_ROLE)
```

Sets the market calendar by providing two arrays of equal length, `opens` and `closes`, representing the opening and closing timestamps of the market. Emits a `CalendarSet` event.

### isMarketOpen

```solidity
function isMarketOpen() external view returns (bool)
```

Returns `true` if the market is currently open, `false` otherwise.

### getCalendar

```solidity
function getCalendar() public view returns (Calendar[] memory)
```

Returns the current market calendar as an array of `Calendar` structs.

### grantCalendarRole

```solidity
function grantCalendarRole(address newAddress) external onlyRole(DEFAULT_ADMIN_ROLE)
```

Grants the `SET_CALENDAR_ROLE` to the specified `newAddress`. Requires the caller to have the `DEFAULT_ADMIN_ROLE`.

### revokeCalendarRole

```solidity
function revokeCalendarRole(address addr) external onlyRole(DEFAULT_ADMIN_ROLE)
```

Revokes the `SET_CALENDAR_ROLE` from the specified `addr`. Requires the caller to have the `DEFAULT_ADMIN_ROLE`.

### _authorizeUpgrade

```solidity
function _authorizeUpgrade(address newImplementation) internal onlyRole(UPGRADER_ROLE) onlyProxy override
```

Authorizes an upgrade to a new implementation. Requires the caller to have the `UPGRADER_ROLE`.

## Events

### CalendarSet

```solidity
event CalendarSet(uint startTimestamp, uint endTimestamp)
```

Emitted when the market calendar is set, providing the start and end timestamps of the new calendar.