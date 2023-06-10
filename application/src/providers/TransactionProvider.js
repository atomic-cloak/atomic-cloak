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

// get deployed contract
const getAtomicCloakContract = () => {
  const provider = new ethers.providers.Web3Provider(eth);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    ATOMIC_CLOAK_ADDRESS_SEPOLIA,
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
  const [isCreated, setIsCreated] = useState(false);
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "0.001",
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
        amount: "0.001",
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
      setIsCreated(true);
      console.log(response);
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
      // router.push("/swap/" + swapID);
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
        isCreated,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
