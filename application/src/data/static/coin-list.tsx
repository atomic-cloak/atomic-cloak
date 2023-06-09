import { Bitcoin } from '@/components/icons/bitcoin';
import { Ethereum } from '@/components/icons/ethereum';
import { Tether } from '@/components/icons/tether';
import { Bnb } from '@/components/icons/bnb';
import { Usdc } from '@/components/icons/usdc';
import { Cardano } from '@/components/icons/cardano';
import { Doge } from '@/components/icons/doge';

export const coinList = [
  {
    icon: <Bitcoin />,
    code: 'BTC',
    name: 'Bitcoin',
    price: 28204.0,
  },
  {
    icon: <Ethereum />,
    code: 'ETH',
    name: 'Ethereum',
    price: 1787.3,
  },
  {
    icon: <Tether />,
    code: 'USDT',
    name: 'Tether USD',
    price: 1.01,
  },
  {
    icon: <Bnb />,
    code: 'BNB',
    name: 'Binance Coin',
    price: 338.36,
  },
  {
    icon: <Usdc />,
    code: 'USDC',
    name: 'USD Coin',
    price: 1.001,
  },
  {
    icon: <Cardano />,
    code: 'ADA',
    name: 'Cardano',
    price: 0.34,
  },
  {
    icon: <Doge />,
    code: 'DOGE',
    name: 'Doge Coin',
    price: 0.07,
  },
];

export const CoinExplore = [
  {
    title: 'blockchain.info',
    url: 'https://blockchain.info/',
  },
  {
    title: 'etherscan.com',
    url: 'https://etherscan.com',
  },
  {
    title: 'live.blockcypher.com',
    url: 'https://live.blockcypher.com/btc/',
  },
];

export const CoinPair = [
  { id: 1, name: 'All' },
  { id: 2, name: 'USDT' },
  { id: 3, name: 'USD' },
  { id: 4, name: 'BTC' },
  { id: 5, name: 'EUR' },
];

export const CoinDate = [
  { id: 1, name: 'Jan 2022' },
  { id: 2, name: 'Fab 2022' },
  { id: 3, name: 'Mar 2022' },
  { id: 4, name: 'Apr 2022' },
  { id: 5, name: 'May 2022' },
];
