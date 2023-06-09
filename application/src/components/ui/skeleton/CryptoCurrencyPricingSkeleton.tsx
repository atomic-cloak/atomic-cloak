import React from 'react';
import LivePricingFeedSkeleton from '@/components/ui/skeleton/live-pricing-feed-skeleton';
import PricingTableSkeleton from '@/components/ui/skeleton/pricing-table-skeleton';

function CryptoCurrencyPricingSkeleton() {
  return (
    <>
      <LivePricingFeedSkeleton />
      <PricingTableSkeleton />
    </>
  );
}

export default CryptoCurrencyPricingSkeleton;
