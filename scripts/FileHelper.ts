import * as fs from 'fs';
import * as Handlebars from "handlebars";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import ContractAddresses from "./addresses/ContractAddresses";

export default class FileHelper {

    hre: HardhatRuntimeEnvironment;

    constructor(hre: HardhatRuntimeEnvironment) {
        this.hre = hre;
    }

    public async writeContractAddressesToJs(addresses: ContractAddresses) {
        Handlebars.registerHelper('upperFirst', (text: string) => {
            return this.UpperFirstLetter(text);
        })

        let constantFile = this.getConstantFile('ContractAddress.contracts', addresses)
        await fs.writeFileSync('./scripts/addresses/' + addresses.NetworkName + '-contract-addresses.ts', constantFile, {encoding: 'utf-8'});

        constantFile = this.getConstantFile('ContractAddress.libraries', addresses)
        await fs.writeFileSync('../liminal.market.libraries/javascript/core/src/networks/' + this.UpperFirstLetter(addresses.NetworkName) + 'Network.ts', constantFile, 'utf-8');
        console.log('write to cloud ' + addresses.NetworkName, constantFile)
        constantFile = this.getConstantFile('ContractAddress.cloud', addresses)
        await fs.writeFileSync('../liminal.market.cloud/src/networks/' + addresses.NetworkName + 'ContractAddresses.ts', constantFile, 'utf-8');

        await this.writeAbiFiles()
    }

    public async writeAbiFiles() {
        let obj: any = {
            liminalMarketAbi: '',
            liminalMarketExternalServiceAbi: ''
        };
        let abi = this.getAbi('LiminalMarket');

        for (let i = 0; i < abi.length; i++) {
            if (abi[i].name == 'OrderExecuted' || abi[i].name == 'getSecurityToken') {
                if (obj.liminalMarketAbi) obj.liminalMarketAbi += ',';
                obj.liminalMarketAbi += '\n' + JSON.stringify(abi[i]);
            }
        }

        abi = this.getAbi('LiminalMarketExternalService');
        for (let i = 0; i < abi.length; i++) {
            if (abi[i].name == 'buySecurityToken' || abi[i].name == 'sellSecurityToken') {
                if (obj.liminalMarketExternalServiceAbi) obj.liminalMarketExternalServiceAbi += ',';
                obj.liminalMarketExternalServiceAbi += '\n' + JSON.stringify(abi[i]);
            }
        }

        obj.balanceOfAbi = JSON.stringify(
            {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        });
        let fileContent = fs.readFileSync('./scripts/templates/Abis.libraries.core.handlebars');
        let template = Handlebars.compile(fileContent.toString());
        let content = template(obj);

        await fs.writeFileSync('../liminal.market.libraries/javascript/core/src/abis.ts', content, {encoding: 'utf-8'});

    }

    public getConstantFile(name: string, addresses: ContractAddresses) {
        let fileContent = fs.readFileSync('./scripts/templates/' + name + '.handlebars');
        let template = Handlebars.compile(fileContent.toString());
        return template(addresses);
    }

    private getAbi(contractName: string) {
        let fileContent = fs.readFileSync('./artifacts/contracts/' + contractName + '.sol/' + contractName + '.json');
        return JSON.parse(fileContent.toString()).abi;
    }

    private UpperFirstLetter(NetworkName: string) {
        return NetworkName.substring(0, 1).toUpperCase() + NetworkName.substring(1);
    }
}
