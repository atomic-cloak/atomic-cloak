import { useContext } from "react";
import Card from "@/components/Section";
import Loader from "@/components/Loader";
import Chains from "@/components/Section/Chains";
import Quantity from "@/components/Section/Quantity";
import { TransactionContext } from "@/providers/TransactionProvider";

const style = {
  content: `bg-[#191B1F] w-[30rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none w-full`,
  transferPropInput2: `bg-transparent text-white outline-none w-full`,
  transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-4 border border-[#20242A] hover:border-[#41444F] flex justify-between`,
  swapButton: `bg-[#3898FF] my-2 rounded-2xl py-4 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
};

export const Main = () => {
  const {
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
          <Card>
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
              Swap
            </button>
          </Card>
          <Card>
            <div>test</div>
          </Card>
        </>
      )}
      {status === "open" && (
        <>
          <Card>
            <div className={style.formHeader}>
              <div>Value</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {swapDetails.value}
              </div>
            </div>

            <div className={style.formHeader}>
              <div>Chain</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {swapDetails.chainID}
              </div>
            </div>

            <div className={style.formHeader}>
              <div>Timestamp</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {swapDetails.timestamp}
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
          </Card>
          <Card>
            <div>test</div>
          </Card>
        </>
      )}
      {status === "closeable" && (
        <>
          <Card>
            <div className={style.formHeader}>
              <div>Value</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {swapDetails.value}
              </div>
            </div>

            <div className={style.formHeader}>
              <div>Chain</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {swapDetails.chainID}
              </div>
            </div>

            <div className={style.formHeader}>
              <div>Timestamp</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {swapDetails.timestamp}
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
          </Card>
          <Card>
            <div className={style.formHeader}>
              <div>Value</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {mirrorSwapDetails.value}
              </div>
            </div>

            <div className={style.formHeader}>
              <div>Chain</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {mirrorSwapDetails.receivingChainID}
              </div>
            </div>

            <div className={style.formHeader}>
              <div>Timestamp</div>
            </div>
            <div className={style.transferPropContainer}>
              <div className={style.transferPropInput2}>
                {mirrorSwapDetails.timelock}
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
            <div onClick={(e) => handleSubmit(e)} className={style.swapButton}>
              Accept
            </div>
          </Card>
        </>
      )}
      {isLoading ? <Loader /> : null}
    </div>
  );
};
