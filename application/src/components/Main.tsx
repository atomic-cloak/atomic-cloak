import React, { useContext } from "react";
import Chains from "@/components/Chains";
import Quantity from "@/components/Quantity";
import { TransactionContext } from "@/providers/TransactionProvider";

const style = {
  wrapper: `flex justify-center items-center h-screen mt-14`,
  content: `bg-[#191B1F] w-[30rem] rounded-2xl p-4`,
  transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-4 text-xl border border-[#20242A] hover:border-[#41444F] flex justify-between`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none w-full text-2xl`,
  currencySelector: `flex w-1/4`,
  currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36] hover:bg-[#41444F] rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
  currencySelectorIcon: `flex items-center`,
  currencySelectorTicker: `mx-2`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  currencySelectorArrow: `text-lg`,
  swapButton: `bg-[#627EEA] my-2 rounded-2xl py-4 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
};

export const Main: React.FC = () => {
  const { formData, handleChange, sendOpenSwapTransaction, isLoading } =
    useContext(TransactionContext);

  const handleSubmit = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isLoading) {
      const { addressTo, amount, receivingChainID } = formData;
      e.preventDefault();
      console.log("addressTo", addressTo);
      //   if (!addressTo || !amount) return;
      sendOpenSwapTransaction();
    }
  };

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <div>Quantity</div>
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
            onChange={(e) => handleChange(e, "addressTo")}
          />
        </div>
        <div className={style.formHeader}>
          <div>Receiving Chain</div>
        </div>
        <Chains />
        <div onClick={(e) => handleSubmit(e)} className={style.swapButton}>
          Swap
        </div>
      </div>
    </div>
  );
};
