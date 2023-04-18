# MarketCalendarTests.ts

This is a test file for the `MarketCalendar` smart contract. The tests are written using the Chai testing framework, Hardhat, and other related libraries. The purpose of these tests is to ensure the correct functionality of the `MarketCalendar` contract.

## Table of Contents

- [Test Setup](#test-setup)
- [Test Cases](#test-cases)
  - [Initialize Rejection](#initialize-rejection)
  - [Get Calendar](#get-calendar)
  - [Different Open and Close Array Length](#different-open-and-close-array-length)
  - [Add Days and Validate Market Open](#add-days-and-validate-market-open)
  - [Add Days, Market Closed](#add-days-market-closed)
  - [Set Calendar Without Permission](#set-calendar-without-permission)
  - [Set Role, Then Set Calendar](#set-role-then-set-calendar)
  - [Grant Role Rejection](#grant-role-rejection)
  - [Revoke Role Rejection](#revoke-role-rejection)
  - [Set Permission, Then Remove Permission](#set-permission-then-remove-permission)

## Test Setup

The test setup involves importing necessary libraries, initializing the Chai testing framework, and setting up the `MarketCalendar` contract instance. The `before` and `beforeEach` hooks are used to compile the contract and redeploy it before each test case.

## Test Cases

### Initialize Rejection

This test case checks if the `initialize` function call is rejected.

```javascript
it('should call initialize, should be rejected', async () => {
    await TestHelper.initializeRejected(contract);
})
```

### Get Calendar

This test case checks if the `getCalendar` function returns the correct calendar data.

```javascript
it('should getCalendar', async () => {
    // ...
    let calendar = await contract.getCalendar();

    expect(calendar[0].opens).eq(1653921000);
    expect(calendar[0].closes).eq(1653944400);
})
```

### Different Open and Close Array Length

This test case checks if the `setCalendar` function reverts when the open and close arrays have different lengths.

```javascript
it("should have different open and close array length and revert", async () => {
    // ...
    await expect(contract.setCalendar(opens, closes))
        .rejectedWith("opens & closes need to be same length");
});
```

### Add Days and Validate Market Open

This test case checks if the market is open after adding days to the calendar.

```javascript
it("should add days and validate that market is open", async () => {
    // ...
    expect(await contract.setCalendar(opens, closes))
        .to.emit(contract, "CalendarSet").withArgs(opens[0], closes[closes.length-1]);
    expect(await contract.isMarketOpen()).to.be.true;
})
```

### Add Days, Market Closed

This test case checks if the market is closed after adding days to the calendar.

```javascript
it("should add days, market should be closed", async () => {
    // ...
    await contract.setCalendar(opens, closes)
    expect(await contract.isMarketOpen()).to.be.false;
});
```

### Set Calendar Without Permission

This test case checks if the `setCalendar` function fails when called without the required permission.

```javascript
it("set calendar without having permission, should fail", async () => {
    // ...
    let contractW2 = contract.connect(wallet2);
    await expect(contractW2.setCalendar(opens, closes)).rejectedWith('missing role');
})
```

### Set Role, Then Set Calendar

This test case checks if the calendar can be set after granting the required role.

```javascript
it("should set role, then set calendar", async () => {
    // ...
    expect(await contractW2.setCalendar(opens, closes))
        .to.emit(contractW2, "CalendarSet").withArgs(opens[0], closes[closes.length-1]);
})
```

### Grant Role Rejection

This test case checks if granting a role is rejected when the caller does not have the required role.

```javascript
it('should try to grant role, but doesnt have role to do it, should be rejected', async () => {
    // ...
    await expect(contractW2.grantCalendarRole(wallet2.address)).rejectedWith(TestHelper.AccessControlErrorMessage);
})
```

### Revoke Role Rejection

This test case checks if revoking a role is rejected when the caller does not have the required role.

```javascript
it('should try to revoke role, but doesnt have role to do it, should be rejected', async () => {
    // ...
    await expect(contractW2.revokeCalendarRole(wallet2.address)).rejectedWith(TestHelper.AccessControlErrorMessage);
})
```

### Set Permission, Then Remove Permission

This test case checks if the permission can be set and then removed.

```javascript
it("should set permission, then remove permission", async () => {
    // ...
    expect(await contract.revokeCalendarRole(wallet2.address))
        .to.emit(contract, "RoleRevoked")
        .withArgs(contract.SET_CALENDAR_ROLE, wallet2.address, owner.address);

    await expect(contractW2.setCalendar(opens, closes)).rejectedWith('missing role');
})
```