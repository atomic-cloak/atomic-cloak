require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.18",
            },
        ],
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
            quiet: true,
        },
    },
    defaultNetwork: "hardhat",
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    networks: {
        hardhat: {},
        mumbai: {
            url: process.env.ENDPOINT_URL_MUMBAI,
            accounts: [process.env.SK_FRITTURA],
        },
        goerli: {
            url: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
            accounts: [process.env.SK_FRITTURA],
        },
        sepolia: {
            url: process.env.ENDPOINT_URL_SEPOLIA,
            accounts: [process.env.SK_FRITTURA],
        },
        optimism_goerli: {
            url: process.env.ENDPOINT_URL_OPTIMISM_GOERLI,
            accounts: [process.env.SK_FRITTURA],
        },
        mantle: {
            url: process.env.ENDPOINT_URL_MANTLE,
            accounts: [process.env.SK_FRITTURA],
        },
        zksync: {
            url: "https://testnet.era.zksync.dev",
            ethNetwork: "https://rpc.ankr.com/eth_goerli", // RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
            zksync: true,
        },
    },
};
