import React from 'react';
import walletImage from '@/assets/images/wallets/wallet-1.svg';
import walletImage2 from '@/assets/images/wallets/wallet-2.svg';
import walletImage3 from '@/assets/images/wallets/wallet-3.svg';
import walletImage4 from '@/assets/images/wallets/wallet-4.svg';
import walletImage5 from '@/assets/images/wallets/wallet-5.svg';
import walletImage6 from '@/assets/images/wallets/wallet-6.svg';
import Image from 'next/image';
import AnchorLink from '@/components/ui/links/anchor-link';

export const walletsData = [
  {
    img: walletImage,
    name: 'Ledger',
    url: 'https://www.ledger.com/',
  },
  {
    img: walletImage2,
    name: 'Trezor',
    url: 'https://www.trezor.io',
  },
  {
    img: walletImage3,
    name: 'Math Wallet',
    url: 'http://www.mathwallet.org/cn/',
  },
  {
    img: walletImage4,
    name: 'Trust Wallet',
    url: 'https://www.trustwallet.com/',
  },
  {
    img: walletImage5,
    name: 'HyperPay',
    url: 'http://www.hyperpay.tech/',
  },
  {
    img: walletImage6,
    name: 'Atomic wallet',
    url: 'https://atomicwallet.io',
  },
];

function Wallets() {
  return (
    <div className="mt-6 rounded-lg bg-white px-4 py-8 shadow-card dark:bg-light-dark md:p-8">
      <h2 className="text-xl font-medium uppercase text-black dark:text-white">
        Wallets
      </h2>
      <div className="mt-8 grid grid-cols-1 items-center gap-6 md:grid-cols-2 lg:grid-cols-[repeat(auto-fit,_minmax(350px,_1fr))]">
        {walletsData.map((wallet, index) => (
          <div
            key={index}
            className="break-words rounded-lg border border-slate-200 bg-white px-8 py-10 text-center transition-all hover:shadow-card dark:border-slate-500 dark:bg-light-dark"
          >
            <Image
              className="mx-auto mb-5"
              src={wallet.img}
              alt={wallet.name}
              width={100}
              height={100}
            />
            <div className="text-xl font-medium text-black dark:text-white">
              {wallet.name}
            </div>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {wallet.url}
            </div>
            <AnchorLink
              href={wallet.url}
              target="_blank"
              className="mt-6 inline-block rounded-lg bg-gray-100 px-5 py-[10px] text-sm font-medium text-gray-900 transition-all hover:-translate-y-[2px] hover:shadow-card dark:bg-gray-900 dark:text-white"
            >
              Visit Website
            </AnchorLink>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wallets;
