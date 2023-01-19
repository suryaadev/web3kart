const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), "ether")
}

const ID = 1
const NAME = "Shoes"
const CATEGORY = "Clothing"
const IMAGE = "IMAGE"
const COST = tokens(1)
const RATING = 4
const STOCK = 5

describe("Dappazon", () => {
    let dappazon
    let deployer, buyer
    beforeEach(async () => {
        // setup accounts
        ;[deployer, buyer] = await ethers.getSigners()
        // console.log(deployer.address, buyer.address)
        // deploy contract
        const Dappazon = await ethers.getContractFactory("Dappazon")
        dappazon = await Dappazon.deploy()
    })

    describe("Deployment", () => {
        // check owner
        it("set the owner", async () => {
            expect(await dappazon.owner()).to.equal(deployer.address)
        })
    })

    describe("Listing", () => {
        let transaction

        beforeEach(async () => {
            transaction = await dappazon
                .connect(deployer)
                .listProduct(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)

            await transaction.wait()
        })
        // check for attr ID
        it("Returns item attr", async () => {
            const item = await dappazon.items(ID)
            expect(item.id).to.equal(ID)
        })

        // check emit
        it("Emits the List event", () => {
            expect(transaction).to.emit(dappazon, "List")
        })
    })

    describe("Buying", () => {
        let transaction

        beforeEach(async () => {
            // list of item
            transaction = await dappazon
                .connect(deployer)
                .listProduct(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
            await transaction.wait()

            // buy
            transaction = await dappazon.connect(buyer).buy(ID, { value: COST })
        })
        it("Update the contract balance", async () => {
            const result = await ethers.provider.getBalance(dappazon.address)
            expect(result).to.equal(COST)
        })

        it("Update buyers order count", async () => {
            const result = await dappazon.orderCount(buyer.address)
            expect(result).to.equal(1)
        })

        it("Add the order", async () => {
            const order = await dappazon.orders(buyer.address, 1)
            expect(order.time).to.be.greaterThan(0)
            expect(order.item.name).to.equal(NAME)
        })

        it("Emits Buy event", ()=>{
            expect(transaction).to.emit(dappazon,"Buy")
        })
    })
})
