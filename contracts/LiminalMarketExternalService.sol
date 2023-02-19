//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.16;

import "./LiminalMarket.sol";

contract LiminalMarketExternalService {
    LiminalMarket liminalMarket;
    constructor(address liminalMarketAddress) {
        liminalMarket = LiminalMarket(liminalMarketAddress);
    }

    function buySecurityToken(address walletAddress, string memory symbol, uint256 amount) public {
        liminalMarket.buySecurityToken(walletAddress, symbol, amount, address(this));
    }

    function sellSecurityToken(address walletAddress, string memory symbol, uint quantity) public {
        liminalMarket.sellSecurityToken(walletAddress, address(liminalMarket.aUsdContract()), symbol, quantity, address(this));
    }

}