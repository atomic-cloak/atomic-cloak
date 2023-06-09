import { coinIdData } from '@/data/static/coin-id';
import { CoinExplore } from '@/data/static/coin-list';
import React, { useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import { Github } from '@/components/icons/brands/github';
import { Instagram } from '@/components/icons/brands/instagram';
import { Twitter } from '@/components/icons/brands/twitter';
import { Check } from '@/components/icons/check';
import { Copy } from '@/components/icons/copy';
import { SearchIcon } from '@/components/icons/search';
import AnchorLink from '@/components/ui/links/anchor-link';
import Explorers from '@/components/cryptocurrency-pricing-table/explorers';

function CoinInfo() {
  const [copyButtonStatus, setCopyButtonStatus] = useState(false);
  const [_, copyToClipboard] = useCopyToClipboard();
  function handleCopyToClipboard() {
    copyToClipboard(coinIdData.api_id);
    setCopyButtonStatus(true);
    setTimeout(() => {
      setCopyButtonStatus(copyButtonStatus);
    }, 2500);
  }
  return (
    <div className="mt-5 px-8 pb-10">
      <div className="flex items-center gap-4">
        <div className="w-[100px] text-sm tracking-wider text-[#6B7280]">
          Website
        </div>
        <div className="rounded-lg bg-gray-100 px-3 pb-1 pt-[6px] text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-white">
          bitcoin.com
        </div>
      </div>
      <div className="mt-[10px] flex items-center gap-4">
        <div className="w-[100px] text-sm tracking-wider text-[#6B7280]">
          Explorers
        </div>
        <Explorers menu={CoinExplore} />
      </div>
      <div className="mt-[10px] flex items-start gap-4">
        <div className="w-[100px] shrink-0 grow-0 basis-auto text-sm tracking-wider text-[#6B7280]">
          Wallets
        </div>
        <div className="flex flex-wrap items-center gap-[5px]">
          <span className="rounded-lg bg-gray-100 px-3 pb-1 pt-[6px] text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-white">
            Ledger
          </span>
          <span className="rounded-lg bg-gray-100 px-3 pb-1 pt-[6px] text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-white">
            Trezor
          </span>
          <span className="rounded-lg bg-gray-100 px-3 pb-1 pt-[6px] text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-white">
            Xdefi
          </span>
          <span className="rounded-lg bg-gray-100 px-3 pb-1 pt-[6px] text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-white">
            Coin98
          </span>
        </div>
      </div>
      <div className="mt-[10px] flex items-start gap-4">
        <div className="w-[100px] shrink-0 grow-0 basis-auto text-sm tracking-wider text-[#6B7280]">
          Community
        </div>
        <div className="flex flex-wrap items-center gap-[5px]">
          <AnchorLink
            href="https://reddit.com/r/bitcoin"
            target="_blank"
            className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 pb-1 pt-[6px] text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-white"
          >
            <Instagram className="h-4 w-4" /> Instagram
          </AnchorLink>
          <AnchorLink
            href="https://twitter.com/bitcoin"
            target="_blank"
            className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 pb-1 pt-[6px] text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-white"
          >
            <Twitter className="h-4 w-4" /> Twitter
          </AnchorLink>
        </div>
      </div>
      <div className="mt-[10px] flex items-center gap-4">
        <div className="w-[100px] text-sm tracking-wider text-[#6B7280]">
          Search on
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 pb-1 pt-[6px] text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-white">
          <SearchIcon /> Twitter
        </div>
      </div>
      <div className="mt-[10px] flex items-center gap-4">
        <div className="w-[100px] text-sm tracking-wider text-[#6B7280]">
          Source Code
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 pb-1 pt-[6px] text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-white">
          <Github /> Github
        </div>
      </div>
      <div className="mt-[10px] flex items-center gap-4">
        <div className="w-[100px] text-sm tracking-wider text-[#6B7280]">
          Api Id
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 pb-1 pt-[6px] text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-white">
          bitcoin
          <div title="Copy Address" onClick={() => handleCopyToClipboard()}>
            {copyButtonStatus ? (
              <Check className="h-auto w-3.5 text-green-500" />
            ) : (
              <Copy className="h-auto w-3.5" />
            )}
          </div>
        </div>
      </div>
      <div className="mt-[10px] flex items-center gap-4">
        <div className="w-[100px] text-sm tracking-wider text-[#6B7280]">
          Tags
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 pb-1 pt-[6px] text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-white">
          Cryptocurrency
        </div>
      </div>
    </div>
  );
}

export default CoinInfo;
