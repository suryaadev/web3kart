// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat")
const { items } = require("../src/items.json")

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), "ether")
}

async function main() {}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const kartFactory = await hre.ethers.getContractFactory("")
const kartContract = await kartFactory.deploy()
await kartContract.deployed()
console.log(`Contract deployed at ::: ${kartContract.address}`)
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exitCode = 1
    })
