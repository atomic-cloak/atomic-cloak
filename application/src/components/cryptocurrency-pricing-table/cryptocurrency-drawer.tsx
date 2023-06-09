import React from 'react';
import SingleComparisonChart from '@/components/ui/chats/single-comparision-chart';
import Scrollbar from '@/components/ui/scrollbar';

interface CryptocurrencyDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function CryptocurrencyDrawer({
  isOpen,
  setIsOpen,
}: CryptocurrencyDrawerProps) {
  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute inset-0 z-10 transform rounded-lg bg-gray-700 backdrop-blur transition duration-300 ease-in-out ${
          !isOpen ? 'invisible bg-opacity-0' : 'visible bg-opacity-60'
        }`}
      ></div>
      <div
        className={`absolute inset-y-0 z-50 w-full max-w-full transform bg-white/95 transition duration-300 ease-in-out ltr:right-0 rtl:left-0 dark:bg-dark/90 sm:w-[550px] md:w-[650px] lg:w-[800px] ${
          !isOpen
            ? 'ltr:translate-x-full rtl:-translate-x-full'
            : 'translate-x-0'
        }`}
      >
        <div className="h-full w-full">
          <Scrollbar style={{ height: '100%' }}>
            <SingleComparisonChart />
          </Scrollbar>
        </div>
      </div>
    </>
  );
}

export default CryptocurrencyDrawer;
