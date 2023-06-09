import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  authorization?: boolean;
  getLayout?: (page: ReactElement) => ReactNode;
};

export type CoinTypes = {
  icon: JSX.Element;
  code: string;
  name: string;
  price: number;
};

export interface Attachment {
  id: string;
  original: string;
  thumbnail: string;
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  language?: string;
}

export interface GetParams {
  id: string;
  language?: string;
}

export interface SearchParamOptions {
  rating: string;
  question: string;

  [key: string]: unknown;
}

export interface CryptoQueryOptions extends QueryOptions {
  id: string;
  name: string;
  symbol: string;
}

export interface SettingsQueryOptions extends QueryOptions {
  language?: string;
}

export interface Prices {
  name: number;
  value: number;
}

export interface CoinPrice {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: string;
  market_cap_rank: string;
  fully_diluted_valuation: string;
  total_volume: string;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: string;
  max_supply: string;
  prices?: Prices[];
}

export interface PaginatorInfo<T> {
  current_page: number;
  data: T[];
  // map: any;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface CoinPaginator extends PaginatorInfo<CoinPrice> {}

export interface SEO {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: Attachment;
  twitterHandle: string;
  twitterCardType: string;
  metaTags: string;
  canonicalUrl: string;
}

export interface Settings {
  id: string;
  options: {
    siteTitle: string;
    siteSubtitle: string;
    currency: string;
    logo: Attachment;
    seo: SEO;
    contactDetails: ContactDetails;
    useOtp: Boolean;
    [key: string]: string | any;
  };
}

export interface ContactDetails {
  contact: string;
  location: Location;
  website: string;
}
