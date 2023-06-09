import CryptocurrencySinglePrice from '@/components/cryptocurrency-pricing-table/cryptocurrency-single-price';
import RootLayout from '@/layouts/_root-layout';
import { NextPageWithLayout } from '@/types';
import React, { useState } from 'react';
import CoinInfo from '@/components/cryptocurrency-pricing-table/coin-info';
import { CoinConverter } from '@/components/ui/transact-coin';
import CoinTabs from '@/components/cryptocurrency-pricing-table/coin-tabs';
import TopCoin from '@/components/cryptocurrency-pricing-table/top-coin';
import { useLayout } from '@/lib/hooks/use-layout';
import { LAYOUT_OPTIONS } from '@/lib/constants';
import InfoDrawer from '@/components/cryptocurrency-pricing-table/info-drawer';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';

function CoinSinglePrice() {
  const [isOpen, setIsOpen] = useState(false);
  const { layout } = useLayout();
  const isMounted = useIsMounted();
  const breakpoint = useBreakpoint();

  return (
    <>
      <div className="flex flex-wrap gap-6 lg:flex-nowrap">
        <div
          className={`w-full 2xl:w-full 
        ${layout === LAYOUT_OPTIONS.RETRO ? '' : 'lg:w-2/3'}`}
        >
          <CryptocurrencySinglePrice isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        {layout === LAYOUT_OPTIONS.RETRO ? (
          <InfoDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
        ) : (
          <div className="w-full rounded-lg bg-white py-8 shadow-card dark:bg-light-dark xl:max-w-[358px]">
            <h2 className="px-8 text-base font-medium uppercase text-gray-700 dark:text-gray-200">
              Info
            </h2>
            <CoinInfo />
            <div>
              <span className="block border-t border-dashed border-t-gray-200 dark:border-t-gray-700" />

              <CoinConverter />
            </div>
            <div className="px-8 pb-10">
              <h2 className="text-base font-medium uppercase text-gray-700 dark:text-gray-200">
                Top Coins
              </h2>
              <TopCoin />
            </div>
          </div>
        )}
      </div>

      <div className="mt-10">
        <CoinTabs />
      </div>
    </>
  );
}

const SinglePrice: NextPageWithLayout = () => {
  return <CoinSinglePrice />;
};

SinglePrice.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default SinglePrice;
