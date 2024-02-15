import { ethers, run } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log("Deployer: "+deployer.address)

  // const StargateETH = await ethers.getContractFactory('StargateETH')
  // const stargateETH = await StargateETH.deploy(
  //   '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  //   '0x915a55e36a01285a14f05de6e81ed9ce89772f8e',
  //   '0x912ce59144191c1204e64559fe8253a0e49e6548',
  //   '0xbf22f0f184bccbea268df387a49ff5238dd23e40',
  //   '0x9774558534036ff2e236331546691b4eb70594b1',
  //   '0x53Bf833A5d6c4ddA888F69c22C88C9f356a41614',
  //   '0xe592427a0aece92de3edee1f18e0157c05861564',
  // )
  // const stargateAddress = await stargateETH.getAddress()
  // console.log("Stargate : "+stargateAddress)
  // await run('verify:verify',{
  //   address: stargateAddress,
  //   constructorArguments: [
  //     '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  //     '0x915a55e36a01285a14f05de6e81ed9ce89772f8e',
  //     '0x912ce59144191c1204e64559fe8253a0e49e6548',
  //     '0xbf22f0f184bccbea268df387a49ff5238dd23e40',
  //     '0x9774558534036ff2e236331546691b4eb70594b1',
  //     '0x53Bf833A5d6c4ddA888F69c22C88C9f356a41614',
  //     '0xe592427a0aece92de3edee1f18e0157c05861564',
  //   ]
  // })

  const GMXV2ETH = await ethers.getContractFactory('GMXV2ETH')
  const gmxV2ETH = await GMXV2ETH.deploy(
    '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    '0x70d95587d40a2caf56bd97485ab3eec10bee6336',
    '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
    '0x912ce59144191c1204e64559fe8253a0e49e6548',
    '0x7c68c7866a64fa2160f78eeae12217ffbf871fa8',
    '0xe592427a0aece92de3edee1f18e0157c05861564',
    '0xF89e77e8Dc11691C9e8757e84aaFbCD8A67d7A55',
    '0x0628D46b5D145f183AdB6Ef1f2c97eD1C4701C55',
    '0x7452c558d45f8afC8c83dAe62C3f8A5BE19c71f6'
  )
  const gmxV2Address = await gmxV2ETH.getAddress()
  console.log("GMXV2ETH : "+gmxV2Address)
  await run('verify:verify',{
    address: gmxV2Address,
    constructorArguments: [
      '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      '0x70d95587d40a2caf56bd97485ab3eec10bee6336',
      '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
      '0x912ce59144191c1204e64559fe8253a0e49e6548',
      '0x7c68c7866a64fa2160f78eeae12217ffbf871fa8',
      '0xe592427a0aece92de3edee1f18e0157c05861564',
      '0xF89e77e8Dc11691C9e8757e84aaFbCD8A67d7A55',
      '0x0628D46b5D145f183AdB6Ef1f2c97eD1C4701C55',
      '0x7452c558d45f8afC8c83dAe62C3f8A5BE19c71f6'
    ]
  })

  // const gmxV2Address = '0x41141e706f5f631de413fb618536215a959779f0'
  // const stargateAddress = '0x708bbee091138b51165ae9ccc4b0a6af059dc2c0'

  // const BoostETH = await ethers.getContractFactory('BoostETH')
  // const boostETH = await BoostETH.deploy(
  //   'tToken', 'tToken',
  //   '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  //   gmxV2Address, stargateAddress, deployer.address
  // )
  // const boostETHAddress = await boostETH.getAddress()
  // console.log("BoostETH : "+boostETHAddress)
  // await run('verify:verify',{
  //   address: boostETHAddress,
  //   constructorArguments: [
  //     'tToken', 'tToken',
  //     '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  //     gmxV2Address, stargateAddress, deployer.address
  //   ]
  // })
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
