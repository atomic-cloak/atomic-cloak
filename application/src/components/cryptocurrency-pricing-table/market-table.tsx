import { CoinPair } from '@/data/static/coin-list';
import { CoinMarketData } from '@/data/static/coin-market-data';
import React from 'react';
import { SortList } from '@/components/farms/farms';
import CoinMarketTable from '@/components/cryptocurrency-pricing-table/coin-market-table';

const COLUMNS = [
  {
    Header: '#',
    accessor: 'id',
    minWidth: 50,
    maxWidth: 50,
  },
  {
    Header: 'Name',
    accessor: 'coin',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div className="mb-5 grid grid-cols-3 gap-4 text-sm text-gray-900 last:mb-0 dark:text-white">
        <div className="col-span-2 flex items-center gap-2">
          <span className="w-6 shrink-0">{value.icon}</span>
          <span className="flex flex-col gap-0.5">
            <span className="whitespace-nowrap text-sm font-medium capitalize">
              {value.name}
            </span>
          </span>
        </div>
      </div>
    ),
    minWidth: 180,
    maxWidth: 260,
  },
  {
    Header: () => <div>Price</div>,
    accessor: 'prices',
    // @ts-ignore
    Cell: ({ cell: { value } }) => <div>${value}</div>,
    minWidth: 100,
    maxWidth: 140,
  },
  {
    Header: () => <div>+2% Depth</div>,
    accessor: 'plus_depth',
    // @ts-ignore
    Cell: ({ cell: { value } }) => <div>${value}</div>,
    minWidth: 140,
    maxWidth: 200,
  },
  {
    Header: () => <div>-2% Depth</div>,
    accessor: 'minus_depth',
    // @ts-ignore
    Cell: ({ cell: { value } }) => <div>${value}</div>,
    minWidth: 140,
    maxWidth: 200,
  },
  {
    Header: () => <div>Volume</div>,
    accessor: 'volume',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div className="flex items-center">${value}</div>
    ),
    minWidth: 140,
    maxWidth: 200,
  },
  {
    Header: () => <div>volume %</div>,
    accessor: 'volume_per',
    // @ts-ignore
    Cell: ({ cell: { value } }) => <div>{value}</div>,
    minWidth: 100,
    maxWidth: 120,
  },
  {
    Header: () => <div>Confidence</div>,
    accessor: 'confidence',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div className="">
        <button className="block rounded-full bg-green-500 px-4 pb-0.5 pt-1 text-center uppercase text-white">
          {value}
        </button>
      </div>
    ),
    minWidth: 100,
    maxWidth: 120,
  },
  {
    Header: () => <div>Liquidity</div>,
    accessor: 'liquidity',
    // @ts-ignore
    Cell: ({ cell: { value } }) => <div>{value}</div>,
    minWidth: 100,
    maxWidth: 120,
  },
  {
    Header: () => <div>Updated</div>,
    accessor: 'updated',
    // @ts-ignore
    Cell: ({ cell: { value } }) => <div>{value}</div>,
    minWidth: 100,
    maxWidth: 120,
  },
];

function MarketTable() {
  const data = React.useMemo(() => CoinMarketData, []);
  const columns = React.useMemo(() => COLUMNS, []);
  return (
    <>
      <div className="mt-6 rounded-lg bg-white p-4 shadow-card dark:bg-light-dark md:p-8">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h2 className="text-xl font-medium uppercase text-black dark:text-white">
            Bitcoin Market
          </h2>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm sm:block">Pair</span>
            <SortList
              sortData={CoinPair}
              className="!h-8 !w-[70px] text-brand"
            />
          </div>
        </div>
        <CoinMarketTable columns={columns} data={data} />
      </div>
    </>
  );
}

export default MarketTable;
