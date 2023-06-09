import cn from 'classnames';
import { walletCurrencies } from '@/data/static/wallet-currencies';
import React, { useState } from 'react';
import { ArrowUp } from '@/components/icons/arrow-up';

function TopCoin() {
  const [isChangePositive, setChangeStatus] = useState(true);
  return (
    <div className="mt-7">
      <div className="mb-5 flex items-center justify-between text-sm font-medium text-gray-400">
        <span>Coin Name</span>
        <span>Volume</span>
      </div>
      <ul className="grid gap-5">
        {walletCurrencies.map((currency) => (
          <li
            key={currency.code}
            className="grid grid-cols-[150px_repeat(2,1fr)] items-center justify-between text-sm font-medium text-gray-900 dark:text-white 2xl:grid-cols-[140px_repeat(2,1fr)] 3xl:grid-cols-[150px_repeat(2,1fr)]"
          >
            <span className="flex items-center gap-2.5 whitespace-nowrap">
              {currency.icon}
              {currency.name}
            </span>
            <span className="text-center"></span>
            <span
              className={cn(
                'flex items-center justify-end',
                currency.isChangePositive ? 'text-green-500' : 'text-red-500'
              )}
            >
              <span
                className={cn('ltr:mr-2 rtl:ml-2', {
                  'rotate-180': !currency.isChangePositive,
                })}
              >
                <ArrowUp />
              </span>
              {currency.volume}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopCoin;
