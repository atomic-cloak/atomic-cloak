/* eslint-disable import/no-anonymous-default-export */
import { API_ENDPOINTS } from '@/data/utils/endpoints';
import type {
  CoinPaginator,
  CoinPrice,
  CryptoQueryOptions,
  GetParams,
  Settings,
  SettingsQueryOptions,
} from '@/types';
import { HttpClient } from '@/data/utils/client';

class client {
  coins = {
    all: ({ id, name, symbol, ...query }: Partial<CryptoQueryOptions> = {}) =>
      HttpClient.get<CoinPaginator>(API_ENDPOINTS.MARKETS, {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: '10000',
        page: '1',
        sparkline: 'false',
        price_change_percentage: '1h,24h,7d',
        ...query,
      }),
    get: ({ id }: GetParams) =>
      HttpClient.get<CoinPrice>(`${API_ENDPOINTS.PRICING}/${id}`),
  };

  marketChart = {
    get: ({ id }: GetParams) =>
      HttpClient.get<CoinPrice>(
        `${API_ENDPOINTS.PRICING}/${id}/market_chart?vs_currency=usd&days=30`
      ),
  };

  settings = {
    all: (params?: SettingsQueryOptions) =>
      HttpClient.get<Settings>(API_ENDPOINTS.SETTINGS, { ...params }),
  };
}

export default new client();
