//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.0;


interface ISecurityToken {
	event Mint(address recipient, uint256 amount, string symbol, uint balance);
	event Burn(address recipient, uint256 amount, string symbol, uint balance);

	function initialize() external;

	function mint(address recipient, uint256 amount) external;

	function burn(address recipient, uint256 amount) external;

    function transfer(address recipient, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}