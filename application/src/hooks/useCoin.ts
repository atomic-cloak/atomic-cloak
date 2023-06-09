import client from '@/data/utils';
import { API_ENDPOINTS } from '@/data/utils/endpoints';
import { CoinPaginator, CoinPrice, CryptoQueryOptions } from '@/types';
import type { UseInfiniteQueryOptions } from 'react-query';
import { useRouter } from 'next/router';
import { useQuery, useInfiniteQuery } from 'react-query';

export function useCoins(
  options?: Partial<CryptoQueryOptions>,
  config?: UseInfiniteQueryOptions<CoinPaginator, Error>
) {
  const { locale } = useRouter();

  const formattedOptions = {
    ...options,
    language: locale,
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<CoinPaginator, Error>(
    [API_ENDPOINTS.PRICING, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.coins.all(Object.assign({}, queryKey[1], pageParam)),
    {
      ...config,
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    coins: data?.pages[0],
    paginatorInfo: Array.isArray(data?.pages)
      ? data?.pages[data.pages.length - 1]
      : null,
    isLoading,
    error,
    hasNextPage,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore,
  };
}

export function useCoin(id: string) {
  const { locale: language } = useRouter();

  // console.log({ slug, language });

  const { data, isLoading, error } = useQuery<CoinPrice, Error>(
    [API_ENDPOINTS.PRICING, { id, language }],
    () => client.coins.get({ id, language })
  );

  return {
    coin: data,
    isLoading,
    error,
  };
}

export function useMarketChart(id: string) {
  const { locale: language } = useRouter();

  const { data, isLoading, error } = useQuery<CoinPrice, Error>(
    [API_ENDPOINTS.PRICING, { id, language }],
    () => client.marketChart.get({ id, language })
  );

  return {
    chart: data,
    isLoading,
    error,
  };
}
