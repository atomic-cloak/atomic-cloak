import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { client } from "@/lib/sanityClient";
import { FiArrowUpRight } from "react-icons/fi";
import { TransactionContext } from "@/providers/TransactionProvider";

const style = {
  wrapper: `h-full text-white select-none h-full  w-screen flex-1 pt-10 flex items-end justify-end pb-12 px-8`,
  txHistoryItem: `bg-[#191a1e] rounded-lg px-4 py-1 my-2 flex items-center justify-end`,
  txDetails: `flex items-center`,
  toAddress: `text-[#f48706] mx-2`,
  txTimestamp: `mx-2`,
  etherscanLink: `flex items-center text-[#2172e5]`,
};

export const TransactionHistory: React.FC = () => {
  interface Transaction {
    txHash: string;
    fromAddress: string;
    toAddress: string;
    amount: number;
    timestamp: Date;
  }

  const { isLoading, currentAccount } = useContext(TransactionContext);
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(
    []
  );
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    (async () => {
      if (!isLoading && currentAccount) {
        const query = `
          *[_type=="users" && _id == "${currentAccount}"] {
            "transactionList": transactions[]->{amount, toAddress, timestamp, txHash}|order(timestamp desc)[0..4]
          }
        `;

        const clientRes = await client.fetch(query);

        setTransactionHistory(clientRes[0]?.transactionList?.slice(0, 4));
      }
    })();
  }, [isLoading, currentAccount]);

  return (
    <div className={style.wrapper}>
      <div>
        {transactionHistory &&
          transactionHistory?.map((transaction: Transaction, index: number) => {
            return (
              <div className={style.txHistoryItem} key={index}>
                <div className={style.txDetails}>
                  <Image
                    src="/images/eth.png"
                    height={20}
                    width={15}
                    alt="eth"
                  />
                  {/* @ts-ignore */}
                  {transaction.amount} Ξ sent to{" "}
                  <span className={style.toAddress}>
                    {transaction.toAddress.substring(0, 6)}...
                  </span>
                </div>{" "}
                on{" "}
                <div className={style.txTimestamp}>
                  {new Date(transaction.timestamp).toLocaleString("en-US", {
                    timeZone: timezone,
                    hour12: true,
                    timeStyle: "short",
                    dateStyle: "long",
                  })}
                </div>
                <div className={style.etherscanLink}>
                  <a
                    href={`https://rinkeby.etherscan.io/tx/${transaction.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className={style.etherscanLink}
                  >
                    View on Etherscan
                    <FiArrowUpRight />
                  </a>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
