import React from 'react';
import Skeleton from '@/components/ui/skeleton/skeleton';

function LivePricingFeedSkeleton() {
  return (
    <div className="flex w-full gap-5">
      <div className="flex w-full items-center gap-4 rounded-lg bg-white p-5 shadow-[0_8px_16px_rgba(17,24,39,0.05)] dark:bg-light-dark lg:flex-row">
        <div className="flex w-full items-center gap-4">
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full items-center gap-3">
              <Skeleton
                className="!h-6 !w-6 flex-shrink !rounded-full"
                animation
              />
              <Skeleton className="!h-3 !w-full flex-1" animation />
            </div>
            <div className="flex w-full items-center gap-2">
              <Skeleton className="!h-4 !w-3/4" animation />
              <Skeleton className="!h-4 !w-1/4" animation />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="!h-[10px]" animation />
              <Skeleton className="!h-[10px] !w-16" animation />
            </div>
          </div>
        </div>
      </div>
      <div className="hidden w-full items-center gap-4 rounded-lg bg-white p-5 shadow-[0_8px_16px_rgba(17,24,39,0.05)] dark:bg-light-dark md:flex lg:flex-row">
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full items-center gap-3">
            <Skeleton
              className="!h-6 !w-6 flex-shrink !rounded-full"
              animation
            />
            <Skeleton className="!h-3 !w-full flex-1" animation />
          </div>
          <div className="flex w-full items-center gap-2">
            <Skeleton className="!h-4 !w-3/4" animation />
            <Skeleton className="!h-4 !w-1/4" animation />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="!h-[10px]" animation />
            <Skeleton className="!h-[10px] !w-16" animation />
          </div>
        </div>
      </div>
      <div className="hidden w-full items-center gap-4 rounded-lg bg-white p-5 shadow-[0_8px_16px_rgba(17,24,39,0.05)] dark:bg-light-dark lg:flex lg:flex-row">
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full items-center gap-3">
            <Skeleton
              className="!h-6 !w-6 flex-shrink !rounded-full"
              animation
            />
            <Skeleton className="!h-3 !w-full flex-1" animation />
          </div>
          <div className="flex w-full items-center gap-2">
            <Skeleton className="!h-4 !w-3/4" animation />
            <Skeleton className="!h-4 !w-1/4" animation />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="!h-[10px]" animation />
            <Skeleton className="!h-[10px] !w-16" animation />
          </div>
        </div>
      </div>
      <div className="hidden w-full items-center gap-4 rounded-lg bg-white p-5 shadow-[0_8px_16px_rgba(17,24,39,0.05)] dark:bg-light-dark lg:flex-row 2xl:flex">
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full items-center gap-3">
            <Skeleton
              className="!h-6 !w-6 flex-shrink !rounded-full"
              animation
            />
            <Skeleton className="!h-3 !w-full flex-1" animation />
          </div>
          <div className="flex w-full items-center gap-2">
            <Skeleton className="!h-4 !w-3/4" animation />
            <Skeleton className="!h-4 !w-1/4" animation />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="!h-[10px]" animation />
            <Skeleton className="!h-[10px] !w-16" animation />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LivePricingFeedSkeleton;
