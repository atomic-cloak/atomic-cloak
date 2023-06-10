import React, { useContext } from "react";
import Chains from "@/components/Chains";
import Details from "@/components/Details";
import Quantity from "@/components/Quantity";
import { TransactionContext } from "@/providers/TransactionProvider";

const style = {
  currencySelector: `flex w-1/4`,
  content: `bg-[#191B1F] w-[30rem] rounded-2xl p-4`,
  wrapper: `flex justify-center items-center h-screen`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none w-full text-2xl`,
  transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-4 text-xl border border-[#20242A] hover:border-[#41444F] flex justify-between`,
  swapButton: `bg-[#3898FF] my-2 rounded-2xl py-4 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
};

export const Main: React.FC = () => {
  const { formData, handleChange, sendOpenSwapTransaction, isLoading } =
    useContext(TransactionContext);

  const handleSubmit = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isLoading) {
      const { addressTo } = formData;
      e.preventDefault();
      console.log("addressTo", addressTo);
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
            onChange={(e) => handleChange(e.target.value, "addressTo")}
          />
        </div>
        <div className={style.formHeader}>
          <div>Receiving Chain</div>
        </div>
        <Chains />
        <Details />
        <div onClick={(e) => handleSubmit(e)} className={style.swapButton}>
          Swap
        </div>
      </div>
    </div>
  );
};
