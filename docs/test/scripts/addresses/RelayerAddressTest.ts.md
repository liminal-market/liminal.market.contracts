# RelayerAddressTest.ts

This is a code file that contains a test suite for the `RelayerAddress` class. The test suite ensures that the correct relayer addresses are returned for different networks. The file imports the `FixedAddresses` class from the `scripts/addresses/FixedAddresses` module and uses the `expect` function from the `chai` library for assertions.

## Table of Contents

- [Test Suite: Test RelayerAddress class](#test-suite-test-relayeraddress-class)
  - [Test Case: test relayer addresses](#test-case-test-relayer-addresses)

## Test Suite: Test RelayerAddress class

This test suite contains a single test case that checks if the `getRelayerAddress` method of the `FixedAddresses` class returns the correct relayer addresses for different networks.

### Test Case: test relayer addresses

This test case checks if the `getRelayerAddress` method returns the correct relayer addresses for the following networks:

1. Mumbai
2. Fuji
3. BSC Testnet

The test case uses the `expect` function from the `chai` library to assert that the returned relayer addresses match the expected values.

Here's the code snippet for the test case:

```typescript
it("test relayer addresses", async () => {
    expect(FixedAddresses.getRelayerAddress("mumbai")).to.equal("0x7aced305382ac47a901bfda45b9ee6935765708d");
    expect(FixedAddresses.getRelayerAddress("fuji")).to.equal("0x54577aff26c37383f33577753501c11c326f2d6f");
    expect(FixedAddresses.getRelayerAddress("bsctest")).to.equal("0xfbccca4821b953a29471b743837f6dd48a919d49");
})
```

In this test case, the `getRelayerAddress` method is called with the network names as arguments, and the returned values are compared with the expected relayer addresses using the `expect` function. If the returned values match the expected values, the test case passes; otherwise, it fails.