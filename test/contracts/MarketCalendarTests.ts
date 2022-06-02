import chai from "chai";
import {upgrades} from "hardhat";
import chaiAsPromised from "chai-as-promised";
import {solidity} from "ethereum-waffle";
import {smock} from "@defi-wonderland/smock";
import {Wallet} from "ethers";
import {MarketCalendar} from "../../typechain-types";

describe("Test market calendar", () => {

    const expect = chai.expect;
    const hre = require("hardhat");
    const waffle = hre.waffle;

    chai.should();
    chai.use(chaiAsPromised);
    chai.use(solidity);
    chai.use(smock.matchers);
    let contract : MarketCalendar;

    let owner : Wallet, wallet2 : Wallet, wallet3 : Wallet;

    before("Run at start of test", async function () {
        await hre.run('compile');

        [owner, wallet2, wallet3] = waffle.provider.getWallets();

        await redeployContract();
    })

    const redeployContract = async function() {
        const contractFactory = await hre.ethers.getContractFactory('MarketCalendar');
        contract = await upgrades.deployProxy(contractFactory) as MarketCalendar;
    }

    it("should have different open and close array length and revert", async () => {
        let opens = [];
        let closes = [];

        opens[0] = new Date(calendarEntries[0].date + "T" + calendarEntries[0].open + "-05:00").getTime() / 1000;
        closes[0] = new Date(calendarEntries[0].date + "T" + calendarEntries[0].close + "-05:00").getTime() / 1000;
        opens[1] = new Date(calendarEntries[1].date + "T" + calendarEntries[1].open + "-05:00").getTime() / 1000;

        await expect(contract.setCalendar(opens, closes))
            .to.be.revertedWith("opens & closes need to be same length");
    });


    it("should add days and validate that market is open", async () => {
        //new Date("2022-05-31T09:30-05:00")
        let opens = [];
        let closes = [];
        for (let i=0;i<calendarEntries.length;i++) {
            opens[i] = new Date(calendarEntries[i].date + "T" + calendarEntries[i].open + "-05:00").getTime() / 1000;
            closes[i] = new Date(calendarEntries[i].date + "T" + calendarEntries[i].close + "-05:00").getTime() / 1000;
        }
        expect(await contract.setCalendar(opens, closes))
            .to.emit(contract, "CalendarSet").withArgs(opens[0], closes[closes.length-1]);
        expect(await contract.isMarketOpen()).to.be.true;
    })

    it("should add days, market should be closed", async () => {
        //new Date("2022-05-31T09:30-05:00")
        let [opens, closes] = getCalendarWithMarketOpen();

        await contract.setCalendar(opens, closes)
        expect(await contract.isMarketOpen()).to.be.false;
    });

    it("set calendar without having permission", async () => {
        let contractW2 = contract.connect(wallet2.address);
        let [opens, closes] = getCalendarWithMarketOpen();

        await expect(contractW2.setCalendar(opens, closes)).to.be.reverted;

    })

    it("should set role, then set calendar", async () => {
        await contract.grantCalendarRole(wallet2.address);

        let contractW2 = contract.connect(wallet2);
        let [opens, closes] = getCalendarWithMarketOpen();

        expect(await contractW2.setCalendar(opens, closes))
            .to.emit(contractW2, "CalendarSet").withArgs(opens[0], closes[closes.length-1]);
    })

    it("should set permission, then remove permission", async () => {
        await redeployContract();

        expect(await contract.grantCalendarRole(wallet2.address))
            .to.emit(contract, "RoleGranted")
            .withArgs(contract.SET_CALENDAR_ROLE, wallet2.address, owner.address);

        let contractW2 = contract.connect(wallet2);
        let [opens, closes] = getCalendarWithMarketOpen();

        expect(await contractW2.setCalendar(opens, closes))
            .to.emit(contractW2, "CalendarSet").withArgs(opens[0], closes[closes.length-1]);

        expect(await contract.revokeCalendarRole(wallet2.address))
            .to.emit(contract, "RoleRevoked")
            .withArgs(contract.SET_CALENDAR_ROLE, wallet2.address, owner.address);

        await expect(contractW2.setCalendar(opens, closes)).to.be.reverted;
    })


    const getCalendarWithMarketOpen = () => {
        let opens = [];
        let closes = [];
        for (let i=0;i<closeMarketCalendarEntries.length;i++) {
            opens[i] = new Date(closeMarketCalendarEntries[i].date + "T" + closeMarketCalendarEntries[i].open + "-05:00").getTime() / 1000;
            closes[i] = new Date(closeMarketCalendarEntries[i].date + "T" + closeMarketCalendarEntries[i].close + "-05:00").getTime() / 1000;
        }

        return [opens, closes];
    }

    let closeMarketCalendarEntries = [
        {
            "date": "2022-05-26",
            "open": "09:30",
            "close": "16:00",
            "session_open": "0400",
            "session_close": "2000"
        },
        {
            "date": "2022-05-31",
            "open": "09:30",
            "close": "16:00",
            "session_open": "0400",
            "session_close": "2000"
        }
        ];
    let calendarEntries = [
        {
            "date": "2022-05-30",
            "open": "09:30",
            "close": "16:00",
            "session_open": "0400",
            "session_close": "2000"
        },
        {
            "date": "2022-05-31",
            "open": "09:30",
            "close": "16:00",
            "session_open": "0400",
            "session_close": "2000"
        },
        {
            "date": "2022-06-01",
            "open": "09:30",
            "close": "16:00",
            "session_open": "0400",
            "session_close": "2000"
        },
        {
            "date": "2022-06-02",
            "open": "09:30",
            "close": "16:00",
            "session_open": "0400",
            "session_close": "2000"
        },
        {
            "date": "2022-06-03",
            "open": "09:30",
            "close": "16:00",
            "session_open": "0400",
            "session_close": "2000"
        },
        {
            "date": "2022-06-06",
            "open": "09:30",
            "close": "16:00",
            "session_open": "0400",
            "session_close": "2000"
        },
        {
            "date": "2022-06-07",
            "open": "09:30",
            "close": "16:00",
            "session_open": "0400",
            "session_close": "2000"
        },
        {
            "date": "2022-06-08",
            "open": "09:30",
            "close": "16:00",
            "session_open": "0400",
            "session_close": "2000"
        },
        {
            "date": "2022-06-09",
            "open": "09:30",
            "close": "16:00",
            "session_open": "0400",
            "session_close": "2000"
        },
        {
            "date": "2022-06-10",
            "open": "09:30",
            "close": "16:00",
            "session_open": "0400",
            "session_close": "2000"
        },
        {
            "date": "2022-06-13",
            "open": "09:30",
            "close": "16:00",
            "session_open": "0400",
            "session_close": "2000"
        },
        {
            "date": "2022-06-14",
            "open": "09:30",
            "close": "16:00",
            "session_open": "0400",
            "session_close": "2000"
        },
        {
            "date": "2022-06-15",
            "open": "09:30",
            "close": "16:00",
            "session_open": "0400",
            "session_close": "2000"
        },
        {
            "date": "2022-06-16",
            "open": "09:30",
            "close": "16:00",
            "session_open": "0400",
            "session_close": "2000"
        },
        {
            "date": "2022-06-17",
            "open": "09:30",
            "close": "16:00",
            "session_open": "0400",
            "session_close": "2000"
        },
        {
            "date": "2022-06-20",
            "open": "09:30",
            "close": "16:00",
            "session_open": "0400",
            "session_close": "2000"
        }
    ];
})