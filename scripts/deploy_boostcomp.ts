import {ethers, run} from "hardhat"

async function main() {
    const [deployer] = await ethers.getSigners()
    console.log("Deployer: "+deployer.address)

    // const UniswapComp = await ethers.getContractFactory('UniswapComp')
    // const uniswapComp = await UniswapComp.deploy(
    //     '0x354a6da3fcde098f8389cad84b0182725c6c91de',
    //     '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    //     '0xc36442b4a4522e871399cd717abdd847ab11fe88',
    //     '0xe592427a0aece92de3edee1f18e0157c05861564'
    // )
    // const uniswapAddress = await uniswapComp.getAddress()
    // console.log("UniswapComp : "+uniswapAddress)
    // await run('verify:verify', {
    //     address: uniswapAddress,
    //     constructorArguments: [
    //         '0x354a6da3fcde098f8389cad84b0182725c6c91de',
    //         '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    //         '0xc36442b4a4522e871399cd717abdd847ab11fe88',
    //         '0xe592427a0aece92de3edee1f18e0157c05861564'
    //     ]
    // })
    const uniswapAddress = '0x4F05c68Adfb73263895a206dB6C6daDd1C6118CC'

    // const sushiComp = await UniswapComp.deploy(
    //     '0x354a6da3fcde098f8389cad84b0182725c6c91de',
    //     '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    //     '0xf0cbce1942a68beb3d1b73f0dd86c8dcc363ef49',
    //     '0xe592427a0aece92de3edee1f18e0157c05861564'
    // )
    // const sushiAddress = await sushiComp.getAddress()
    // console.log("SushiComp : "+sushiAddress)
    // await run('verify:verify', {
    //     address: sushiAddress,
    //     constructorArguments: [
    //         '0x354a6da3fcde098f8389cad84b0182725c6c91de',
    //         '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    //         '0xf0cbce1942a68beb3d1b73f0dd86c8dcc363ef49',
    //         '0xe592427a0aece92de3edee1f18e0157c05861564'
    //     ]
    // })
    const sushiAddress = '0x22306446F3463d03EB5F78e194cC166A4d058E58'

    const BoostComp = await ethers.getContractFactory('BoostComp')
    const boostComp = await BoostComp.deploy(
        'Torque COMP',
        'tCOMP',
        '0x354a6da3fcde098f8389cad84b0182725c6c91de',
        uniswapAddress,
        sushiAddress,
        deployer.address
    )
    const boostAddress = await boostComp.getAddress()
    console.log("BoostComp: "+boostAddress)
    await run('verify:verify', {
        address: boostAddress,
        constructorArguments: [
            'Torque COMP',
            'tCOMP',
            '0x354a6da3fcde098f8389cad84b0182725c6c91de',
            uniswapAddress,
            sushiAddress,
            deployer.address
        ]
    })
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1;
})