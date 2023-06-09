import React from 'react';
import { Star } from '@/components/icons/star';
import CryptocurrencyDrawerTable from '@/components/cryptocurrency-pricing-table/cryptocurrency-drawer-table';
import { CoinPriceData } from '@/data/static/coin-market-data';

const COLUMNS = [
  {
    Header: () => <div className="px-1"></div>,
    accessor: 'symbol',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div className="">
        <Star />
      </div>
    ),
    minWidth: 40,
    maxWidth: 20,
  },
  {
    Header: '#',
    accessor: 'market_cap_rank',
    // @ts-ignore
    Cell: ({ cell: { value } }) => <div>{value}</div>,
    minWidth: 40,
    maxWidth: 20,
  },
  {
    Header: () => <div className="">Coin Name</div>,
    accessor: 'name',
    // @ts-ignore
    Cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.image}
        <div className="ltr:text-left rtl:text-left">{row.original.name}</div>
      </div>
    ),
    minWidth: 100,
  },
  {
    Header: () => <div className="">Price</div>,
    accessor: 'current_price',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div className="ltr:text-left rtl:text-left">${value}</div>
    ),
    minWidth: 80,
    maxWidth: 120,
  },
  {
    Header: () => <div className="">1h%</div>,
    accessor: 'price_change_percentage_1h_in_currency',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div
        className={`${
          Math.sign(value) === 1 ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {Math.sign(value) === 1 ? '+' : ''}
        {value}%
      </div>
    ),
    maxWidth: 80,
  },
  {
    Header: () => <div className="">24h%</div>,
    accessor: 'price_change_percentage_24h_in_currency',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div
        className={`${
          Math.sign(value) === 1 ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {Math.sign(value) === 1 ? '+' : ''}
        {value}%
      </div>
    ),
    maxWidth: 80,
  },
  {
    Header: () => <div className="">Circulating Supply</div>,
    accessor: 'circulating_supply',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div className="ltr:text-left rtl:text-left">${value}</div>
    ),
    minWidth: 200,
    maxWidth: 300,
  },
  {
    Header: () => <div className="">Volume (24h)</div>,
    accessor: 'total_volume',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div className="ltr:text-left rtl:text-left">${value}</div>
    ),
    minWidth: 100,
    maxWidth: 300,
  },
];

export default function CryptocurrencyPricingRetroTable() {
  // const { coins } = useCoins();
  // const data = React.useMemo(() => coins, [coins]);
  const data = React.useMemo(() => CoinPriceData, []);
  const columns = React.useMemo(() => COLUMNS, []);

  return <CryptocurrencyDrawerTable columns={columns} data={data} />;
}
