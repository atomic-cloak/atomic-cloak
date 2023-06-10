import React, { useContext } from "react";
import { TransactionContext } from "@/providers/TransactionProvider";

const style = {
  transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-4 text-xl border border-[#20242A]`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none w-full text-2xl`,
};

const Details: React.FC = () => {
  const { swapDetails } = useContext(TransactionContext);

  return (
    <div className={style.transferPropContainer}>
      <dl className="space-y-6 text-sm font-medium text-gray-500">
        <div className="flex justify-between">
          <dt className="flex">
            Fee
            <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs tracking-wide text-gray-600">
              0.0001
            </span>
          </dt>
        </div>
        {swapDetails.swapID ? (
          <div className="flex justify-between">
            <dt className="flex">
              Swap ID
              <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs tracking-wide text-gray-600">
                {swapDetails.swapID}
              </span>
            </dt>
          </div>
        ) : null}
        {swapDetails.timestamp ? (
          <div className="flex justify-between">
            <dt className="flex">
              Timestamp
              <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs tracking-wide text-gray-600">
                {swapDetails.timestamp}
              </span>
            </dt>
          </div>
        ) : null}
        {swapDetails.chainID ? (
          <div className="flex justify-between">
            <dt className="flex">
              Chain
              <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs tracking-wide text-gray-600">
                {swapDetails.chainID}
              </span>
            </dt>
          </div>
        ) : null}
      </dl>
    </div>
  );
};

export default Details;
