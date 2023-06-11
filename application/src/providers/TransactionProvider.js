import React, { useState, useEffect } from "react";
import fetch from "node-fetch";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { contractABI } from "@/lib/constants";

export const TransactionContext = React.createContext();

let eth;

// get ethereum Object
if (typeof window !== "undefined") {
  eth = window.ethereum;
}

const contractAddresses = {
  11155111: "0x6a18426245F240B95378a43769b5688B9794875b",
  80001: "0xcE250A659fc1090714c2810ec091F7BB95D27eb4",
  420: "0x272e066945678DeB96736a1904734cdFdFF074c6",
  5001: "0xC0E46AC8E2db831D0D634B8a9b0A5f32fB99c61d",
};

const chainIDs = {
  Sepolia: 11155111,
  Mumbai: 80001,
  OptimismGoerli: 420,
  ZkSyncEra: 324,
  Mantle: 5001,
};

const rpcProviders = {
  11155111: "https://rpc2.sepolia.org/",
  80001: "https://rpc-mumbai.maticvigil.com/",
  420: "https://goerli.optimism.io/",
  5001: "https://rpc.testnet.mantle.xyz",
};

// get deployed contract
const getAtomicCloakContract = async (chainID) => {
  if (chainID) {
    const provider = new ethers.providers.JsonRpcProvider(
      rpcProviders[chainID]
    );

    const address = contractAddresses[chainID];

    const transactionContract = new ethers.Contract(
      address,
      contractABI,
      provider
    );
    return transactionContract;
  }
  const provider = new ethers.providers.Web3Provider(eth);
  const signer = provider.getSigner();
  const _chainID = await signer.getChainId();
  const address = contractAddresses[_chainID];
  console.log("address", address, _chainID, chainID);

  const transactionContract = new ethers.Contract(address, contractABI, signer);
  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const router = useRouter();
  // global app states
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("new");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "0.001",
    receivingChainName: "Sepolia",
  });
  const [swapDetails, setSwapDetails] = useState({
    receivingChainName: "",
    timestamp: 0,
    swapID: "",
    chainID: "",
    secret: "",
    sharedSecret: "",
    value: "",
  });
  const [mirrorSwapDetails, setMirrorSwapDetails] = useState({
    receivingChainName: "",
    timestamp: 0,
    swapID: "",
    chainID: "",
    secret: "",
    sharedSecret: "",
    value: "",
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
      const atomicCloak = await getAtomicCloakContract();
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
      // setFormData({
      //     addressTo: "",
      //     amount: "0.01",
      //     receivingChainName: "Sepolia",
      // });
      const receipt = await trs.wait();
      const swapId = await atomicCloak.commitmentToAddress(qx, qy);
      console.log("swapId:", swapId, "from", qx, qy);
      console.log("receipt:", receipt);
      const _sharedSecret = ethers.utils.randomBytes(32);
      const _swapDetails = {
        receivingChainName: receivingChainName,
        timestamp: timestampBefore + 120,
        swapID: swapId,
        chainID: provider.network.chainId,
        secret: "0x" + Buffer.from(secret).toString("hex"),
        sharedSecret: "0x" + Buffer.from(_sharedSecret).toString("hex"),
        value: parsedAmount.toString(),
      };
      setSwapDetails(_swapDetails);
      setStatus("open");

      console.log("receipt:", _swapDetails);

      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOSTNAME + "/api/v1/swap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            z: "0x" + Buffer.from(_sharedSecret).toString("hex"),
            qx: qx._hex,
            qy: qy._hex,
            addressTo: addressTo,
            sendingChainID: provider.network.chainId,
            receivingChainID: chainIDs[receivingChainName],
            value: parsedAmount.toString(),
          }),
        }
      );

      // console.log(response.data);

      // setIsPolling(true);
      setTimeout(async () => {
        await pollSwap(_swapDetails);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const pollSwap = async (swapDetails) => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOSTNAME +
        "/api/v1/swap/mirror/?swapId=" +
        swapDetails.swapID
    );
    const data = await response.json();
    console.log(data);
    if (data.result) {
      const _mirrorDetails = {
        mirrorSwapId: data.result.mirrorSwapId,
        receivingChainID: data.result.receivingChainID,
        recipient: data.result.recipient,
        sender: data.result.sender,
        sendingChainID: data.result.sendingChainID,
        sharedSecret: data.result.sharedSecret,
        timelock: data.result.timelock,
        tokenContract: data.result.tokenContract,
        value: data.result.value,
      };
      setMirrorSwapDetails(_mirrorDetails);
      setStatus("closeable");
      setIsLoading(false);
      return;
    }

    console.log(response);
    setTimeout(async () => {
      await pollSwap(swapDetails);
    }, 1000);
  };

  const close = async () => {
    const response = await sendCloseUserOp(mirrorSwapDetails, swapDetails);
    setStatus("closed");
  };

  // handle form data
  const handleChange = (value, name) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const sendCloseUserOp = async (swap, swapDetails) => {
    console.log("sendCloseUserOp", swap);
    const atomicCloak = await getAtomicCloakContract(swap.receivingChainID);
    const curveOrder = await atomicCloak.curveOrder();
    console.log(
      "curveOrder:",
      curveOrder._hex,
      swapDetails.secret,
      swapDetails.sharedSecret
    );
    let secretKey =
      BigInt(swapDetails.secret) + BigInt(swapDetails.sharedSecret);
    secretKey %= BigInt(curveOrder._hex);

    console.log("secretKey:", secretKey);

    let s = secretKey.toString(16);
    while (s.length < 32) {
      s = "0" + s;
    }

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
            s,
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
    "0x685da727" +
      "000000000000000000000000" +
      "B8f1a78fcebfEb95dB9238C732418C312a4c22aF";

    console.log("payload", payload);
    let api_key;
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
    const response = await fetch("https://api.stackup.sh/v1/node/" + api_key, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
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
        mirrorSwapDetails,
        isLoading,
        status,
        close,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
