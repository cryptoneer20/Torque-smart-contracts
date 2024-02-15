import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-verify"
import "@nomicfoundation/hardhat-toolbox";
import dotenv from 'dotenv'
dotenv.config()

const {
  PRIVATE_KEY,
  API_KEY_ARBITRUM_ONE,
} = process.env;

const config: HardhatUserConfig = {
  sourcify: {
    enabled: true
  },
  paths: {
    sources: "./contracts/TorqueProtocol"
  },
  etherscan: {
    apiKey: {
      arbitrumOne: `${API_KEY_ARBITRUM_ONE}`
    }
  },
  networks: {
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      chainId: 42161,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  solidity: {
    compilers:[
      {
        version: "0.8.19",
        settings: {
          optimizer: process.env["OPTIMIZER_DISABLED"]
            ? { enabled: false }
            : {
                enabled: true,
                runs: 1,
                details: {
                  yulDetails: {
                    optimizerSteps:
                      "dhfoDgvulfnTUtnIf [xa[r]scLM cCTUtTOntnfDIul Lcul Vcul [j] Tpeul xa[rul] xa[r]cL gvif CTUca[r]LsTOtfDnca[r]Iulc] jmul[jul] VcTOcul jmul",
                  },
                },
              },
          outputSelection: {
            "*": {
              "*": ["evm.deployedBytecode.sourceMap"],
            },
          },
          viaIR: process.env["OPTIMIZER_DISABLED"] ? false : true,
        },
      },
      {
        version: "0.8.20",
        settings: {
          optimizer: process.env["OPTIMIZER_DISABLED"]
            ? { enabled: false }
            : {
                enabled: true,
                runs: 1,
                details: {
                  yulDetails: {
                    optimizerSteps:
                      "dhfoDgvulfnTUtnIf [xa[r]scLM cCTUtTOntnfDIul Lcul Vcul [j] Tpeul xa[rul] xa[r]cL gvif CTUca[r]LsTOtfDnca[r]Iulc] jmul[jul] VcTOcul jmul",
                  },
                },
              },
          outputSelection: {
            "*": {
              "*": ["evm.deployedBytecode.sourceMap"],
            },
          },
          viaIR: process.env["OPTIMIZER_DISABLED"] ? false : true,
        },
      },
    ]
  }
};

export default config;
