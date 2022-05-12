"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var chai_as_promised_1 = require("chai-as-promised");
var ethereum_waffle_1 = require("ethereum-waffle");
var aUSD_json_1 = require("../../artifacts/contracts/aUSD.sol/aUSD.json");
var ethereum_waffle_2 = require("ethereum-waffle");
describe("aUsd", function () {
    var expect = chai_1.default.expect;
    var hre = require("hardhat");
    var waffle = hre.waffle;
    chai_1.default.use(chai_as_promised_1.default);
    chai_1.default.use(ethereum_waffle_1.solidity);
    var owner, wallet2, wallet3;
    var contract;
    before("compile", function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        hre.run('compile');
                        return [4 /*yield*/, waffle.provider.getWallets()];
                    case 1:
                        _a = _b.sent(), owner = _a[0], wallet2 = _a[1], wallet3 = _a[2];
                        return [4 /*yield*/, redeployContract()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    var redeployContract = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, ethereum_waffle_2.deployContract)(owner, aUSD_json_1.default)];
                    case 1:
                        contract = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    it("Check balance of new deployment", function () {
        return __awaiter(this, void 0, void 0, function () {
            var balanceOf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, redeployContract()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contract.balanceOf(owner.address)];
                    case 2:
                        balanceOf = _a.sent();
                        expect(balanceOf).to.equal(0);
                        return [2 /*return*/];
                }
            });
        });
    });
    it("set balance to wallet", function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, redeployContract()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, contract.setBalance(wallet2.address, 199)];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, contract.balanceOf(wallet2.address)];
                    case 3: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).to.be.equal(199)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    it("Try to set balance, should fail", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contract.connect(wallet3.address)];
                    case 1:
                        contract = _a.sent();
                        return [4 /*yield*/, expect(contract.setBalance(wallet2.address, 199)).to.be.rejected];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    it("give role", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, redeployContract()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contract.grantRoleForBalance(wallet2.address)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    it("Transfer should be rejected", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                expect(contract.transfer(owner.address, 10)).to.be.reverted;
                return [2 /*return*/];
            });
        });
    });
    it("allowance should be rejected", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                expect(contract.allowance(owner.address, wallet2.address)).to.be.reverted;
                return [2 /*return*/];
            });
        });
    });
    it("approve should be rejected", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                expect(contract.approve(owner.address, 10)).to.be.rejected;
                return [2 /*return*/];
            });
        });
    });
    it("transferFrom should be rejected", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                expect(contract.transferFrom(owner.address, wallet2.address, 10)).to.be.reverted;
                return [2 /*return*/];
            });
        });
    });
});
