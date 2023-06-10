import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { client } from "@/lib/sanityClient";
import { contractABI, contractAddress } from "@/lib/constants";
import fetch from "node-fetch";

export const TransactionContext = React.createContext();

let eth;

// get ethereum Object
if (typeof window !== "undefined") {
    eth = window.ethereum;
}

// get deployed contract
const getEtheriumContract = () => {
    const provider = new ethers.providers.Web3Provider(eth);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(
        contractAddress,
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
    const [formData, setFormData] = useState({
        addressTo: "",
        amount: "",
    });

    // check connection of wallet
    useEffect(() => {
        checkIfWallterIsConnected();
    }, []);

    // create new user profile in db
    useEffect(() => {
        if (!currentAccount) return;
        (async () => {
            const userDoc = {
                _type: "users",
                _id: currentAccount,
                userName: "Unnamed",
                address: currentAccount,
            };

            await client.createIfNotExists(userDoc);
        })();
    }, [currentAccount]);

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

            const { addressTo, amount } = formData;

            // get AtomicCloak contract
            const atomicCloak = getEtheriumContract();

            // const parsedAmount = ethers.utils.parseEther(amount);

            const secret = ethers.utils.randomBytes(32);
            console.log("Secret: ", Buffer.from(secret).toString("hex"));
            const [qx, qy] = await atomicCloak.commitmentFromSecret(secret);
            console.log("qx:", qx);
            console.log("qy:", qy);
            const recipient = "0xBDd182877dEc564d96c4A6e21920F237487d01aD";
            const provider = new ethers.providers.Web3Provider(eth);
            const blockNumBefore = await provider.getBlockNumber();
            const blockBefore = await provider.getBlock(blockNumBefore);
            const timestampBefore = blockBefore.timestamp;

            const trs = await atomicCloak.openETH(
                qx,
                qy,
                recipient,
                timestampBefore + 100,
                {
                    value: 100,
                }
            );
            const receipt = await trs.wait();
            console.log("receipt:", receipt);

            const response = await fetch("http://localhost:7777/swap", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    z: Buffer.from(secret).toString("hex"),
                }),
            });

            const data = await response.json();

            console.log(data);

            // setting app state
            setIsLoading(true);
            setFormData({
                addressTo: "",
                amount: "",
            });

            // wait for transaction to complete
            await transactionHash.wait();

            // save transaction data to db
            await saveTransaction(
                transactionHash.hash,
                amount,
                connectedAccount,
                addressTo
            );

            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    // handle form data
    const handleChange = (e, name) => {
        setFormData((prevState) => ({
            ...prevState,
            [name]: e.target.value,
        }));
    };

    // save transaction to db
    const saveTransaction = async (
        txHash,
        amount,
        fromAddress = currentAccount,
        toAddress
    ) => {
        const txDoc = {
            _type: "transactions",
            _id: txHash,
            fromAddress: fromAddress,
            toAddress: toAddress,
            timestamp: new Date(Date.now()).toISOString(),
            txHash: txHash,
            amount: parseFloat(amount),
        };

        await client.createIfNotExists(txDoc);

        // link the transaction to the user
        await client
            .patch(currentAccount)
            .setIfMissing({ transactions: [] })
            .insert("after", "transactions[-1]", [
                {
                    _key: txHash,
                    _ref: txHash,
                    _type: "reference",
                },
            ])
            .commit();
        return;
    };

    // Triger Loading Model
    useEffect(() => {
        if (isLoading) {
            router.push(`/?loading=${currentAccount}`);
        } else {
            router.push("/");
        }
    }, [isLoading]);

    return (
        <TransactionContext.Provider
            value={{
                currentAccount,
                connectWallet,
                sendOpenSwapTransaction,
                handleChange,
                formData,
                isLoading,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
};
