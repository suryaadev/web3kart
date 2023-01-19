// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat")
const hre = require("hardhat")
const { items } = require("../src/items.json")

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), "ether")
}

async function main() {
    const deployer = await ethers.getSigner()
    console.log(deployer.address)
    const kartFactory = await hre.ethers.getContractFactory("Dappazon")
    const kartContract = await kartFactory.deploy()
    await kartContract.deployed()

    console.log(`Contract deployed at ::: ${kartContract.address}`)

    // Listing Items
    for (let i = 0; i < items.length; i++) {
        const transaction = await kartContract
            .connect(deployer)
            .listProduct(
                items[i].id,
                items[i].name,
                items[i].category,
                items[i].image,
                tokens(items[i].price),
                items[i].rating,
                items[i].stock
            )
        await transaction.wait()
        console.log(`Listed Item ${items[i].id} : ${items[i].name}`)
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exitCode = 1
    })

// 0x5Cd2be98819c1C3Fa0e9b788F9Bd23C9a6D92710
