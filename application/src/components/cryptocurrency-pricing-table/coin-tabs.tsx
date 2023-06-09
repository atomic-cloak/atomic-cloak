import cn from 'classnames';
import { LayoutGroup, motion } from 'framer-motion';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { Tab } from '@headlessui/react';
import React, { useRef, useState } from 'react';
import { ChevronDown } from '@/components/icons/chevron-down';
import MarketTable from '@/components/cryptocurrency-pricing-table/market-table';
import CalendarTimeline from '@/components/cryptocurrency-pricing-table/calendar-timeline';
import HistoricalDataTable from '@/components/cryptocurrency-pricing-table/historical-data-table';
import SocialStats from '@/components/cryptocurrency-pricing-table/social-stats';
import Wallets from '@/components/cryptocurrency-pricing-table/wallets';
import { useLayout } from '@/lib/hooks/use-layout';
import { LAYOUT_OPTIONS } from '@/lib/constants';

const tabMenu = [
  {
    title: 'Market',
    path: 'Market',
  },
  {
    title: 'Historical Data',
    path: 'Historical Data',
  },
  {
    title: 'Project Info',
    path: 'Project Info',
  },
  {
    title: 'Wallets',
    path: 'Wallets',
  },
];

function TabItem({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <Tab
      className={({ selected }) =>
        cn(
          'relative z-0 uppercase tracking-wider hover:text-gray-900 focus:outline-none dark:text-white dark:hover:text-white',
          {
            'font-medium text-white hover:text-brand focus:text-brand md:text-brand':
              selected,
          },
          className
        )
      }
    >
      {({ selected }) => (
        <>
          <span className="flex w-full justify-between px-3 md:px-0">
            {children}
          </span>
          {selected && (
            <motion.span
              className={cn(
                'absolute bottom-0 left-0 right-0 -z-[1] h-full w-full rounded-lg border-b-2 border-transparent bg-brand shadow-button md:-bottom-[2px] md:rounded-none md:border-brand md:bg-transparent md:shadow-none md:dark:border-white'
              )}
              layoutId="activeTabIndicator"
            />
          )}
        </>
      )}
    </Tab>
  );
}

//
// Tab Panels framer motion variant
//
export function TabPanels({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <Tab.Panels className={className}>
      <LayoutGroup>
        <>{children}</>
      </LayoutGroup>
    </Tab.Panels>
  );
}

//
// Tab Panel framer motion variant
//
export function TabPanel({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <Tab.Panel className={className}>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 32 }}
        exit={{ opacity: 0, y: -32 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </Tab.Panel>
  );
}

function CoinTabs() {
  const isMounted = useIsMounted();
  const breakpoint = useBreakpoint();
  const dropdownEl = useRef<HTMLDivElement>(null);
  let [selectedTabIndex, setSelectedTabIndex] = useState(0);
  let [visibleMobileMenu, setVisibleMobileMenu] = useState(false);
  const { layout } = useLayout();

  return (
    <>
      <Tab.Group
        selectedIndex={selectedTabIndex}
        onChange={(index) => setSelectedTabIndex(index)}
      >
        <Tab.List className="relative mb-6 text-sm uppercase sm:gap-8 sm:rounded-none">
          {isMounted && ['xs', 'sm'].indexOf(breakpoint) !== -1 ? (
            <div
              ref={dropdownEl}
              className="rounded-lg border-2 border-gray-200 dark:border-gray-700"
            >
              <button
                onClick={() => setVisibleMobileMenu(!visibleMobileMenu)}
                className="flex w-full items-center justify-between px-4 py-2.5 uppercase text-gray-400 dark:text-gray-300 sm:px-5 sm:py-3.5"
              >
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {tabMenu[selectedTabIndex].title}
                </span>
                <ChevronDown className="h-auto w-3.5" />
              </button>
              <div
                className={cn(
                  'absolute left-0 top-full z-10 mt-1 grid w-full gap-0.5 rounded-lg bg-white p-2 text-left dark:bg-light-dark xs:gap-1',
                  visibleMobileMenu
                    ? 'visible border-2 border-gray-200 opacity-100 dark:border-gray-700'
                    : 'invisible opacity-0'
                )}
              >
                {tabMenu.map((item) => (
                  <div
                    key={item.path}
                    onClick={() => setVisibleMobileMenu(false)}
                  >
                    <TabItem className="w-full p-2.5">{item.title}</TabItem>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-2 border-b-2 border-gray-200 dark:border-gray-700 2xl:gap-0.5 3xl:gap-2">
              {tabMenu.map((item) => (
                <TabItem key={item.path} className="px-3 py-3 first:px-0">
                  {item.title}
                </TabItem>
              ))}
            </div>
          )}
        </Tab.List>
        <TabPanels>
          <TabPanel className="relative w-full focus:outline-none md:w-auto">
            <MarketTable />
          </TabPanel>
          <TabPanel className="relative w-full focus:outline-none md:w-auto">
            <div
              className={`flex flex-col gap-6 ${
                layout === LAYOUT_OPTIONS.RETRO ? '2xl:flex-row' : 'lg:flex-row'
              }`}
            >
              <div
                className={`${
                  layout === LAYOUT_OPTIONS.RETRO
                    ? '2xl:w-3/5 3xl:w-[70%]'
                    : 'lg:w-3/5 xl:w-[70%] 3xl:w-full'
                }`}
              >
                <HistoricalDataTable />
              </div>
              <CalendarTimeline />
            </div>
          </TabPanel>
          <TabPanel className="relative w-full focus:outline-none md:w-auto">
            <SocialStats />
          </TabPanel>
          <TabPanel className="relative w-full focus:outline-none md:w-auto">
            <Wallets />
          </TabPanel>
        </TabPanels>
      </Tab.Group>
    </>
  );
}
export default CoinTabs;
