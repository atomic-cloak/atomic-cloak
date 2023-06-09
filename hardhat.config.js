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
        sepolia: {
            url: process.env.ENDPOINT_URL_SEPOLIA,
            accounts: [process.env.SK_FRITTURA],
        },
        optimism_goerli: {
            url: process.env.ENDPOINT_URL_OPTIMISM_GOERLI,
            accounts: [process.env.SK_FRITTURA],
        },
        frittura: {
            url: process.env.ENDPOINT_URL_FRITTURA,
            accounts: [process.env.SK_FRITTURA],
        },
    },
};
