import { CoinDate } from '@/data/static/coin-list';
import { CoinHistoryData } from '@/data/static/coin-market-data';
import React from 'react';
import { SortList } from '@/components/farms/farms';
import CoinMarketTable from '@/components/cryptocurrency-pricing-table/coin-market-table';

const COLUMNS = [
  {
    Header: 'Date',
    accessor: 'date',
    minWidth: 110,
    maxWidth: 130,
  },
  {
    Header: 'Open*',
    accessor: 'open',
    // @ts-ignore
    Cell: ({ cell: { value } }) => <div>${value}</div>,
    minWidth: 80,
    maxWidth: 120,
  },
  {
    Header: () => <div>High</div>,
    accessor: 'high',
    // @ts-ignore
    Cell: ({ cell: { value } }) => <div>${value}</div>,
    minWidth: 100,
    maxWidth: 140,
  },
  {
    Header: () => <div>Low</div>,
    accessor: 'low',
    // @ts-ignore
    Cell: ({ cell: { value } }) => <div>${value}</div>,
    minWidth: 100,
    maxWidth: 140,
  },
  {
    Header: () => <div>Close**</div>,
    accessor: 'close',
    // @ts-ignore
    Cell: ({ cell: { value } }) => <div>${value}</div>,
    minWidth: 100,
    maxWidth: 140,
  },
  {
    Header: () => <div>Volume</div>,
    accessor: 'volume',
    // @ts-ignore
    Cell: ({ cell: { value } }) => <div>${value}</div>,
    minWidth: 140,
    maxWidth: 200,
  },
  {
    Header: () => <div>Market Cap</div>,
    accessor: 'market_cap',
    // @ts-ignore
    Cell: ({ cell: { value } }) => <div>${value}</div>,
    minWidth: 140,
    maxWidth: 120,
  },
];

function HistoricalDataTable() {
  const data = React.useMemo(() => CoinHistoryData, []);
  const columns = React.useMemo(() => COLUMNS, []);
  return (
    <>
      <div className="rounded-lg bg-white p-4 shadow-card dark:bg-light-dark md:p-8">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h2 className="text-xl font-medium uppercase text-black dark:text-white">
            Bitcoin Market
          </h2>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm sm:block">Date</span>
            <SortList sortData={CoinDate} className="!h-8 !w-28" />
          </div>
        </div>
        <CoinMarketTable columns={columns} data={data} />
      </div>
    </>
  );
}

export default HistoricalDataTable;
