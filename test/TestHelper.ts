import {expect} from "chai";
import {ContractReceipt} from "ethers";

export default class TestHelper {
    static LMServiceFeeAddress = '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199';
    static AccessControlErrorMessage = 'AccessControl: account';
    static OwnableErrorMessage = 'Ownable: caller is not the owner';
    static PausedErrorMessage = 'Pausable: paused';

    static AddressZero = '0x0000000000000000000000000000000000000000';

    public static async pauseContract(contract: any, account: string) {
        let result = await contract.pause();
        expect(result).emit(contract, 'Paused').withArgs(account)
    }

    public static async unPauseContract(contract: any, account: string) {
        let result = await contract.unpause();
        expect(result).emit(contract, 'Unpaused').withArgs(account)
    }

    public static async pauseContractReject(contract: any) {
        await expect(contract.pause()).rejectedWith('AccessControl: account');
    }

    public static async unPauseContractReject(contract: any) {
        await expect(contract.unpause()).rejectedWith('AccessControl: account');
    }

    public static async initializeRejected(contract: any) {
        await expect(contract.initialize()).rejectedWith('Initializable: contract is already initialized')
    }

    public static getArgValueFromEvent(tx : ContractReceipt, eventName: string, argName: string) {
        for (let i=0;tx.events && i<tx.events.length;i++) {
            if (tx.events[i].event == eventName) {
                return tx.events[i].args![argName]
            }
        }
        return '';
    }
}