import React, { useState, useEffect } from "react";
import fetch from "node-fetch";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { contractABI, ATOMIC_CLOAK_ADDRESS_SEPOLIA } from "@/lib/constants";

export const TransactionContext = React.createContext();

let eth;

// get ethereum Object
if (typeof window !== "undefined") {
    eth = window.ethereum;
}

const contractAddresses = {
    11155111: process.env.ATOMIC_CLOAK_ADDRESS_SEPOLIA,
    80001: process.env.ATOMIC_CLOAK_ADDRESS_MUMBAI,
    420: process.env.ATOMIC_CLOAK_ADDRESS_OPTIMISM,
};

// get deployed contract
const getAtomicCloakContract = (chainID) => {
    const provider = new ethers.providers.Web3Provider(eth);
    const signer = provider.getSigner();
    const address = chainID ? contractAddresses[chainID] : signer.getChainId();
    const transactionContract = new ethers.Contract(
        address,
        contractABI,
        signer
    );
    return transactionContract;
};

export const TransactionProvider = ({ children }) => {
    const router = useRouter();
    // global app states
    const [currentAccount, setCurrentAccount] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPolling, setIsPolling] = useState(false);
    const [formData, setFormData] = useState({
        addressTo: "",
        amount: "0.01",
        receivingChainName: "Sepolia",
    });
    const [swapDetails, setSwapDetails] = useState({
        swapID: "",
        timestamp: "",
        chainID: "",
    });

    // check connection of wallet
    useEffect(() => {
        checkIfWallterIsConnected();
    }, []);

    // to connect to the wallet
    const connectWallet = async (metamask = eth) => {
        try {
            if (!metamask) return alert("Please install metamask ");

            const accounts = await metamask.request({
                method: "eth_requestAccounts",
            });

            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.error(error);
            throw new Error("No ethereum object.");
        }
    };

    // to check wallet connection
    const checkIfWallterIsConnected = async (metamask = eth) => {
        try {
            if (!metamask) return alert("Please install metamask ");
            const accounts = await metamask.request({ method: `eth_accounts` });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
                console.log("Wallet is already connected");
            }
        } catch (error) {
            console.error(error);
            throw new Error("No ethereum object.");
        }
    };

    /* 
    to send transaction 
    */
    const sendOpenSwapTransaction = async (
        metamask = eth,
        connectedAccount = currentAccount
    ) => {
        console.log("sendOpenSwapTransaction");
        try {
            if (!metamask) return alert("Please install metamask ");
            const { addressTo, amount, receivingChainName } = formData;

            // get AtomicCloak contract
            const atomicCloak = getAtomicCloakContract();
            const parsedAmount = ethers.utils.parseEther(amount);

            const secret = ethers.utils.randomBytes(32);
            console.log("Secret: ", Buffer.from(secret).toString("hex"));
            const [qx, qy] = await atomicCloak.commitmentFromSecret(secret);
            console.log("qx:", qx._hex);
            console.log("qy:", qy._hex);
            const provider = new ethers.providers.Web3Provider(eth);
            const blockNumBefore = await provider.getBlockNumber();
            const blockBefore = await provider.getBlock(blockNumBefore);
            const timestampBefore = blockBefore.timestamp;

            const trs = await atomicCloak.openETH(
                qx,
                qy,
                addressTo,
                timestampBefore + 120,
                {
                    value: parsedAmount,
                }
            );

            // setting app state
            setIsLoading(true);
            setFormData({
                addressTo: "",
                amount: "0.01",
                receivingChainName: "Sepolia",
            });
            const receipt = await trs.wait();
            const swapId = await atomicCloak.commitmentToAddress(qx, qy);
            console.log("swapId:", swapId, "from", qx, qy);
            console.log("receipt:", receipt);
            setSwapDetails({
                receivingChainName: receivingChainName,
                timestamp: timestampBefore + 120,
                swapID: swapId,
                chainID: provider.network.name,
            });

            setIsLoading(false);

            const chainIDs = {
                Sepolia: 11155111,
                Mumbai: 80001,
                OptimismGoerli: 420,
                ZkSyncEra: 324,
            };

            const response = await fetch(
                process.env.NEXT_PUBLIC_BACKEND_HOSTNAME + "/api/v1/swap",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({
                        z: "0x" + Buffer.from(secret).toString("hex"),
                        qx: qx._hex,
                        qy: qy._hex,
                        addressTo: addressTo,
                        sendingChainID: provider.network.chainId,
                        receivingChainID: chainIDs[receivingChainName],
                        value: parsedAmount.toString(),
                    }),
                }
            );

            console.log(response);

            // setIsPolling(true);
            setTimeout(async () => {
                await pollSwap(swapId);
            }, 1000);
        } catch (error) {
            setIsLoading(false);
            console.error(error);
        }
    };

    const pollSwap = async (swapId) => {
        const response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_HOSTNAME +
                "/api/v1/swap/mirror/?swapId=" +
                swapId
        );
        const data = await response.json();
        console.log(data);
        if (data.result) {
            console.log(swapId, data.result);
            await sendCloseUserOp(data.result);
            return;
        }

        setTimeout(async () => {
            await pollSwap(swapId);
        }, 1000);
    };

    // handle form data
    const handleChange = (value, name) => {
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const sendCloseUserOp = async (swap, secretKey) => {
        console.log("sendCloseUserOp", swap);
        const atomicCloak = getAtomicCloakContract(swap.receivingChainID);

        const nonce = await atomicCloak.getNonce();
        const payload = {
            jsonrpc: "2.0",
            id: 1,
            method: "eth_sendUserOperation",
            params: [
                {
                    sender: contractAddresses[swap.receivingChainID],
                    nonce: nonce.toString(),
                    initCode: "0x",
                    callData:
                        "0x685da727" +
                        "000000000000000000000000" +
                        swap.mirrorSwapId.slice(2) +
                        secretKey.slice(2),
                    callGasLimit: "0x214C10",
                    verificationGasLimit: "0x06E360",
                    preVerificationGas: "0x06E360",
                    maxFeePerGas: "0x0200",
                    maxPriorityFeePerGas: "0x6f",
                    paymasterAndData: "0x",
                    signature: "0x",
                },
                "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
            ],
        };

        console.log(payload);

        if (swap.receivingChainID === 80001) {
            api_key =
                "fde21eaf3765d1c5fa8bc4ba7b42854beb1b3c0775b2d697286932fbcf3dde1d";
        } else if (swap.receivingChainID === 420) {
            api_key =
                "925e1a222d937314eb66a71b3d73975141b5fd6279293ea1c0da2991c123eb49";
        } else {
            console.log(
                "User op not available on this network, please close with a normal transaction."
            );
            return;
        }
        const response = await fetch(
            "https://api.stackup.sh/v1/node/" + api_key,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                },
                body: JSON.stringify(payload),
            }
        );
        console.log(await response.json());
    };

    return (
        <TransactionContext.Provider
            value={{
                currentAccount,
                connectWallet,
                sendOpenSwapTransaction,
                handleChange,
                formData,
                swapDetails,
                isLoading,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
};
