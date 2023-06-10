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
        frittura: {
            url: process.env.ENDPOINT_URL_FRITTURA,
            accounts: [process.env.SK_FRITTURA],
        },
    },
};
