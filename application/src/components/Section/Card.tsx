import React, { useContext, useEffect, useState } from "react";
import Chains from "@/components/Section/Chains";
import Details from "@/components/Section/Details";
import Quantity from "@/components/Section/Quantity";
import { TransactionContext } from "@/providers/TransactionProvider";

const style = {
  content: `bg-[#191B1F] w-[30rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none w-full text-2xl`,
  transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-4 text-xl border border-[#20242A] hover:border-[#41444F] flex justify-between`,
  swapButton: `bg-[#3898FF] my-2 rounded-2xl py-4 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
};

const Card: React.FC = ({ stage }: { stage?: string }) => {
  const [isAccept, setIsAccept] = useState<boolean>(false);

  useEffect(() => {
    switch (stage) {
      case "swap":
        setIsAccept(false);
        break;
      case "accept":
        setIsAccept(true);
        break;
      default:
        setIsAccept(false);
        break;
    }
  }, []);

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
    <div className="flex flex-col rounded-2xl px-6 sm:px-8">
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
          <div>{isAccept ? "Accept" : "Swap"}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
