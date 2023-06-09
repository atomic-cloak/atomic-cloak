import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { Close } from '@/components/icons/close';
import Button from '@/components/ui/button/button';
import SingleComparisonChart from '@/components/ui/chats/single-comparision-chart';
import Scrollbar from '@/components/ui/scrollbar';

interface CryptocurrencyDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function CryptocurrencyRetroDrawer({
  isOpen,
  setIsOpen,
}: CryptocurrencyDrawerProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-40 overflow-hidden"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-700 bg-opacity-60 backdrop-blur" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-out duration-300"
          enterFrom="ltr:translate-x-full rtl:-translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in duration-300"
          leaveFrom="translate-x-0"
          leaveTo="ltr:translate-x-full rtl:-translate-x-full"
        >
          <div className="fixed inset-y-0 w-full max-w-full bg-white/95 shadow-[0_0_80px_rgba(17,24,39,0.2)] backdrop-blur ltr:right-0 rtl:left-0 dark:bg-dark/90 sm:w-[550px] md:w-[650px] lg:w-[800px]">
            <div className="h-full w-full">
              <div className="flex h-16 items-center justify-between gap-6 border-b border-dashed border-gray-200 px-4 dark:border-gray-700 sm:px-6">
                <h3 className="text-base font-medium uppercase text-gray-900 dark:text-white">
                  Coin Details
                </h3>
                <Button
                  title="Close"
                  color="white"
                  shape="circle"
                  variant="transparent"
                  size="small"
                  onClick={() => setIsOpen(false)}
                >
                  <Close className="h-auto w-2.5" />
                </Button>
              </div>

              <Scrollbar style={{ height: 'calc(100% - 64px)' }}>
                <SingleComparisonChart />
              </Scrollbar>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export default CryptocurrencyRetroDrawer;
