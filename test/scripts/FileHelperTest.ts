import mock from 'mock-fs'
import FileHelper from "../../scripts/FileHelper";
import chai from "chai";
import hre from "hardhat";
import chaiAsPromised from "chai-as-promised";
import {solidity} from "ethereum-waffle";
import ContractInfo from "../../scripts/addresses/ContractInfo";
import spies from 'chai-spies';

describe("Test FileHelper", () => {
    const expect = chai.expect;
    chai.should();
    chai.use(chaiAsPromised);
    chai.use(solidity);
    chai.use(spies);

    it("test write contract files", async () => {

        mock({
            './scripts/templates/': {
                'ContractAddress.contracts.handlebars': '',
                'ContractAddress.cloud.handlebars' : '',
                'Abis.libraries.core.handlebars' : ''
            },
            '../liminal.market.app/src/contracts/': {
                'localhost-contract-addresses.ts' : ''
            },
            '../liminal.market.libraries/javascript/core/src/networks/': {
                'LocalhostNetwork.ts' : ''
            },
            '../liminal.market.app/src/networks/localhost.ts' : '',
            '../liminal.market.cloud/src/networks/localhostContractAddresses.ts' : '',
            './scripts/addresses/' : {},
            './artifacts/contracts/LiminalMarket.sol/' : {
                'LiminalMarket.json' : '{\n' +
                    '  "_format": "hh-sol-artifact-1",\n' +
                    '  "contractName": "LiminalMarket",\n' +
                    '  "sourceName": "contracts/LiminalMarket.sol",\n' +
                    '  "abi": [\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "stateMutability": "nonpayable",\n' +
                    '      "type": "constructor"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "anonymous": false,\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "previousAdmin",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "newAdmin",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "AdminChanged",\n' +
                    '      "type": "event"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "anonymous": false,\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "indexed": true,\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "beacon",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "BeaconUpgraded",\n' +
                    '      "type": "event"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "anonymous": false,\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "walletAddress",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "uint256",\n' +
                    '          "name": "amount",\n' +
                    '          "type": "uint256"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "accountId",\n' +
                    '          "type": "string"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "symbol",\n' +
                    '          "type": "string"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "tokenAddress",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "spender",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "BuyWithAUsd",\n' +
                    '      "type": "event"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "anonymous": false,\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "uint8",\n' +
                    '          "name": "version",\n' +
                    '          "type": "uint8"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "Initialized",\n' +
                    '      "type": "event"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "anonymous": false,\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "recipient",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "symbol",\n' +
                    '          "type": "string"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "uint256",\n' +
                    '          "name": "tsl",\n' +
                    '          "type": "uint256"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "uint256",\n' +
                    '          "name": "filledQty",\n' +
                    '          "type": "uint256"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "uint256",\n' +
                    '          "name": "filledAvgPrice",\n' +
                    '          "type": "uint256"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "side",\n' +
                    '          "type": "string"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "uint256",\n' +
                    '          "name": "filledAt",\n' +
                    '          "type": "uint256"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "uint256",\n' +
                    '          "name": "serviceFee",\n' +
                    '          "type": "uint256"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "uint256",\n' +
                    '          "name": "aUsdBalance",\n' +
                    '          "type": "uint256"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "spender",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "OrderExecuted",\n' +
                    '      "type": "event"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "anonymous": false,\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "recipient",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "symbol",\n' +
                    '          "type": "string"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "uint256",\n' +
                    '          "name": "buyingPower",\n' +
                    '          "type": "uint256"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "message",\n' +
                    '          "type": "string"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "spender",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "OrderFailed",\n' +
                    '      "type": "event"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "anonymous": false,\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "account",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "Paused",\n' +
                    '      "type": "event"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "anonymous": false,\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "indexed": true,\n' +
                    '          "internalType": "bytes32",\n' +
                    '          "name": "role",\n' +
                    '          "type": "bytes32"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": true,\n' +
                    '          "internalType": "bytes32",\n' +
                    '          "name": "previousAdminRole",\n' +
                    '          "type": "bytes32"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": true,\n' +
                    '          "internalType": "bytes32",\n' +
                    '          "name": "newAdminRole",\n' +
                    '          "type": "bytes32"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "RoleAdminChanged",\n' +
                    '      "type": "event"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "anonymous": false,\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "indexed": true,\n' +
                    '          "internalType": "bytes32",\n' +
                    '          "name": "role",\n' +
                    '          "type": "bytes32"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": true,\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "account",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": true,\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "sender",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "RoleGranted",\n' +
                    '      "type": "event"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "anonymous": false,\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "indexed": true,\n' +
                    '          "internalType": "bytes32",\n' +
                    '          "name": "role",\n' +
                    '          "type": "bytes32"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": true,\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "account",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": true,\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "sender",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "RoleRevoked",\n' +
                    '      "type": "event"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "anonymous": false,\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "accountId",\n' +
                    '          "type": "string"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "walletAddress",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "aUsdAddress",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "symbol",\n' +
                    '          "type": "string"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "uint256",\n' +
                    '          "name": "amount",\n' +
                    '          "type": "uint256"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "spender",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "SellSecurityToken",\n' +
                    '      "type": "event"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "anonymous": false,\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "tokenAddress",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "symbol",\n' +
                    '          "type": "string"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "TokenCreated",\n' +
                    '      "type": "event"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "anonymous": false,\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "indexed": false,\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "account",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "Unpaused",\n' +
                    '      "type": "event"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "anonymous": false,\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "indexed": true,\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "implementation",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "Upgraded",\n' +
                    '      "type": "event"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "ADDRESS_CANNOT_BE_ZERO",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "",\n' +
                    '          "type": "string"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "DEFAULT_ADMIN_ROLE",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "bytes32",\n' +
                    '          "name": "",\n' +
                    '          "type": "bytes32"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "MARKET_CLOSED",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "",\n' +
                    '          "type": "string"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "MINTER_ROLE",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "bytes32",\n' +
                    '          "name": "",\n' +
                    '          "type": "bytes32"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "NOT_ENOUGH_AUSD",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "",\n' +
                    '          "type": "string"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "NOT_VALID_TOKEN_ADDRESS",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "",\n' +
                    '          "type": "string"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "ONLY_AUSD_CAN_CALL_ME",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "",\n' +
                    '          "type": "string"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "ONLY_SEND_TO_AUSD",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "",\n' +
                    '          "type": "string"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "PAUSER_ROLE",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "bytes32",\n' +
                    '          "name": "",\n' +
                    '          "type": "bytes32"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "QUANTITY_MORE_THEN_BALANCE",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "",\n' +
                    '          "type": "string"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "SYMBOL_CANNOT_BE_EMPTY",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "",\n' +
                    '          "type": "string"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "TOKEN_ALREADY_EXISTS",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "",\n' +
                    '          "type": "string"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "TOKEN_NAME",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "",\n' +
                    '          "type": "string"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "UPGRADER_ROLE",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "bytes32",\n' +
                    '          "name": "",\n' +
                    '          "type": "bytes32"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "aUsdContract",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "contract aUSD",\n' +
                    '          "name": "",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "walletAddress",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "symbol",\n' +
                    '          "type": "string"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "uint256",\n' +
                    '          "name": "amount",\n' +
                    '          "type": "uint256"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "spender",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "buySecurityToken",\n' +
                    '      "outputs": [],\n' +
                    '      "stateMutability": "nonpayable",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "walletAddress",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "tokenAddress",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "uint256",\n' +
                    '          "name": "amount",\n' +
                    '          "type": "uint256"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "spender",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "buyWithAUsd",\n' +
                    '      "outputs": [],\n' +
                    '      "stateMutability": "nonpayable",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "symbol",\n' +
                    '          "type": "string"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "createToken",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "contract SecurityToken",\n' +
                    '          "name": "",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "nonpayable",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "bytes32",\n' +
                    '          "name": "role",\n' +
                    '          "type": "bytes32"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "getRoleAdmin",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "bytes32",\n' +
                    '          "name": "",\n' +
                    '          "type": "bytes32"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "symbol",\n' +
                    '          "type": "string"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "getSecurityToken",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "recipient",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "grantMintAndBurnRole",\n' +
                    '      "outputs": [],\n' +
                    '      "stateMutability": "nonpayable",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "bytes32",\n' +
                    '          "name": "role",\n' +
                    '          "type": "bytes32"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "account",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "grantRole",\n' +
                    '      "outputs": [],\n' +
                    '      "stateMutability": "nonpayable",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "bytes32",\n' +
                    '          "name": "role",\n' +
                    '          "type": "bytes32"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "account",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "hasRole",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "bool",\n' +
                    '          "name": "",\n' +
                    '          "type": "bool"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "initialize",\n' +
                    '      "outputs": [],\n' +
                    '      "stateMutability": "nonpayable",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "a",\n' +
                    '          "type": "string"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "b",\n' +
                    '          "type": "string"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "isEqual",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "bool",\n' +
                    '          "name": "",\n' +
                    '          "type": "bool"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "pure",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "kycContract",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "contract KYC",\n' +
                    '          "name": "",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "lmToken",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "contract LM",\n' +
                    '          "name": "",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "marketCalendarContract",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "contract MarketCalendar",\n' +
                    '          "name": "",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "recipient",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "symbol",\n' +
                    '          "type": "string"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "uint256",\n' +
                    '          "name": "tsl",\n' +
                    '          "type": "uint256"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "uint256",\n' +
                    '          "name": "filledQty",\n' +
                    '          "type": "uint256"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "uint256",\n' +
                    '          "name": "filledAvgPrice",\n' +
                    '          "type": "uint256"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "side",\n' +
                    '          "type": "string"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "uint256",\n' +
                    '          "name": "filledAt",\n' +
                    '          "type": "uint256"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "uint256",\n' +
                    '          "name": "aUsdBalance",\n' +
                    '          "type": "uint256"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "spender",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "orderExecuted",\n' +
                    '      "outputs": [],\n' +
                    '      "stateMutability": "nonpayable",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "recipient",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "symbol",\n' +
                    '          "type": "string"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "uint256",\n' +
                    '          "name": "buyingPower",\n' +
                    '          "type": "uint256"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "message",\n' +
                    '          "type": "string"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "spender",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "orderFailed",\n' +
                    '      "outputs": [],\n' +
                    '      "stateMutability": "nonpayable",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "pause",\n' +
                    '      "outputs": [],\n' +
                    '      "stateMutability": "nonpayable",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "paused",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "bool",\n' +
                    '          "name": "",\n' +
                    '          "type": "bool"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "proxiableUUID",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "bytes32",\n' +
                    '          "name": "",\n' +
                    '          "type": "bytes32"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "bytes32",\n' +
                    '          "name": "role",\n' +
                    '          "type": "bytes32"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "account",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "renounceRole",\n' +
                    '      "outputs": [],\n' +
                    '      "stateMutability": "nonpayable",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "recipient",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "revokeMintAndBurnRole",\n' +
                    '      "outputs": [],\n' +
                    '      "stateMutability": "nonpayable",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "bytes32",\n' +
                    '          "name": "role",\n' +
                    '          "type": "bytes32"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "account",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "revokeRole",\n' +
                    '      "outputs": [],\n' +
                    '      "stateMutability": "nonpayable",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "",\n' +
                    '          "type": "string"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "securityTokens",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "walletAddress",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "aUsdAddress",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "symbol",\n' +
                    '          "type": "string"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "uint256",\n' +
                    '          "name": "quantity",\n' +
                    '          "type": "uint256"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "spender",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "sellSecurityToken",\n' +
                    '      "outputs": [],\n' +
                    '      "stateMutability": "nonpayable",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "contract aUSD",\n' +
                    '          "name": "aUsdAddress",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "contract KYC",\n' +
                    '          "name": "kycAddress",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "contract MarketCalendar",\n' +
                    '          "name": "marketCalendarAddress",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "contract LM",\n' +
                    '          "name": "lmTokenAddress",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "setAddresses",\n' +
                    '      "outputs": [],\n' +
                    '      "stateMutability": "nonpayable",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "bytes4",\n' +
                    '          "name": "interfaceId",\n' +
                    '          "type": "bytes4"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "supportsInterface",\n' +
                    '      "outputs": [\n' +
                    '        {\n' +
                    '          "internalType": "bool",\n' +
                    '          "name": "",\n' +
                    '          "type": "bool"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "view",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [],\n' +
                    '      "name": "unpause",\n' +
                    '      "outputs": [],\n' +
                    '      "stateMutability": "nonpayable",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "newImplementation",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "upgradeTo",\n' +
                    '      "outputs": [],\n' +
                    '      "stateMutability": "nonpayable",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "newImplementation",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "bytes",\n' +
                    '          "name": "data",\n' +
                    '          "type": "bytes"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "upgradeToAndCall",\n' +
                    '      "outputs": [],\n' +
                    '      "stateMutability": "payable",\n' +
                    '      "type": "function"\n' +
                    '    }\n' +
                    '  ],\n' +
                    '  "bytecode": "0x60a0604052306080523480156200001557600080fd5b506200002062000026565b620000e8565b600054610100900460ff1615620000935760405162461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b606482015260840160405180910390fd5b60005460ff9081161015620000e6576000805460ff191660ff9081179091556040519081527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b565b608051614f4d6200012e600039600081816111d9015281816112710152818161167e01528181611716015281816118140152818161279f01526128370152614f4d6000f3fe608060405260043610620003175760003560e01c8063629bc15511620001a35780639d81f9e111620000e7578063d547741f1162000095578063f1935fd4116200006c578063f1935fd41462000a69578063f72c0d8b1462000ab4578063fcca64041462000aea57600080fd5b8063d547741f14620009c8578063da48f4ad14620009ed578063e63ab1e91462000a3357600080fd5b8063a82df14211620000ca578063a82df142146200094a578063d414daac146200096f578063d5391393146200099257600080fd5b80639d81f9e11462000910578063a217fddf146200093357600080fd5b80638129fc1c116200015157806385b38eed116200012857806385b38eed146200087c57806388fff29314620008a157806391d1485414620008c657600080fd5b80638129fc1c1462000834578063835d9c58146200084c5780638456cb59146200086457600080fd5b80636dbac5f811620001865780636dbac5f8146200079f5780637989ad6814620007c45780637cfb3d71146200080f57600080fd5b8063629bc15514620007575780636d3123eb146200077c57600080fd5b80633659cfe6116200026b5780634a945f8d116200021957806352d1902d11620001f057806352d1902d14620007025780635c975abb146200071a5780635ff53fc4146200073457600080fd5b80634a945f8d146200067b5780634f1ef28614620006a05780634ffcfbe114620006b757600080fd5b80633f4ba83a116200024e5780633f4ba83a146200060057806345576f941462000618578063465c4105146200065657600080fd5b80633659cfe614620005905780633afea58614620005b557600080fd5b80631bc9905111620002c95780632f2ff15d11620002ac5780632f2ff15d14620004fb5780633623ce90146200052057806336568abe146200056b57600080fd5b80631bc99051146200046d578063248a9ca314620004b857600080fd5b80630b317e7911620002fe5780630b317e7914620003b05780631882140014620003d757806319b4881a146200042257600080fd5b806301ffc9a7146200031c57806307d725da1462000356575b600080fd5b3480156200032957600080fd5b50620003416200033b366004620032e9565b62000b0f565b60405190151581526020015b60405180910390f35b3480156200036357600080fd5b50620003a16040518060400160405280601081526020017f4d61726b657420697320636c6f7365640000000000000000000000000000000081525081565b6040516200034d919062003381565b348015620003bd57600080fd5b50620003d5620003cf366004620033ac565b62000ba9565b005b348015620003e457600080fd5b50620003a16040518060400160405280601581526020017f4c696d696e616c2e6d61726b65742073796d626f6c000000000000000000000081525081565b3480156200042f57600080fd5b50620003a16040518060400160405280601a81526020017f596f7520646f6e2774206861766520656e6f756768206155534400000000000081525081565b3480156200047a57600080fd5b50620003a16040518060400160405280601681526020017f53796d626f6c2063616e6e6f7420626520656d7074790000000000000000000081525081565b348015620004c557600080fd5b50620004ec620004d736600462003406565b60009081526097602052604090206001015490565b6040519081526020016200034d565b3480156200050857600080fd5b50620003d56200051a36600462003420565b62001111565b3480156200052d57600080fd5b50620003a16040518060400160405280601d81526020017f536563757269747920746f6b656e20616c72656164792065786973747300000081525081565b3480156200057857600080fd5b50620003d56200058a36600462003420565b6200113f565b3480156200059d57600080fd5b50620003d5620005af36600462003453565b620011cf565b348015620005c257600080fd5b50620003a16040518060400160405280601681526020017f416464726573732063616e6e6f74206265207a65726f0000000000000000000081525081565b3480156200060d57600080fd5b50620003d562001375565b3480156200062557600080fd5b506200063d620006373660046200354e565b620013ab565b6040516001600160a01b0390911681526020016200034d565b3480156200066357600080fd5b5062000341620006753660046200358f565b620015a8565b3480156200068857600080fd5b50620003d56200069a366004620035fa565b62001605565b620003d5620006b136600462003654565b62001674565b348015620006c457600080fd5b50620003a16040518060400160405280601f81526020017f596f752063616e206f6e6c792073656e6420746f206155534420746f6b656e0081525081565b3480156200070f57600080fd5b50620004ec62001807565b3480156200072757600080fd5b5060335460ff1662000341565b3480156200074157600080fd5b5061012d546200063d906001600160a01b031681565b3480156200076457600080fd5b506200063d620007763660046200354e565b620018ce565b3480156200078957600080fd5b5061012e546200063d906001600160a01b031681565b348015620007ac57600080fd5b50620003d5620007be366004620036b5565b62001902565b348015620007d157600080fd5b50620003a16040518060400160405280601f81526020017f54686973206973206e6f742076616c696420746f6b656e20616464726573730081525081565b3480156200081c57600080fd5b50620003d56200082e36600462003453565b62001965565b3480156200084157600080fd5b50620003d56200199e565b3480156200085957600080fd5b50620003a162001b6b565b3480156200087157600080fd5b50620003d562001b88565b3480156200088957600080fd5b50620003d56200089b36600462003453565b62001bbe565b348015620008ae57600080fd5b50620003d5620008c03660046200371e565b62001bf7565b348015620008d357600080fd5b5062000341620008e536600462003420565b60009182526097602090815260408084206001600160a01b0393909316845291905290205460ff1690565b3480156200091d57600080fd5b5061012f546200063d906001600160a01b031681565b3480156200094057600080fd5b50620004ec600081565b3480156200095757600080fd5b50620003d562000969366004620037e5565b620020de565b3480156200097c57600080fd5b50610131546200063d906001600160a01b031681565b3480156200099f57600080fd5b50620004ec7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b348015620009d557600080fd5b50620003d5620009e736600462003420565b62002536565b348015620009fa57600080fd5b506200063d62000a0c3660046200354e565b8051602081830181018051610130825292820191909301209152546001600160a01b031681565b34801562000a4057600080fd5b50620004ec7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a81565b34801562000a7657600080fd5b50620003a16040518060400160405280601e81526020017f4f6e6c79206155534420636f6e74726163742063616e2063616c6c206d65000081525081565b34801562000ac157600080fd5b50620004ec7f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e381565b34801562000af757600080fd5b50620003d562000b0936600462003870565b6200255f565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f7965db0b00000000000000000000000000000000000000000000000000000000148062000ba357507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff000000000000000000000000000000000000000000000000000000008316145b92915050565b62000bb3620025de565b61012d546001600160a01b031633148062000bd657506001600160a01b03811615155b6040518060400160405280601e81526020017f4f6e6c79206155534420636f6e74726163742063616e2063616c6c206d6500008152509062000c365760405162461bcd60e51b815260040162000c2d919062003381565b60405180910390fd5b5061012f60009054906101000a90046001600160a01b03166001600160a01b031663d4ce85f36040518163ffffffff1660e01b8152600401602060405180830381865afa15801562000c8c573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000cb2919062003902565b6040518060400160405280601081526020017f4d61726b657420697320636c6f736564000000000000000000000000000000008152509062000d095760405162461bcd60e51b815260040162000c2d919062003381565b5061012d546040516370a0823160e01b81526001600160a01b03868116600483015260009216906370a0823190602401602060405180830381865afa15801562000d57573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000d7d919062003926565b9050828110156040518060400160405280601a81526020017f596f7520646f6e2774206861766520656e6f75676820615553440000000000008152509062000dda5760405162461bcd60e51b815260040162000c2d919062003381565b5061012e546040517f8b1b925f0000000000000000000000000000000000000000000000000000000081526001600160a01b0387811660048301526000921690638b1b925f90602401600060405180830381865afa15801562000e41573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405262000e6b919081019062003940565b90506000859050306001600160a01b0316816001600160a01b0316638da5cb5b6040518163ffffffff1660e01b8152600401602060405180830381865afa15801562000ebb573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000ee19190620039b7565b6001600160a01b0316146040518060400160405280601f81526020017f54686973206973206e6f742076616c696420746f6b656e2061646472657373008152509062000f425760405162461bcd60e51b815260040162000c2d919062003381565b506000816001600160a01b03166395d89b416040518163ffffffff1660e01b8152600401600060405180830381865afa15801562000f84573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405262000fae919081019062003940565b90506001600160a01b03851662000fc3573094505b610131546040517f167eaea40000000000000000000000000000000000000000000000000000000081526001600160a01b038a811660048301526024820189905287811660448301529091169063167eaea490606401600060405180830381600087803b1580156200103457600080fd5b505af115801562001049573d6000803e3d6000fd5b505061012d546001600160a01b03169150635b4529899050896200106e8988620039ed565b60016040518463ffffffff1660e01b8152600401620010909392919062003a03565b600060405180830381600087803b158015620010ab57600080fd5b505af1158015620010c0573d6000803e3d6000fd5b505050507f7e5d12bbde79004142810629c5e42ea48221200745f25bf60cfcc2e5d0f2db7d888785848b8a604051620010ff9695949392919062003a47565b60405180910390a15050505050505050565b6000828152609760205260409020600101546200112e8162002635565b6200113a838362002641565b505050565b6001600160a01b0381163314620011bf5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201527f20726f6c657320666f722073656c660000000000000000000000000000000000606482015260840162000c2d565b620011cb8282620026e5565b5050565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001630036200126f5760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201527f64656c656761746563616c6c0000000000000000000000000000000000000000606482015260840162000c2d565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316620012cb7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b6001600160a01b031614620013495760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201527f6163746976652070726f78790000000000000000000000000000000000000000606482015260840162000c2d565b620013548162002769565b6040805160008082526020820190925262001372918391906200291a565b50565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a620013a18162002635565b6200137262002ac6565b6000620013b7620025de565b815160408051808201909152601681527f53796d626f6c2063616e6e6f7420626520656d707479000000000000000000006020820152906200140e5760405162461bcd60e51b815260040162000c2d919062003381565b5060006001600160a01b0316610130836040516200142d919062003aa2565b90815260408051918290036020908101832054838301909252601d83527f536563757269747920746f6b656e20616c7265616479206578697374730000009083015290916001600160a01b03909116146200149d5760405162461bcd60e51b815260040162000c2d919062003381565b5060006040518060400160405280601581526020017f4c696d696e616c2e6d61726b65742073796d626f6c000000000000000000000081525083604051620014e590620032db565b620014f292919062003ac0565b604051809103906000f0801580156200150f573d6000803e3d6000fd5b509050600081905080610130856040516200152b919062003aa2565b90815260405190819003602001812080546001600160a01b039390931673ffffffffffffffffffffffffffffffffffffffff19909316929092179091557f7c56d5eff73d004b4d80f35d05a7e9a2429df1bb9544be59c859d049e2f449fb9062001599908390879062003ae9565b60405180910390a15092915050565b600081604051602001620015bd919062003aa2565b6040516020818303038152906040528051906020012083604051602001620015e6919062003aa2565b6040516020818303038152906040528051906020012014905092915050565b6000620016128162002635565b5061012d80546001600160a01b0395861673ffffffffffffffffffffffffffffffffffffffff199182161790915561012e80549486169482169490941790935561012f8054928516928416929092179091556101318054919093169116179055565b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000163003620017145760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201527f64656c656761746563616c6c0000000000000000000000000000000000000000606482015260840162000c2d565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316620017707f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b6001600160a01b031614620017ee5760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201527f6163746976652070726f78790000000000000000000000000000000000000000606482015260840162000c2d565b620017f98262002769565b620011cb828260016200291a565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614620018a95760405162461bcd60e51b815260206004820152603860248201527f555550535570677261646561626c653a206d757374206e6f742062652063616c60448201527f6c6564207468726f7567682064656c656761746563616c6c0000000000000000606482015260840162000c2d565b507f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc90565b600061013082604051620018e3919062003aa2565b908152604051908190036020019020546001600160a01b031692915050565b6200190c620025de565b60006101308460405162001921919062003aa2565b908152604051908190036020019020546001600160a01b031690508062001950576200194d84620013ab565b90505b6200195e8582858562000ba9565b5050505050565b6000620019728162002635565b620011cb7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a68362001111565b600054610100900460ff1615808015620019bf5750600054600160ff909116105b80620019db5750303b158015620019db575060005460ff166001145b62001a4f5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a6564000000000000000000000000000000000000606482015260840162000c2d565b6000805460ff19166001179055801562001a73576000805461ff0019166101001790555b62001a7d62002b1a565b62001a8762002ba3565b62001a9162002ba3565b62001a9e60003362002641565b62001aca7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a3362002641565b62001af67f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a63362002641565b62001b227f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e33362002641565b801562001372576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a150565b60405180606001604052806026815260200162004ecb6026913981565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a62001bb48162002635565b6200137262002c22565b600062001bcb8162002635565b620011cb7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a68362002536565b62001c01620025de565b7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a662001c2d8162002635565b60408051808201909152601681527f416464726573732063616e6e6f74206265207a65726f0000000000000000000060208201526001600160a01b038b1662001c8b5760405162461bcd60e51b815260040162000c2d919062003381565b506000806101308b60405162001ca2919062003aa2565b908152604051908190036020019020546001600160a01b031690508062001d4f576040517f45576f9400000000000000000000000000000000000000000000000000000000815230906345576f949062001d01908e9060040162003381565b6020604051808303816000875af115801562001d21573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062001d479190620039b7565b915062001e80565b80915062001d93876040518060400160405280600481526020017f696e697400000000000000000000000000000000000000000000000000000000815250620015a8565b801562001e0b57506040516370a0823160e01b81526001600160a01b038d811660048301528316906370a0823190602401602060405180830381865afa15801562001de2573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062001e08919062003926565b15155b1562001e805760405162461bcd60e51b815260206004820152602960248201527f696e69742063616e6e6f742062652063616c6c6564206f6e206578697374696e60448201527f672062616c616e63650000000000000000000000000000000000000000000000606482015260840162000c2d565b6040517f5b4529890000000000000000000000000000000000000000000000000000000081526001600160a01b03831690635b4529899062001ecc908f908e9060039060040162003a03565b600060405180830381600087803b15801562001ee757600080fd5b505af115801562001efc573d6000803e3d6000fd5b505061012d546040517f5b4529890000000000000000000000000000000000000000000000000000000081526001600160a01b039091169250635b452989915062001f51908f90899060039060040162003a03565b600060405180830381600087803b15801562001f6c57600080fd5b505af115801562001f81573d6000803e3d6000fd5b50505050600062001fc8886040518060400160405280600481526020017f696e697400000000000000000000000000000000000000000000000000000000815250620015a8565b6200208457610131546001600160a01b0316637b2841ae8e62001fec8d8d62002c62565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e085901b1681526001600160a01b039283166004820152602481019190915290881660448201526064016020604051808303816000875af11580156200205b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062002081919062003926565b90505b7f63d96cc2b8bb5bdb5a21698ccf602b5d04799801cbaface9d322d180a38c55b48d8d8d8d8d8d8d888e8e604051620020c79a9998979695949392919062003b0d565b60405180910390a150505050505050505050505050565b620020e8620025de565b61012d5460408051808201909152601f81527f596f752063616e206f6e6c792073656e6420746f206155534420746f6b656e006020820152906001600160a01b038681169116146200214f5760405162461bcd60e51b815260040162000c2d919062003381565b5061012f60009054906101000a90046001600160a01b03166001600160a01b031663d4ce85f36040518163ffffffff1660e01b8152600401602060405180830381865afa158015620021a5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620021cb919062003902565b6040518060400160405280601081526020017f4d61726b657420697320636c6f7365640000000000000000000000000000000081525090620022225760405162461bcd60e51b815260040162000c2d919062003381565b50336200222f84620018ce565b6001600160a01b031614806200224d57506001600160a01b03811615155b6040518060400160405280601f81526020017f54686973206973206e6f742076616c696420746f6b656e20616464726573730081525090620022a45760405162461bcd60e51b815260040162000c2d919062003381565b5061012e546040517f8b1b925f0000000000000000000000000000000000000000000000000000000081526001600160a01b0387811660048301526000921690638b1b925f90602401600060405180830381865afa1580156200230b573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405262002335919081019062003940565b6040516370a0823160e01b81526001600160a01b0388166004820152909150339060009082906370a0823190602401602060405180830381865afa15801562002382573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620023a8919062003926565b90508481101560405180606001604052806026815260200162004ecb6026913990620023e95760405162461bcd60e51b815260040162000c2d919062003381565b506001600160a01b038416620023fd573093505b610131546040517f167eaea40000000000000000000000000000000000000000000000000000000081526001600160a01b038a811660048301526000602483015286811660448301529091169063167eaea490606401600060405180830381600087803b1580156200246e57600080fd5b505af115801562002483573d6000803e3d6000fd5b50505050816001600160a01b0316635b452989898784620024a59190620039ed565b60026040518463ffffffff1660e01b8152600401620024c79392919062003a03565b600060405180830381600087803b158015620024e257600080fd5b505af1158015620024f7573d6000803e3d6000fd5b505050507f4341e54645ad9755ed9779b519412751d6965340ce2953951d20ebbfcbdf340b838989898989604051620010ff9695949392919062003b8a565b600082815260976020526040902060010154620025538162002635565b6200113a8383620026e5565b62002569620025de565b7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6620025958162002635565b7fb119d18d6fd69df5ab079683b30b759ed526ca02797650de9c42f2e33c6a57e68686868686604051620025ce95949392919062003be8565b60405180910390a1505050505050565b60335460ff1615620026335760405162461bcd60e51b815260206004820152601060248201527f5061757361626c653a2070617573656400000000000000000000000000000000604482015260640162000c2d565b565b62001372813362002c8c565b60008281526097602090815260408083206001600160a01b038516845290915290205460ff16620011cb5760008281526097602090815260408083206001600160a01b03851684529091529020805460ff19166001179055620026a13390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b60008281526097602090815260408083206001600160a01b038516845290915290205460ff1615620011cb5760008281526097602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b7f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3620027958162002635565b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000163003620028355760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201527f64656c656761746563616c6c0000000000000000000000000000000000000000606482015260840162000c2d565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316620028917f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b6001600160a01b0316146200290f5760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201527f6163746976652070726f78790000000000000000000000000000000000000000606482015260840162000c2d565b620011cb8262002d0a565b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd91435460ff161562002950576200113a8362002d4c565b826001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015620029ad575060408051601f3d908101601f19168201909252620029aa9181019062003926565b60015b62002a215760405162461bcd60e51b815260206004820152602e60248201527f45524331393637557067726164653a206e657720696d706c656d656e7461746960448201527f6f6e206973206e6f742055555053000000000000000000000000000000000000606482015260840162000c2d565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc811462002ab85760405162461bcd60e51b815260206004820152602960248201527f45524331393637557067726164653a20756e737570706f727465642070726f7860448201527f6961626c65555549440000000000000000000000000000000000000000000000606482015260840162000c2d565b506200113a83838362002e19565b62002ad062002e4a565b6033805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b600054610100900460ff1662002b995760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201527f6e697469616c697a696e67000000000000000000000000000000000000000000606482015260840162000c2d565b6200263362002e9e565b600054610100900460ff16620026335760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201527f6e697469616c697a696e67000000000000000000000000000000000000000000606482015260840162000c2d565b62002c2c620025de565b6033805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25862002afd3390565b6000670de0b6b3a764000062002c79838562003c3d565b62002c85919062003c5f565b9392505050565b60008281526097602090815260408083206001600160a01b038516845290915290205460ff16620011cb5762002cc28162002f29565b62002ccf83602062002f3c565b60405160200162002ce292919062003c82565b60408051601f198184030181529082905262461bcd60e51b825262000c2d9160040162003381565b62002d158162002d4c565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b6001600160a01b0381163b62002dcb5760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201527f6f74206120636f6e747261637400000000000000000000000000000000000000606482015260840162000c2d565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b62002e248362002d0a565b60008251118062002e325750805b156200113a5762002e44838362003183565b50505050565b60335460ff16620026335760405162461bcd60e51b815260206004820152601460248201527f5061757361626c653a206e6f7420706175736564000000000000000000000000604482015260640162000c2d565b600054610100900460ff1662002f1d5760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201527f6e697469616c697a696e67000000000000000000000000000000000000000000606482015260840162000c2d565b6033805460ff19169055565b606062000ba36001600160a01b03831660145b6060600062002f4d83600262003c3d565b62002f5a90600262003d07565b67ffffffffffffffff81111562002f755762002f7562003473565b6040519080825280601f01601f19166020018201604052801562002fa0576020820181803683370190505b5090507f30000000000000000000000000000000000000000000000000000000000000008160008151811062002fda5762002fda62003d1d565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053507f78000000000000000000000000000000000000000000000000000000000000008160018151811062003040576200304062003d1d565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535060006200307e84600262003c3d565b6200308b90600162003d07565b90505b600181111562003132577f303132333435363738396162636465660000000000000000000000000000000085600f1660108110620030d057620030d062003d1d565b1a60f81b828281518110620030e957620030e962003d1d565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535060049490941c936200312a8162003d33565b90506200308e565b50831562002c855760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640162000c2d565b60606001600160a01b0383163b620032045760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f60448201527f6e74726163740000000000000000000000000000000000000000000000000000606482015260840162000c2d565b600080846001600160a01b03168460405162003221919062003aa2565b600060405180830381855af49150503d80600081146200325e576040519150601f19603f3d011682016040523d82523d6000602084013e62003263565b606091505b50915091506200328e828260405180606001604052806027815260200162004ef16027913962003297565b95945050505050565b60608315620032a857508162002c85565b62002c858383815115620032bf5781518083602001fd5b8060405162461bcd60e51b815260040162000c2d919062003381565b61117d8062003d4e83390190565b600060208284031215620032fc57600080fd5b81357fffffffff000000000000000000000000000000000000000000000000000000008116811462002c8557600080fd5b60005b838110156200334a57818101518382015260200162003330565b50506000910152565b600081518084526200336d8160208601602086016200332d565b601f01601f19169290920160200192915050565b60208152600062002c85602083018462003353565b6001600160a01b03811681146200137257600080fd5b60008060008060808587031215620033c357600080fd5b8435620033d08162003396565b93506020850135620033e28162003396565b9250604085013591506060850135620033fb8162003396565b939692955090935050565b6000602082840312156200341957600080fd5b5035919050565b600080604083850312156200343457600080fd5b823591506020830135620034488162003396565b809150509250929050565b6000602082840312156200346657600080fd5b813562002c858162003396565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff81118282101715620034b557620034b562003473565b604052919050565b600067ffffffffffffffff821115620034da57620034da62003473565b50601f01601f191660200190565b6000620034ff620034f984620034bd565b62003489565b90508281528383830111156200351457600080fd5b828260208301376000602084830101529392505050565b600082601f8301126200353d57600080fd5b62002c8583833560208501620034e8565b6000602082840312156200356157600080fd5b813567ffffffffffffffff8111156200357957600080fd5b62003587848285016200352b565b949350505050565b60008060408385031215620035a357600080fd5b823567ffffffffffffffff80821115620035bc57600080fd5b620035ca868387016200352b565b93506020850135915080821115620035e157600080fd5b50620035f0858286016200352b565b9150509250929050565b600080600080608085870312156200361157600080fd5b84356200361e8162003396565b93506020850135620036308162003396565b92506040850135620036428162003396565b91506060850135620033fb8162003396565b600080604083850312156200366857600080fd5b8235620036758162003396565b9150602083013567ffffffffffffffff8111156200369257600080fd5b8301601f81018513620036a457600080fd5b620035f085823560208401620034e8565b60008060008060808587031215620036cc57600080fd5b8435620036d98162003396565b9350602085013567ffffffffffffffff811115620036f657600080fd5b62003704878288016200352b565b935050604085013591506060850135620033fb8162003396565b60008060008060008060008060006101208a8c0312156200373e57600080fd5b89356200374b8162003396565b985060208a013567ffffffffffffffff808211156200376957600080fd5b620037778d838e016200352b565b995060408c0135985060608c0135975060808c0135965060a08c0135915080821115620037a357600080fd5b50620037b28c828d016200352b565b94505060c08a0135925060e08a013591506101008a0135620037d48162003396565b809150509295985092959850929598565b600080600080600060a08688031215620037fe57600080fd5b85356200380b8162003396565b945060208601356200381d8162003396565b9350604086013567ffffffffffffffff8111156200383a57600080fd5b62003848888289016200352b565b935050606086013591506080860135620038628162003396565b809150509295509295909350565b600080600080600060a086880312156200388957600080fd5b8535620038968162003396565b9450602086013567ffffffffffffffff80821115620038b457600080fd5b620038c289838a016200352b565b9550604088013594506060880135915080821115620038e057600080fd5b50620038ef888289016200352b565b9250506080860135620038628162003396565b6000602082840312156200391557600080fd5b8151801515811462002c8557600080fd5b6000602082840312156200393957600080fd5b5051919050565b6000602082840312156200395357600080fd5b815167ffffffffffffffff8111156200396b57600080fd5b8201601f810184136200397d57600080fd5b80516200398e620034f982620034bd565b818152856020838501011115620039a457600080fd5b6200328e8260208301602086016200332d565b600060208284031215620039ca57600080fd5b815162002c858162003396565b634e487b7160e01b600052601160045260246000fd5b8181038181111562000ba35762000ba3620039d7565b6001600160a01b038416815260208101839052606081016007831062003a3957634e487b7160e01b600052602160045260246000fd5b826040830152949350505050565b60006001600160a01b03808916835287602084015260c0604084015262003a7260c084018862003353565b838103606085015262003a86818862003353565b9582166080850152509290921660a09091015250949350505050565b6000825162003ab68184602087016200332d565b9190910192915050565b60408152600062003ad5604083018562003353565b82810360208401526200328e818562003353565b6001600160a01b038316815260406020820152600062003587604083018462003353565b60006101406001600160a01b03808e16845281602085015262003b338285018e62003353565b91508b60408501528a606085015289608085015283820360a085015262003b5b828a62003353565b92508760c08501528660e08501528561010085015280851661012085015250509b9a5050505050505050505050565b60c08152600062003b9f60c083018962003353565b6001600160a01b0380891660208501528088166040850152838203606085015262003bcb828862003353565b925085608085015280851660a08501525050979650505050505050565b60006001600160a01b03808816835260a0602084015262003c0d60a084018862003353565b866040850152838103606085015262003c27818762003353565b9250508084166080840152509695505050505050565b600081600019048311821515161562003c5a5762003c5a620039d7565b500290565b60008262003c7d57634e487b7160e01b600052601260045260246000fd5b500490565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835162003cbc8160178501602088016200332d565b7f206973206d697373696e6720726f6c6520000000000000000000000000000000601791840191820152835162003cfb8160288401602088016200332d565b01602801949350505050565b8082018082111562000ba35762000ba3620039d7565b634e487b7160e01b600052603260045260246000fd5b60008162003d455762003d45620039d7565b50600019019056fe60806040523480156200001157600080fd5b506040516200117d3803806200117d833981016040819052620000349162000191565b818162000041336200007c565b60046200004f83826200028a565b5060056200005e82826200028a565b5050600680546001600160a01b031916331790555062000356915050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b634e487b7160e01b600052604160045260246000fd5b600082601f830112620000f457600080fd5b81516001600160401b0380821115620001115762000111620000cc565b604051601f8301601f19908116603f011681019082821181831017156200013c576200013c620000cc565b816040528381526020925086838588010111156200015957600080fd5b600091505b838210156200017d57858201830151818301840152908201906200015e565b600093810190920192909252949350505050565b60008060408385031215620001a557600080fd5b82516001600160401b0380821115620001bd57600080fd5b620001cb86838701620000e2565b93506020850151915080821115620001e257600080fd5b50620001f185828601620000e2565b9150509250929050565b600181811c908216806200021057607f821691505b6020821081036200023157634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200028557600081815260208120601f850160051c81016020861015620002605750805b601f850160051c820191505b8181101562000281578281556001016200026c565b5050505b505050565b81516001600160401b03811115620002a657620002a6620000cc565b620002be81620002b78454620001fb565b8462000237565b602080601f831160018114620002f65760008415620002dd5750858301515b600019600386901b1c1916600185901b17855562000281565b600085815260208120601f198616915b82811015620003275788860151825594840194600190910190840162000306565b5085821015620003465787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b610e1780620003666000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c806370a0823111610097578063a457c2d711610066578063a457c2d7146101eb578063a9059cbb146101fe578063dd62ed3e14610211578063f2fde38b1461024a57600080fd5b806370a0823114610197578063715018a6146101c05780638da5cb5b146101c857806395d89b41146101e357600080fd5b806323b872dd116100d357806323b872dd1461014d578063313ce56714610160578063395093511461016f5780635b4529891461018257600080fd5b806306fdde03146100fa578063095ea7b31461011857806318160ddd1461013b575b600080fd5b61010261025d565b60405161010f9190610bb5565b60405180910390f35b61012b610126366004610beb565b6102ef565b604051901515815260200161010f565b6003545b60405190815260200161010f565b61012b61015b366004610c15565b610309565b6040516012815260200161010f565b61012b61017d366004610beb565b610391565b610195610190366004610c51565b6103d0565b005b61013f6101a5366004610c95565b6001600160a01b031660009081526001602052604090205490565b610195610472565b6000546040516001600160a01b03909116815260200161010f565b610102610486565b61012b6101f9366004610beb565b610495565b61012b61020c366004610beb565b61054f565b61013f61021f366004610cb0565b6001600160a01b03918216600090815260026020908152604080832093909416825291909152205490565b610195610258366004610c95565b6105cb565b60606004805461026c90610ce3565b80601f016020809104026020016040519081016040528092919081815260200182805461029890610ce3565b80156102e55780601f106102ba576101008083540402835291602001916102e5565b820191906000526020600020905b8154815290600101906020018083116102c857829003601f168201915b5050505050905090565b6000336102fd81858561065b565b60019150505b92915050565b6000336103178582856107b3565b6006546001600160a01b031663a82df1428686610332610486565b87866040518663ffffffff1660e01b8152600401610354959493929190610d1d565b600060405180830381600087803b15801561036e57600080fd5b505af1158015610382573d6000803e3d6000fd5b50600198975050505050505050565b3360008181526002602090815260408083206001600160a01b03871684529091528120549091906102fd90829086906103cb908790610d78565b61065b565b6103d8610863565b6001600160a01b0383166000908152600160205260409020548083036103fe5750505050565b8083111561041e57610419846104148386610d8b565b6108bd565b610431565b6104318461042c8584610d8b565b61097e565b7f30244e15ecc10155724345921df69c73800ac2dc40cdb5cb1798bc19dff3edc284848460405161046493929190610d9e565b60405180910390a150505050565b61047a610863565b6104846000610ae9565b565b60606005805461026c90610ce3565b3360008181526002602090815260408083206001600160a01b0387168452909152812054909190838110156105375760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f00000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b610544828686840361065b565b506001949350505050565b6006546000906001600160a01b031663a82df142338561056d610486565b8660006040518663ffffffff1660e01b8152600401610590959493929190610d1d565b600060405180830381600087803b1580156105aa57600080fd5b505af11580156105be573d6000803e3d6000fd5b5060019695505050505050565b6105d3610863565b6001600160a01b03811661064f5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f6464726573730000000000000000000000000000000000000000000000000000606482015260840161052e565b61065881610ae9565b50565b6001600160a01b0383166106d65760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f7265737300000000000000000000000000000000000000000000000000000000606482015260840161052e565b6001600160a01b0382166107525760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f7373000000000000000000000000000000000000000000000000000000000000606482015260840161052e565b6001600160a01b0383811660008181526002602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6001600160a01b038381166000908152600260209081526040808320938616835292905220547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff811461085d57818110156108505760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000604482015260640161052e565b61085d848484840361065b565b50505050565b6000546001600160a01b031633146104845760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161052e565b6001600160a01b0382166109135760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640161052e565b80600360008282546109259190610d78565b90915550506001600160a01b0382166000818152600160209081526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b6001600160a01b0382166109fa5760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f2061646472657360448201527f7300000000000000000000000000000000000000000000000000000000000000606482015260840161052e565b6001600160a01b03821660009081526001602052604090205481811015610a895760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e60448201527f6365000000000000000000000000000000000000000000000000000000000000606482015260840161052e565b6001600160a01b03831660008181526001602090815260408083208686039055600380548790039055518581529192917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3505050565b600080546001600160a01b038381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000815180845260005b81811015610b7757602081850181015186830182015201610b5b565b5060006020828601015260207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f83011685010191505092915050565b602081526000610bc86020830184610b51565b9392505050565b80356001600160a01b0381168114610be657600080fd5b919050565b60008060408385031215610bfe57600080fd5b610c0783610bcf565b946020939093013593505050565b600080600060608486031215610c2a57600080fd5b610c3384610bcf565b9250610c4160208501610bcf565b9150604084013590509250925092565b600080600060608486031215610c6657600080fd5b610c6f84610bcf565b925060208401359150604084013560078110610c8a57600080fd5b809150509250925092565b600060208284031215610ca757600080fd5b610bc882610bcf565b60008060408385031215610cc357600080fd5b610ccc83610bcf565b9150610cda60208401610bcf565b90509250929050565b600181811c90821680610cf757607f821691505b602082108103610d1757634e487b7160e01b600052602260045260246000fd5b50919050565b60006001600160a01b038088168352808716602084015260a06040840152610d4860a0840187610b51565b606084019590955292909216608090910152509392505050565b634e487b7160e01b600052601160045260246000fd5b8082018082111561030357610303610d62565b8181038181111561030357610303610d62565b6001600160a01b0384168152602081018390526060810160078310610dd357634e487b7160e01b600052602160045260246000fd5b82604083015294935050505056fea264697066735822122069e369cd9a6fc2215d84f4da8bdc454b7ee5f2fade4c90ab959e28b8243eda2164736f6c634300081000335175616e746974792063616e6e6f74206265206c6172676572207468656e2062616c616e6365416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a26469706673582212209f4f5ca703765fe8a9491c1ce61a23e789698b6c9eacb2ac073200201d0090d264736f6c63430008100033",\n' +
                    '  "deployedBytecode": "0x608060405260043610620003175760003560e01c8063629bc15511620001a35780639d81f9e111620000e7578063d547741f1162000095578063f1935fd4116200006c578063f1935fd41462000a69578063f72c0d8b1462000ab4578063fcca64041462000aea57600080fd5b8063d547741f14620009c8578063da48f4ad14620009ed578063e63ab1e91462000a3357600080fd5b8063a82df14211620000ca578063a82df142146200094a578063d414daac146200096f578063d5391393146200099257600080fd5b80639d81f9e11462000910578063a217fddf146200093357600080fd5b80638129fc1c116200015157806385b38eed116200012857806385b38eed146200087c57806388fff29314620008a157806391d1485414620008c657600080fd5b80638129fc1c1462000834578063835d9c58146200084c5780638456cb59146200086457600080fd5b80636dbac5f811620001865780636dbac5f8146200079f5780637989ad6814620007c45780637cfb3d71146200080f57600080fd5b8063629bc15514620007575780636d3123eb146200077c57600080fd5b80633659cfe6116200026b5780634a945f8d116200021957806352d1902d11620001f057806352d1902d14620007025780635c975abb146200071a5780635ff53fc4146200073457600080fd5b80634a945f8d146200067b5780634f1ef28614620006a05780634ffcfbe114620006b757600080fd5b80633f4ba83a116200024e5780633f4ba83a146200060057806345576f941462000618578063465c4105146200065657600080fd5b80633659cfe614620005905780633afea58614620005b557600080fd5b80631bc9905111620002c95780632f2ff15d11620002ac5780632f2ff15d14620004fb5780633623ce90146200052057806336568abe146200056b57600080fd5b80631bc99051146200046d578063248a9ca314620004b857600080fd5b80630b317e7911620002fe5780630b317e7914620003b05780631882140014620003d757806319b4881a146200042257600080fd5b806301ffc9a7146200031c57806307d725da1462000356575b600080fd5b3480156200032957600080fd5b50620003416200033b366004620032e9565b62000b0f565b60405190151581526020015b60405180910390f35b3480156200036357600080fd5b50620003a16040518060400160405280601081526020017f4d61726b657420697320636c6f7365640000000000000000000000000000000081525081565b6040516200034d919062003381565b348015620003bd57600080fd5b50620003d5620003cf366004620033ac565b62000ba9565b005b348015620003e457600080fd5b50620003a16040518060400160405280601581526020017f4c696d696e616c2e6d61726b65742073796d626f6c000000000000000000000081525081565b3480156200042f57600080fd5b50620003a16040518060400160405280601a81526020017f596f7520646f6e2774206861766520656e6f756768206155534400000000000081525081565b3480156200047a57600080fd5b50620003a16040518060400160405280601681526020017f53796d626f6c2063616e6e6f7420626520656d7074790000000000000000000081525081565b348015620004c557600080fd5b50620004ec620004d736600462003406565b60009081526097602052604090206001015490565b6040519081526020016200034d565b3480156200050857600080fd5b50620003d56200051a36600462003420565b62001111565b3480156200052d57600080fd5b50620003a16040518060400160405280601d81526020017f536563757269747920746f6b656e20616c72656164792065786973747300000081525081565b3480156200057857600080fd5b50620003d56200058a36600462003420565b6200113f565b3480156200059d57600080fd5b50620003d5620005af36600462003453565b620011cf565b348015620005c257600080fd5b50620003a16040518060400160405280601681526020017f416464726573732063616e6e6f74206265207a65726f0000000000000000000081525081565b3480156200060d57600080fd5b50620003d562001375565b3480156200062557600080fd5b506200063d620006373660046200354e565b620013ab565b6040516001600160a01b0390911681526020016200034d565b3480156200066357600080fd5b5062000341620006753660046200358f565b620015a8565b3480156200068857600080fd5b50620003d56200069a366004620035fa565b62001605565b620003d5620006b136600462003654565b62001674565b348015620006c457600080fd5b50620003a16040518060400160405280601f81526020017f596f752063616e206f6e6c792073656e6420746f206155534420746f6b656e0081525081565b3480156200070f57600080fd5b50620004ec62001807565b3480156200072757600080fd5b5060335460ff1662000341565b3480156200074157600080fd5b5061012d546200063d906001600160a01b031681565b3480156200076457600080fd5b506200063d620007763660046200354e565b620018ce565b3480156200078957600080fd5b5061012e546200063d906001600160a01b031681565b348015620007ac57600080fd5b50620003d5620007be366004620036b5565b62001902565b348015620007d157600080fd5b50620003a16040518060400160405280601f81526020017f54686973206973206e6f742076616c696420746f6b656e20616464726573730081525081565b3480156200081c57600080fd5b50620003d56200082e36600462003453565b62001965565b3480156200084157600080fd5b50620003d56200199e565b3480156200085957600080fd5b50620003a162001b6b565b3480156200087157600080fd5b50620003d562001b88565b3480156200088957600080fd5b50620003d56200089b36600462003453565b62001bbe565b348015620008ae57600080fd5b50620003d5620008c03660046200371e565b62001bf7565b348015620008d357600080fd5b5062000341620008e536600462003420565b60009182526097602090815260408084206001600160a01b0393909316845291905290205460ff1690565b3480156200091d57600080fd5b5061012f546200063d906001600160a01b031681565b3480156200094057600080fd5b50620004ec600081565b3480156200095757600080fd5b50620003d562000969366004620037e5565b620020de565b3480156200097c57600080fd5b50610131546200063d906001600160a01b031681565b3480156200099f57600080fd5b50620004ec7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b348015620009d557600080fd5b50620003d5620009e736600462003420565b62002536565b348015620009fa57600080fd5b506200063d62000a0c3660046200354e565b8051602081830181018051610130825292820191909301209152546001600160a01b031681565b34801562000a4057600080fd5b50620004ec7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a81565b34801562000a7657600080fd5b50620003a16040518060400160405280601e81526020017f4f6e6c79206155534420636f6e74726163742063616e2063616c6c206d65000081525081565b34801562000ac157600080fd5b50620004ec7f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e381565b34801562000af757600080fd5b50620003d562000b0936600462003870565b6200255f565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f7965db0b00000000000000000000000000000000000000000000000000000000148062000ba357507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff000000000000000000000000000000000000000000000000000000008316145b92915050565b62000bb3620025de565b61012d546001600160a01b031633148062000bd657506001600160a01b03811615155b6040518060400160405280601e81526020017f4f6e6c79206155534420636f6e74726163742063616e2063616c6c206d6500008152509062000c365760405162461bcd60e51b815260040162000c2d919062003381565b60405180910390fd5b5061012f60009054906101000a90046001600160a01b03166001600160a01b031663d4ce85f36040518163ffffffff1660e01b8152600401602060405180830381865afa15801562000c8c573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000cb2919062003902565b6040518060400160405280601081526020017f4d61726b657420697320636c6f736564000000000000000000000000000000008152509062000d095760405162461bcd60e51b815260040162000c2d919062003381565b5061012d546040516370a0823160e01b81526001600160a01b03868116600483015260009216906370a0823190602401602060405180830381865afa15801562000d57573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000d7d919062003926565b9050828110156040518060400160405280601a81526020017f596f7520646f6e2774206861766520656e6f75676820615553440000000000008152509062000dda5760405162461bcd60e51b815260040162000c2d919062003381565b5061012e546040517f8b1b925f0000000000000000000000000000000000000000000000000000000081526001600160a01b0387811660048301526000921690638b1b925f90602401600060405180830381865afa15801562000e41573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405262000e6b919081019062003940565b90506000859050306001600160a01b0316816001600160a01b0316638da5cb5b6040518163ffffffff1660e01b8152600401602060405180830381865afa15801562000ebb573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000ee19190620039b7565b6001600160a01b0316146040518060400160405280601f81526020017f54686973206973206e6f742076616c696420746f6b656e2061646472657373008152509062000f425760405162461bcd60e51b815260040162000c2d919062003381565b506000816001600160a01b03166395d89b416040518163ffffffff1660e01b8152600401600060405180830381865afa15801562000f84573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405262000fae919081019062003940565b90506001600160a01b03851662000fc3573094505b610131546040517f167eaea40000000000000000000000000000000000000000000000000000000081526001600160a01b038a811660048301526024820189905287811660448301529091169063167eaea490606401600060405180830381600087803b1580156200103457600080fd5b505af115801562001049573d6000803e3d6000fd5b505061012d546001600160a01b03169150635b4529899050896200106e8988620039ed565b60016040518463ffffffff1660e01b8152600401620010909392919062003a03565b600060405180830381600087803b158015620010ab57600080fd5b505af1158015620010c0573d6000803e3d6000fd5b505050507f7e5d12bbde79004142810629c5e42ea48221200745f25bf60cfcc2e5d0f2db7d888785848b8a604051620010ff9695949392919062003a47565b60405180910390a15050505050505050565b6000828152609760205260409020600101546200112e8162002635565b6200113a838362002641565b505050565b6001600160a01b0381163314620011bf5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201527f20726f6c657320666f722073656c660000000000000000000000000000000000606482015260840162000c2d565b620011cb8282620026e5565b5050565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001630036200126f5760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201527f64656c656761746563616c6c0000000000000000000000000000000000000000606482015260840162000c2d565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316620012cb7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b6001600160a01b031614620013495760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201527f6163746976652070726f78790000000000000000000000000000000000000000606482015260840162000c2d565b620013548162002769565b6040805160008082526020820190925262001372918391906200291a565b50565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a620013a18162002635565b6200137262002ac6565b6000620013b7620025de565b815160408051808201909152601681527f53796d626f6c2063616e6e6f7420626520656d707479000000000000000000006020820152906200140e5760405162461bcd60e51b815260040162000c2d919062003381565b5060006001600160a01b0316610130836040516200142d919062003aa2565b90815260408051918290036020908101832054838301909252601d83527f536563757269747920746f6b656e20616c7265616479206578697374730000009083015290916001600160a01b03909116146200149d5760405162461bcd60e51b815260040162000c2d919062003381565b5060006040518060400160405280601581526020017f4c696d696e616c2e6d61726b65742073796d626f6c000000000000000000000081525083604051620014e590620032db565b620014f292919062003ac0565b604051809103906000f0801580156200150f573d6000803e3d6000fd5b509050600081905080610130856040516200152b919062003aa2565b90815260405190819003602001812080546001600160a01b039390931673ffffffffffffffffffffffffffffffffffffffff19909316929092179091557f7c56d5eff73d004b4d80f35d05a7e9a2429df1bb9544be59c859d049e2f449fb9062001599908390879062003ae9565b60405180910390a15092915050565b600081604051602001620015bd919062003aa2565b6040516020818303038152906040528051906020012083604051602001620015e6919062003aa2565b6040516020818303038152906040528051906020012014905092915050565b6000620016128162002635565b5061012d80546001600160a01b0395861673ffffffffffffffffffffffffffffffffffffffff199182161790915561012e80549486169482169490941790935561012f8054928516928416929092179091556101318054919093169116179055565b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000163003620017145760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201527f64656c656761746563616c6c0000000000000000000000000000000000000000606482015260840162000c2d565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316620017707f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b6001600160a01b031614620017ee5760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201527f6163746976652070726f78790000000000000000000000000000000000000000606482015260840162000c2d565b620017f98262002769565b620011cb828260016200291a565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614620018a95760405162461bcd60e51b815260206004820152603860248201527f555550535570677261646561626c653a206d757374206e6f742062652063616c60448201527f6c6564207468726f7567682064656c656761746563616c6c0000000000000000606482015260840162000c2d565b507f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc90565b600061013082604051620018e3919062003aa2565b908152604051908190036020019020546001600160a01b031692915050565b6200190c620025de565b60006101308460405162001921919062003aa2565b908152604051908190036020019020546001600160a01b031690508062001950576200194d84620013ab565b90505b6200195e8582858562000ba9565b5050505050565b6000620019728162002635565b620011cb7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a68362001111565b600054610100900460ff1615808015620019bf5750600054600160ff909116105b80620019db5750303b158015620019db575060005460ff166001145b62001a4f5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a6564000000000000000000000000000000000000606482015260840162000c2d565b6000805460ff19166001179055801562001a73576000805461ff0019166101001790555b62001a7d62002b1a565b62001a8762002ba3565b62001a9162002ba3565b62001a9e60003362002641565b62001aca7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a3362002641565b62001af67f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a63362002641565b62001b227f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e33362002641565b801562001372576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a150565b60405180606001604052806026815260200162004ecb6026913981565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a62001bb48162002635565b6200137262002c22565b600062001bcb8162002635565b620011cb7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a68362002536565b62001c01620025de565b7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a662001c2d8162002635565b60408051808201909152601681527f416464726573732063616e6e6f74206265207a65726f0000000000000000000060208201526001600160a01b038b1662001c8b5760405162461bcd60e51b815260040162000c2d919062003381565b506000806101308b60405162001ca2919062003aa2565b908152604051908190036020019020546001600160a01b031690508062001d4f576040517f45576f9400000000000000000000000000000000000000000000000000000000815230906345576f949062001d01908e9060040162003381565b6020604051808303816000875af115801562001d21573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062001d479190620039b7565b915062001e80565b80915062001d93876040518060400160405280600481526020017f696e697400000000000000000000000000000000000000000000000000000000815250620015a8565b801562001e0b57506040516370a0823160e01b81526001600160a01b038d811660048301528316906370a0823190602401602060405180830381865afa15801562001de2573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062001e08919062003926565b15155b1562001e805760405162461bcd60e51b815260206004820152602960248201527f696e69742063616e6e6f742062652063616c6c6564206f6e206578697374696e60448201527f672062616c616e63650000000000000000000000000000000000000000000000606482015260840162000c2d565b6040517f5b4529890000000000000000000000000000000000000000000000000000000081526001600160a01b03831690635b4529899062001ecc908f908e9060039060040162003a03565b600060405180830381600087803b15801562001ee757600080fd5b505af115801562001efc573d6000803e3d6000fd5b505061012d546040517f5b4529890000000000000000000000000000000000000000000000000000000081526001600160a01b039091169250635b452989915062001f51908f90899060039060040162003a03565b600060405180830381600087803b15801562001f6c57600080fd5b505af115801562001f81573d6000803e3d6000fd5b50505050600062001fc8886040518060400160405280600481526020017f696e697400000000000000000000000000000000000000000000000000000000815250620015a8565b6200208457610131546001600160a01b0316637b2841ae8e62001fec8d8d62002c62565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e085901b1681526001600160a01b039283166004820152602481019190915290881660448201526064016020604051808303816000875af11580156200205b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062002081919062003926565b90505b7f63d96cc2b8bb5bdb5a21698ccf602b5d04799801cbaface9d322d180a38c55b48d8d8d8d8d8d8d888e8e604051620020c79a9998979695949392919062003b0d565b60405180910390a150505050505050505050505050565b620020e8620025de565b61012d5460408051808201909152601f81527f596f752063616e206f6e6c792073656e6420746f206155534420746f6b656e006020820152906001600160a01b038681169116146200214f5760405162461bcd60e51b815260040162000c2d919062003381565b5061012f60009054906101000a90046001600160a01b03166001600160a01b031663d4ce85f36040518163ffffffff1660e01b8152600401602060405180830381865afa158015620021a5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620021cb919062003902565b6040518060400160405280601081526020017f4d61726b657420697320636c6f7365640000000000000000000000000000000081525090620022225760405162461bcd60e51b815260040162000c2d919062003381565b50336200222f84620018ce565b6001600160a01b031614806200224d57506001600160a01b03811615155b6040518060400160405280601f81526020017f54686973206973206e6f742076616c696420746f6b656e20616464726573730081525090620022a45760405162461bcd60e51b815260040162000c2d919062003381565b5061012e546040517f8b1b925f0000000000000000000000000000000000000000000000000000000081526001600160a01b0387811660048301526000921690638b1b925f90602401600060405180830381865afa1580156200230b573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405262002335919081019062003940565b6040516370a0823160e01b81526001600160a01b0388166004820152909150339060009082906370a0823190602401602060405180830381865afa15801562002382573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620023a8919062003926565b90508481101560405180606001604052806026815260200162004ecb6026913990620023e95760405162461bcd60e51b815260040162000c2d919062003381565b506001600160a01b038416620023fd573093505b610131546040517f167eaea40000000000000000000000000000000000000000000000000000000081526001600160a01b038a811660048301526000602483015286811660448301529091169063167eaea490606401600060405180830381600087803b1580156200246e57600080fd5b505af115801562002483573d6000803e3d6000fd5b50505050816001600160a01b0316635b452989898784620024a59190620039ed565b60026040518463ffffffff1660e01b8152600401620024c79392919062003a03565b600060405180830381600087803b158015620024e257600080fd5b505af1158015620024f7573d6000803e3d6000fd5b505050507f4341e54645ad9755ed9779b519412751d6965340ce2953951d20ebbfcbdf340b838989898989604051620010ff9695949392919062003b8a565b600082815260976020526040902060010154620025538162002635565b6200113a8383620026e5565b62002569620025de565b7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6620025958162002635565b7fb119d18d6fd69df5ab079683b30b759ed526ca02797650de9c42f2e33c6a57e68686868686604051620025ce95949392919062003be8565b60405180910390a1505050505050565b60335460ff1615620026335760405162461bcd60e51b815260206004820152601060248201527f5061757361626c653a2070617573656400000000000000000000000000000000604482015260640162000c2d565b565b62001372813362002c8c565b60008281526097602090815260408083206001600160a01b038516845290915290205460ff16620011cb5760008281526097602090815260408083206001600160a01b03851684529091529020805460ff19166001179055620026a13390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b60008281526097602090815260408083206001600160a01b038516845290915290205460ff1615620011cb5760008281526097602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b7f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3620027958162002635565b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000163003620028355760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201527f64656c656761746563616c6c0000000000000000000000000000000000000000606482015260840162000c2d565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316620028917f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b6001600160a01b0316146200290f5760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201527f6163746976652070726f78790000000000000000000000000000000000000000606482015260840162000c2d565b620011cb8262002d0a565b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd91435460ff161562002950576200113a8362002d4c565b826001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015620029ad575060408051601f3d908101601f19168201909252620029aa9181019062003926565b60015b62002a215760405162461bcd60e51b815260206004820152602e60248201527f45524331393637557067726164653a206e657720696d706c656d656e7461746960448201527f6f6e206973206e6f742055555053000000000000000000000000000000000000606482015260840162000c2d565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc811462002ab85760405162461bcd60e51b815260206004820152602960248201527f45524331393637557067726164653a20756e737570706f727465642070726f7860448201527f6961626c65555549440000000000000000000000000000000000000000000000606482015260840162000c2d565b506200113a83838362002e19565b62002ad062002e4a565b6033805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b600054610100900460ff1662002b995760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201527f6e697469616c697a696e67000000000000000000000000000000000000000000606482015260840162000c2d565b6200263362002e9e565b600054610100900460ff16620026335760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201527f6e697469616c697a696e67000000000000000000000000000000000000000000606482015260840162000c2d565b62002c2c620025de565b6033805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25862002afd3390565b6000670de0b6b3a764000062002c79838562003c3d565b62002c85919062003c5f565b9392505050565b60008281526097602090815260408083206001600160a01b038516845290915290205460ff16620011cb5762002cc28162002f29565b62002ccf83602062002f3c565b60405160200162002ce292919062003c82565b60408051601f198184030181529082905262461bcd60e51b825262000c2d9160040162003381565b62002d158162002d4c565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b6001600160a01b0381163b62002dcb5760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201527f6f74206120636f6e747261637400000000000000000000000000000000000000606482015260840162000c2d565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b62002e248362002d0a565b60008251118062002e325750805b156200113a5762002e44838362003183565b50505050565b60335460ff16620026335760405162461bcd60e51b815260206004820152601460248201527f5061757361626c653a206e6f7420706175736564000000000000000000000000604482015260640162000c2d565b600054610100900460ff1662002f1d5760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201527f6e697469616c697a696e67000000000000000000000000000000000000000000606482015260840162000c2d565b6033805460ff19169055565b606062000ba36001600160a01b03831660145b6060600062002f4d83600262003c3d565b62002f5a90600262003d07565b67ffffffffffffffff81111562002f755762002f7562003473565b6040519080825280601f01601f19166020018201604052801562002fa0576020820181803683370190505b5090507f30000000000000000000000000000000000000000000000000000000000000008160008151811062002fda5762002fda62003d1d565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053507f78000000000000000000000000000000000000000000000000000000000000008160018151811062003040576200304062003d1d565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535060006200307e84600262003c3d565b6200308b90600162003d07565b90505b600181111562003132577f303132333435363738396162636465660000000000000000000000000000000085600f1660108110620030d057620030d062003d1d565b1a60f81b828281518110620030e957620030e962003d1d565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535060049490941c936200312a8162003d33565b90506200308e565b50831562002c855760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640162000c2d565b60606001600160a01b0383163b620032045760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f60448201527f6e74726163740000000000000000000000000000000000000000000000000000606482015260840162000c2d565b600080846001600160a01b03168460405162003221919062003aa2565b600060405180830381855af49150503d80600081146200325e576040519150601f19603f3d011682016040523d82523d6000602084013e62003263565b606091505b50915091506200328e828260405180606001604052806027815260200162004ef16027913962003297565b95945050505050565b60608315620032a857508162002c85565b62002c858383815115620032bf5781518083602001fd5b8060405162461bcd60e51b815260040162000c2d919062003381565b61117d8062003d4e83390190565b600060208284031215620032fc57600080fd5b81357fffffffff000000000000000000000000000000000000000000000000000000008116811462002c8557600080fd5b60005b838110156200334a57818101518382015260200162003330565b50506000910152565b600081518084526200336d8160208601602086016200332d565b601f01601f19169290920160200192915050565b60208152600062002c85602083018462003353565b6001600160a01b03811681146200137257600080fd5b60008060008060808587031215620033c357600080fd5b8435620033d08162003396565b93506020850135620033e28162003396565b9250604085013591506060850135620033fb8162003396565b939692955090935050565b6000602082840312156200341957600080fd5b5035919050565b600080604083850312156200343457600080fd5b823591506020830135620034488162003396565b809150509250929050565b6000602082840312156200346657600080fd5b813562002c858162003396565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff81118282101715620034b557620034b562003473565b604052919050565b600067ffffffffffffffff821115620034da57620034da62003473565b50601f01601f191660200190565b6000620034ff620034f984620034bd565b62003489565b90508281528383830111156200351457600080fd5b828260208301376000602084830101529392505050565b600082601f8301126200353d57600080fd5b62002c8583833560208501620034e8565b6000602082840312156200356157600080fd5b813567ffffffffffffffff8111156200357957600080fd5b62003587848285016200352b565b949350505050565b60008060408385031215620035a357600080fd5b823567ffffffffffffffff80821115620035bc57600080fd5b620035ca868387016200352b565b93506020850135915080821115620035e157600080fd5b50620035f0858286016200352b565b9150509250929050565b600080600080608085870312156200361157600080fd5b84356200361e8162003396565b93506020850135620036308162003396565b92506040850135620036428162003396565b91506060850135620033fb8162003396565b600080604083850312156200366857600080fd5b8235620036758162003396565b9150602083013567ffffffffffffffff8111156200369257600080fd5b8301601f81018513620036a457600080fd5b620035f085823560208401620034e8565b60008060008060808587031215620036cc57600080fd5b8435620036d98162003396565b9350602085013567ffffffffffffffff811115620036f657600080fd5b62003704878288016200352b565b935050604085013591506060850135620033fb8162003396565b60008060008060008060008060006101208a8c0312156200373e57600080fd5b89356200374b8162003396565b985060208a013567ffffffffffffffff808211156200376957600080fd5b620037778d838e016200352b565b995060408c0135985060608c0135975060808c0135965060a08c0135915080821115620037a357600080fd5b50620037b28c828d016200352b565b94505060c08a0135925060e08a013591506101008a0135620037d48162003396565b809150509295985092959850929598565b600080600080600060a08688031215620037fe57600080fd5b85356200380b8162003396565b945060208601356200381d8162003396565b9350604086013567ffffffffffffffff8111156200383a57600080fd5b62003848888289016200352b565b935050606086013591506080860135620038628162003396565b809150509295509295909350565b600080600080600060a086880312156200388957600080fd5b8535620038968162003396565b9450602086013567ffffffffffffffff80821115620038b457600080fd5b620038c289838a016200352b565b9550604088013594506060880135915080821115620038e057600080fd5b50620038ef888289016200352b565b9250506080860135620038628162003396565b6000602082840312156200391557600080fd5b8151801515811462002c8557600080fd5b6000602082840312156200393957600080fd5b5051919050565b6000602082840312156200395357600080fd5b815167ffffffffffffffff8111156200396b57600080fd5b8201601f810184136200397d57600080fd5b80516200398e620034f982620034bd565b818152856020838501011115620039a457600080fd5b6200328e8260208301602086016200332d565b600060208284031215620039ca57600080fd5b815162002c858162003396565b634e487b7160e01b600052601160045260246000fd5b8181038181111562000ba35762000ba3620039d7565b6001600160a01b038416815260208101839052606081016007831062003a3957634e487b7160e01b600052602160045260246000fd5b826040830152949350505050565b60006001600160a01b03808916835287602084015260c0604084015262003a7260c084018862003353565b838103606085015262003a86818862003353565b9582166080850152509290921660a09091015250949350505050565b6000825162003ab68184602087016200332d565b9190910192915050565b60408152600062003ad5604083018562003353565b82810360208401526200328e818562003353565b6001600160a01b038316815260406020820152600062003587604083018462003353565b60006101406001600160a01b03808e16845281602085015262003b338285018e62003353565b91508b60408501528a606085015289608085015283820360a085015262003b5b828a62003353565b92508760c08501528660e08501528561010085015280851661012085015250509b9a5050505050505050505050565b60c08152600062003b9f60c083018962003353565b6001600160a01b0380891660208501528088166040850152838203606085015262003bcb828862003353565b925085608085015280851660a08501525050979650505050505050565b60006001600160a01b03808816835260a0602084015262003c0d60a084018862003353565b866040850152838103606085015262003c27818762003353565b9250508084166080840152509695505050505050565b600081600019048311821515161562003c5a5762003c5a620039d7565b500290565b60008262003c7d57634e487b7160e01b600052601260045260246000fd5b500490565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835162003cbc8160178501602088016200332d565b7f206973206d697373696e6720726f6c6520000000000000000000000000000000601791840191820152835162003cfb8160288401602088016200332d565b01602801949350505050565b8082018082111562000ba35762000ba3620039d7565b634e487b7160e01b600052603260045260246000fd5b60008162003d455762003d45620039d7565b50600019019056fe60806040523480156200001157600080fd5b506040516200117d3803806200117d833981016040819052620000349162000191565b818162000041336200007c565b60046200004f83826200028a565b5060056200005e82826200028a565b5050600680546001600160a01b031916331790555062000356915050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b634e487b7160e01b600052604160045260246000fd5b600082601f830112620000f457600080fd5b81516001600160401b0380821115620001115762000111620000cc565b604051601f8301601f19908116603f011681019082821181831017156200013c576200013c620000cc565b816040528381526020925086838588010111156200015957600080fd5b600091505b838210156200017d57858201830151818301840152908201906200015e565b600093810190920192909252949350505050565b60008060408385031215620001a557600080fd5b82516001600160401b0380821115620001bd57600080fd5b620001cb86838701620000e2565b93506020850151915080821115620001e257600080fd5b50620001f185828601620000e2565b9150509250929050565b600181811c908216806200021057607f821691505b6020821081036200023157634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200028557600081815260208120601f850160051c81016020861015620002605750805b601f850160051c820191505b8181101562000281578281556001016200026c565b5050505b505050565b81516001600160401b03811115620002a657620002a6620000cc565b620002be81620002b78454620001fb565b8462000237565b602080601f831160018114620002f65760008415620002dd5750858301515b600019600386901b1c1916600185901b17855562000281565b600085815260208120601f198616915b82811015620003275788860151825594840194600190910190840162000306565b5085821015620003465787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b610e1780620003666000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c806370a0823111610097578063a457c2d711610066578063a457c2d7146101eb578063a9059cbb146101fe578063dd62ed3e14610211578063f2fde38b1461024a57600080fd5b806370a0823114610197578063715018a6146101c05780638da5cb5b146101c857806395d89b41146101e357600080fd5b806323b872dd116100d357806323b872dd1461014d578063313ce56714610160578063395093511461016f5780635b4529891461018257600080fd5b806306fdde03146100fa578063095ea7b31461011857806318160ddd1461013b575b600080fd5b61010261025d565b60405161010f9190610bb5565b60405180910390f35b61012b610126366004610beb565b6102ef565b604051901515815260200161010f565b6003545b60405190815260200161010f565b61012b61015b366004610c15565b610309565b6040516012815260200161010f565b61012b61017d366004610beb565b610391565b610195610190366004610c51565b6103d0565b005b61013f6101a5366004610c95565b6001600160a01b031660009081526001602052604090205490565b610195610472565b6000546040516001600160a01b03909116815260200161010f565b610102610486565b61012b6101f9366004610beb565b610495565b61012b61020c366004610beb565b61054f565b61013f61021f366004610cb0565b6001600160a01b03918216600090815260026020908152604080832093909416825291909152205490565b610195610258366004610c95565b6105cb565b60606004805461026c90610ce3565b80601f016020809104026020016040519081016040528092919081815260200182805461029890610ce3565b80156102e55780601f106102ba576101008083540402835291602001916102e5565b820191906000526020600020905b8154815290600101906020018083116102c857829003601f168201915b5050505050905090565b6000336102fd81858561065b565b60019150505b92915050565b6000336103178582856107b3565b6006546001600160a01b031663a82df1428686610332610486565b87866040518663ffffffff1660e01b8152600401610354959493929190610d1d565b600060405180830381600087803b15801561036e57600080fd5b505af1158015610382573d6000803e3d6000fd5b50600198975050505050505050565b3360008181526002602090815260408083206001600160a01b03871684529091528120549091906102fd90829086906103cb908790610d78565b61065b565b6103d8610863565b6001600160a01b0383166000908152600160205260409020548083036103fe5750505050565b8083111561041e57610419846104148386610d8b565b6108bd565b610431565b6104318461042c8584610d8b565b61097e565b7f30244e15ecc10155724345921df69c73800ac2dc40cdb5cb1798bc19dff3edc284848460405161046493929190610d9e565b60405180910390a150505050565b61047a610863565b6104846000610ae9565b565b60606005805461026c90610ce3565b3360008181526002602090815260408083206001600160a01b0387168452909152812054909190838110156105375760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f00000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b610544828686840361065b565b506001949350505050565b6006546000906001600160a01b031663a82df142338561056d610486565b8660006040518663ffffffff1660e01b8152600401610590959493929190610d1d565b600060405180830381600087803b1580156105aa57600080fd5b505af11580156105be573d6000803e3d6000fd5b5060019695505050505050565b6105d3610863565b6001600160a01b03811661064f5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f6464726573730000000000000000000000000000000000000000000000000000606482015260840161052e565b61065881610ae9565b50565b6001600160a01b0383166106d65760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f7265737300000000000000000000000000000000000000000000000000000000606482015260840161052e565b6001600160a01b0382166107525760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f7373000000000000000000000000000000000000000000000000000000000000606482015260840161052e565b6001600160a01b0383811660008181526002602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6001600160a01b038381166000908152600260209081526040808320938616835292905220547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff811461085d57818110156108505760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000604482015260640161052e565b61085d848484840361065b565b50505050565b6000546001600160a01b031633146104845760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161052e565b6001600160a01b0382166109135760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640161052e565b80600360008282546109259190610d78565b90915550506001600160a01b0382166000818152600160209081526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b6001600160a01b0382166109fa5760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f2061646472657360448201527f7300000000000000000000000000000000000000000000000000000000000000606482015260840161052e565b6001600160a01b03821660009081526001602052604090205481811015610a895760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e60448201527f6365000000000000000000000000000000000000000000000000000000000000606482015260840161052e565b6001600160a01b03831660008181526001602090815260408083208686039055600380548790039055518581529192917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3505050565b600080546001600160a01b038381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000815180845260005b81811015610b7757602081850181015186830182015201610b5b565b5060006020828601015260207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f83011685010191505092915050565b602081526000610bc86020830184610b51565b9392505050565b80356001600160a01b0381168114610be657600080fd5b919050565b60008060408385031215610bfe57600080fd5b610c0783610bcf565b946020939093013593505050565b600080600060608486031215610c2a57600080fd5b610c3384610bcf565b9250610c4160208501610bcf565b9150604084013590509250925092565b600080600060608486031215610c6657600080fd5b610c6f84610bcf565b925060208401359150604084013560078110610c8a57600080fd5b809150509250925092565b600060208284031215610ca757600080fd5b610bc882610bcf565b60008060408385031215610cc357600080fd5b610ccc83610bcf565b9150610cda60208401610bcf565b90509250929050565b600181811c90821680610cf757607f821691505b602082108103610d1757634e487b7160e01b600052602260045260246000fd5b50919050565b60006001600160a01b038088168352808716602084015260a06040840152610d4860a0840187610b51565b606084019590955292909216608090910152509392505050565b634e487b7160e01b600052601160045260246000fd5b8082018082111561030357610303610d62565b8181038181111561030357610303610d62565b6001600160a01b0384168152602081018390526060810160078310610dd357634e487b7160e01b600052602160045260246000fd5b82604083015294935050505056fea264697066735822122069e369cd9a6fc2215d84f4da8bdc454b7ee5f2fade4c90ab959e28b8243eda2164736f6c634300081000335175616e746974792063616e6e6f74206265206c6172676572207468656e2062616c616e6365416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a26469706673582212209f4f5ca703765fe8a9491c1ce61a23e789698b6c9eacb2ac073200201d0090d264736f6c63430008100033",\n' +
                    '  "linkReferences": {},\n' +
                    '  "deployedLinkReferences": {}\n' +
                    '}'
            },
            './artifacts/contracts/LiminalMarketExternalService.sol/' : {
                'LiminalMarketExternalService.json' : '{\n' +
                    '  "_format": "hh-sol-artifact-1",\n' +
                    '  "contractName": "LiminalMarketExternalService",\n' +
                    '  "sourceName": "contracts/LiminalMarketExternalService.sol",\n' +
                    '  "abi": [\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "liminalMarketAddress",\n' +
                    '          "type": "address"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "stateMutability": "nonpayable",\n' +
                    '      "type": "constructor"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "walletAddress",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "symbol",\n' +
                    '          "type": "string"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "uint256",\n' +
                    '          "name": "amount",\n' +
                    '          "type": "uint256"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "buySecurityToken",\n' +
                    '      "outputs": [],\n' +
                    '      "stateMutability": "nonpayable",\n' +
                    '      "type": "function"\n' +
                    '    },\n' +
                    '    {\n' +
                    '      "inputs": [\n' +
                    '        {\n' +
                    '          "internalType": "address",\n' +
                    '          "name": "walletAddress",\n' +
                    '          "type": "address"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "string",\n' +
                    '          "name": "symbol",\n' +
                    '          "type": "string"\n' +
                    '        },\n' +
                    '        {\n' +
                    '          "internalType": "uint256",\n' +
                    '          "name": "quantity",\n' +
                    '          "type": "uint256"\n' +
                    '        }\n' +
                    '      ],\n' +
                    '      "name": "sellSecurityToken",\n' +
                    '      "outputs": [],\n' +
                    '      "stateMutability": "nonpayable",\n' +
                    '      "type": "function"\n' +
                    '    }\n' +
                    '  ],\n' +
                    '  "bytecode": "0x60a060405234801561001057600080fd5b506040516104f43803806104f483398101604081905261002f91610040565b6001600160a01b0316608052610070565b60006020828403121561005257600080fd5b81516001600160a01b038116811461006957600080fd5b9392505050565b60805161045d6100976000396000818160650152818160a201526101c6015261045d6000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80635070451d1461003b578063c193b4e314610050575b600080fd5b61004e610049366004610255565b610063565b005b61004e61005e366004610255565b610189565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663a82df142847f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16635ff53fc46040518163ffffffff1660e01b8152600401602060405180830381865afa15801561010b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061012f9190610322565b8585306040518663ffffffff1660e01b815260040161015295949392919061038c565b600060405180830381600087803b15801561016c57600080fd5b505af1158015610180573d6000803e3d6000fd5b50505050505050565b6040517f6dbac5f800000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001690636dbac5f8906101529086908690869030906004016103de565b73ffffffffffffffffffffffffffffffffffffffff8116811461022357600080fd5b50565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60008060006060848603121561026a57600080fd5b833561027581610201565b9250602084013567ffffffffffffffff8082111561029257600080fd5b818601915086601f8301126102a657600080fd5b8135818111156102b8576102b8610226565b604051601f8201601f19908116603f011681019083821181831017156102e0576102e0610226565b816040528281528960208487010111156102f957600080fd5b826020860160208301376000602084830101528096505050505050604084013590509250925092565b60006020828403121561033457600080fd5b815161033f81610201565b9392505050565b6000815180845260005b8181101561036c57602081850181015186830182015201610350565b506000602082860101526020601f19601f83011685010191505092915050565b600073ffffffffffffffffffffffffffffffffffffffff8088168352808716602084015260a060408401526103c460a0840187610346565b606084019590955292909216608090910152509392505050565b600073ffffffffffffffffffffffffffffffffffffffff80871683526080602084015261040e6080840187610346565b604084019590955292909216606090910152509291505056fea26469706673582212206780321a289fafece040cc41b8d78b10b6103275b9aaffce86b2777c3c7ac92a64736f6c63430008100033",\n' +
                    '  "deployedBytecode": "0x608060405234801561001057600080fd5b50600436106100365760003560e01c80635070451d1461003b578063c193b4e314610050575b600080fd5b61004e610049366004610255565b610063565b005b61004e61005e366004610255565b610189565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663a82df142847f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16635ff53fc46040518163ffffffff1660e01b8152600401602060405180830381865afa15801561010b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061012f9190610322565b8585306040518663ffffffff1660e01b815260040161015295949392919061038c565b600060405180830381600087803b15801561016c57600080fd5b505af1158015610180573d6000803e3d6000fd5b50505050505050565b6040517f6dbac5f800000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001690636dbac5f8906101529086908690869030906004016103de565b73ffffffffffffffffffffffffffffffffffffffff8116811461022357600080fd5b50565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60008060006060848603121561026a57600080fd5b833561027581610201565b9250602084013567ffffffffffffffff8082111561029257600080fd5b818601915086601f8301126102a657600080fd5b8135818111156102b8576102b8610226565b604051601f8201601f19908116603f011681019083821181831017156102e0576102e0610226565b816040528281528960208487010111156102f957600080fd5b826020860160208301376000602084830101528096505050505050604084013590509250925092565b60006020828403121561033457600080fd5b815161033f81610201565b9392505050565b6000815180845260005b8181101561036c57602081850181015186830182015201610350565b506000602082860101526020601f19601f83011685010191505092915050565b600073ffffffffffffffffffffffffffffffffffffffff8088168352808716602084015260a060408401526103c460a0840187610346565b606084019590955292909216608090910152509392505050565b600073ffffffffffffffffffffffffffffffffffffffff80871683526080602084015261040e6080840187610346565b604084019590955292909216606090910152509291505056fea26469706673582212206780321a289fafece040cc41b8d78b10b6103275b9aaffce86b2777c3c7ac92a64736f6c63430008100033",\n' +
                    '  "linkReferences": {},\n' +
                    '  "deployedLinkReferences": {}\n' +
                    '}\n'
            },
            './artifacts/contracts/KYC.sol/' : {
                'KYC.json' : ''
            },
            './artifacts/contracts/SecurityToken.sol/' : {
                'SecurityToken.json' : ''
            },
            './artifacts/contracts/MarketCalendar.sol/' : {
                'MarketCalendar.json' : ''
            },
            '../liminal.market.app/app/abi/' : {}
        });
        let contractInfo = ContractInfo.getContractInfo(hre.network.name);
        let fileHelper = new FileHelper(hre);
        await fileHelper.writeContractAddressesToJs(contractInfo)

        //TODO: should improve testing here. Validate that files are written and copied

        mock.restore();
    });

    it('should verify cloud constant file is valid', async () => {
        mock.restore();

        let contractInfo = ContractInfo.getContractInfo(hre.network.name);
        let fileHelper = new FileHelper(hre);
        let content = fileHelper.getConstantFile("ContractAddress.cloud", contractInfo);

        expect(content).to.contain(contractInfo.LIMINAL_MARKET_ADDRESS);
        expect(content).to.contain(contractInfo.AUSD_ADDRESS);
        expect(content).to.contain(contractInfo.KYC_ADDRESS);
        expect(content).to.contain(contractInfo.MARKET_CALENDAR_ADDRESS);
        expect(content).to.contain(contractInfo.NetworkName);
        expect(content).not.to.contain('getRelayerAddress');
    });

    it('should verify contract constant file is valid', async () => {
        mock.restore();
        let contractInfo = ContractInfo.getContractInfo(hre.network.name);
        let fileHelper = new FileHelper(hre);
        let content = fileHelper.getConstantFile("ContractAddress.contracts", contractInfo);

        expect(content).to.contain(contractInfo.LIMINAL_MARKET_ADDRESS);
        expect(content).to.contain(contractInfo.AUSD_ADDRESS);
        expect(content).to.contain(contractInfo.KYC_ADDRESS);
        expect(content).to.contain(contractInfo.MARKET_CALENDAR_ADDRESS);
        expect(content).to.contain(contractInfo.NetworkName);
        expect(content).to.contain('getRelayerAddress');
    });

})