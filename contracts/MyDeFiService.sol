//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.16;

import "./LiminalMarketExternalService.sol";

contract MyDeFiService is LiminalMarketExternalService {
    constructor() LiminalMarketExternalService(0x19d5ABE7854b01960D4911e6536b26F8A38C3a18) { }
}