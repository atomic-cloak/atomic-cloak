import { useContext } from "react";
import Image from "next/image";
import {Card, GreenCard, YellowCard} from "@/components/Section";
import Loader from "@/components/Loader";
import Chains from "@/components/Section/Chains";
import Quantity from "@/components/Section/Quantity";
import { TransactionContext } from "@/providers/TransactionProvider";
import { ethers } from "ethers";

const style = {
  content: `bg-[#191B1F] w-[30rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none w-full`,
  transferPropInput2: `bg-transparent text-white outline-none w-full`,
  transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-4 border border-[#20242A] hover:border-[#41444F] flex justify-between`,
  swapButton: `bg-[#3898FF] w-full my-2 rounded-2xl py-4 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
  swapPassed: `bg-[#444444] my-2 rounded-2xl py-4 px-8 text-xl font-semibold flex items-center justify-center`,
};

const getChainName = (chainId: number) =>{
    if(chainId == 11155111){
        return "Sepolia";
    }else if(chainId == 80001){
        return "Mumbai";
    }else if(chainId == 420){
        return "Optimism Goerli";
    }else if(chainId == 324){
        return "ZkSyncEra";
    }else if(chainId == 5001){
        return "Mantle";
    } else if(chainId == 280){
        return "zkSync Era Testnet";
    }else {
        return "Unknown";
    }

};

export const Main = () => {
  const {
    close,
    status,
    isLoading,
    formData,
    swapDetails,
    handleChange,
    mirrorSwapDetails,
    sendOpenSwapTransaction,
  } = useContext(TransactionContext);

  const handleSubmit = (e: any) => {
    if (!isLoading) {
      const { addressTo } = formData;
      e.preventDefault();
      console.log("addressTo", addressTo);
      sendOpenSwapTransaction();
    }
  };

  return (
    <div className="-mx-4 grid max-w-2xl grid-cols-1 gap-y-10 sm:mx-auto lg:-mx-8 lg:max-w-none lg:grid-cols-2 xl:mx-0 xl:gap-x-8 place-items-center">
      {status === "new" && (
        <>
          <GreenCard>
            <div className={style.formHeader}>
              <div>Value</div>
            </div>
            <Quantity />
            <div className={style.formHeader}>
              <div>Receiving Address</div>
            </div>
            <div className={style.transferPropContainer}>
              <input
                type="text"
                className={style.transferPropInput}
                placeholder="0x..."
                value={formData.addressTo}
                onChange={(e) => handleChange(e.target.value, "addressTo")}
              />
            </div>
            <div className={style.formHeader}>
              <div>Receiving Chain</div>
            </div>
            <Chains />
            <div className={style.formHeader}>
              <div>Fee</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>0.0001</div>
            </div>
            <button
              disabled={isLoading || !formData.addressTo ? true : false}
              onClick={(e) => handleSubmit(e)}
              className={style.swapButton}
            >
              {isLoading ? "Swap (pending)" : "Swap"}
            </button>
          </GreenCard>
          
        </>
      )}
      {status === "open" && (
        <>
          <GreenCard>
            <div className={style.formHeader}>
              <div>Value</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
              {ethers.utils.formatEther(swapDetails.value).toString()}
              </div>
            </div>

            <div className={style.formHeader}>
              <div>Chain</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {getChainName(swapDetails.chainID)}
              </div>
            </div>

            <div className={style.formHeader}>
              <div>Expiration time</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {new Date(swapDetails.timestamp* 1000).toUTCString() }
              </div>
            </div>

            <div className={style.formHeader}>
              <div>To</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {swapDetails.recipient}
              </div>
            </div>

            <div className={style.formHeader}>
              <div>Swap ID</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {swapDetails.swapID}
              </div>
            </div>
            <div className={style.swapPassed}>
              Swap Opened (waiting for mirror swap)
            </div>
          </GreenCard>
          
        </>
      )}
      {status === "closeable" && (
        <>
          <GreenCard>
            <div className={style.formHeader}>
              <div>Value</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {ethers.utils.formatEther(swapDetails.value).toString()}
              </div>
            </div>

            <div className={style.formHeader}>
              <div>Chain</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
              {getChainName(swapDetails.chainID)}
              </div>
            </div>

            <div className={style.formHeader}>
              <div>Expiration time</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
              {new Date(swapDetails.timestamp* 1000).toUTCString() }
              </div>
            </div>

            <div className={style.formHeader}>
              <div>To</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {swapDetails.recipient}
              </div>
            </div>

            <div className={style.formHeader}>
              <div>Swap ID</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {swapDetails.swapID}
              </div>
            </div>
            <div className={style.swapPassed}>
              Swap Opened
            </div>
          </GreenCard>
          <YellowCard>
            <div className={style.formHeader}>
              <div>Value</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
              {ethers.utils.formatEther(mirrorSwapDetails.value).toString()}
              </div>
            </div>

            <div className={style.formHeader}>
              <div>Chain</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {getChainName(mirrorSwapDetails.receivingChainID)}
              </div>
            </div>

            <div className={style.formHeader}>
              <div>Expiration time</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
              {new Date(mirrorSwapDetails.timelock* 1000).toUTCString() }
              </div>
            </div>

            <div className={style.formHeader}>
              <div>From</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {mirrorSwapDetails.sender}
              </div>
            </div>

            <div className={style.formHeader}>
              <div>Swap ID</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {mirrorSwapDetails.mirrorSwapId}
              </div>
            </div>
            <button
              onClick={() => close()}
              className={style.swapButton}
            >
              Close Swap
            </button>
          </YellowCard>
        </>
      )}
      {status === "closed" && (
        <>
          <GreenCard>
            <div className={style.formHeader}>
              <div>Value</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
              {ethers.utils.formatEther(swapDetails.value).toString()}
              </div>
            </div>

            <div className={style.formHeader}>
              <div>Chain</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
              {getChainName(swapDetails.chainID)}
              </div>
            </div>

            <div className={style.formHeader}>
              <div>Expiration time </div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
              {new Date(swapDetails.timestamp* 1000).toUTCString() }
              </div>
            </div>

            <div className={style.formHeader}>
              <div>To</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {mirrorSwapDetails.recipient}
              </div>
            </div>

            <div className={style.formHeader}>
              <div>Swap ID</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {swapDetails.swapID}
              </div>
            </div>
            <div className={style.swapPassed}>
              Swap Opened
            </div>
          </GreenCard>
          <YellowCard>
            <div className={style.formHeader}>
              <div>Value</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
              {ethers.utils.formatEther(mirrorSwapDetails.value).toString()}
              </div>
            </div>

            <div className={style.formHeader}>
              <div>Chain</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
              {getChainName(mirrorSwapDetails.receivingChainID)}
              </div>
            </div>

            <div className={style.formHeader}>
              <div>Expiration time</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
              {new Date(mirrorSwapDetails.timelock* 1000).toUTCString() }
              </div>
            </div>

            <div className={style.formHeader}>
              <div>From</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {mirrorSwapDetails.sender}
              </div>
            </div>

            <div className={style.formHeader}>
              <div>Swap ID</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {mirrorSwapDetails.mirrorSwapId}
              </div>
            </div>
            <div className={style.swapPassed}>
              Success
            </div>
          </YellowCard>
        </>
      )}
      {isLoading ? <Loader /> : null}
    </div>
  );
};
