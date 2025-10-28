import React, { useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { colors } from 'config/colors.config';
import FilterButton from 'components/filter/FilterButton';
import WithModal from 'components/modal/WithModal';
import MiniArtworkCardLoader from 'components/general/MiniArtworkCardLoader';
import ArtworksListing from 'components/general/ArtworksListing';
import tailwind from 'twrnc';
import { filterStore } from 'store/artworks/FilterStore';
import { fetchPaginatedArtworks } from 'services/artworks/fetchPaginatedArtworks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Sentry from '@sentry/react-native';

type FetchResult = {
  isOk: boolean;
  data: any[];
  count: number; // total pages
  message?: string;
};

async function fetchPage({
  pageParam,
  filters,
}: {
  pageParam: number;
  filters: any;
}): Promise<FetchResult> {
  const res = await fetchPaginatedArtworks(pageParam, filters);

  if (!res?.isOk) {
    Sentry.setContext('fetchPaginatedArtworks', { pageParam, filters, response: res });
    Sentry.captureMessage(`fetchPaginatedArtworks returned non-ok on page ${pageParam}`, 'error');
    throw new Error(res?.message || 'Failed to fetch artworks');
  }

  return res;
}

export default function Catalog() {
  const { width } = Dimensions.get('screen');
  const { filterOptions } = filterStore();
  const insets = useSafeAreaInsets();

  // Stable key part for filters (changes only when content actually changes)
  const filterKey = useMemo(() => filterOptions, [JSON.stringify(filterOptions)]);

  const { data, isLoading, isFetchingNextPage, refetch, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['catalog', filterKey],
      queryFn: ({ pageParam = 1 }) => fetchPage({ pageParam, filters: filterOptions }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.isOk) return undefined;
        const totalPages = lastPage.count ?? 1;
        const next = allPages.length + 1;
        return next <= totalPages ? next : undefined;
      },

      placeholderData: (prev) => prev,
      staleTime: 30_000, // serve cached for 30s before considered stale
      gcTime: 10 * 60_000, // keep in cache for 10m after unused
      refetchOnMount: true, // only if stale
      refetchOnReconnect: true, // only if stale
      refetchOnWindowFocus: true, // only if stale
    });

  const flatData = useMemo(
    () => (data?.pages || []).flatMap((p) => (p?.isOk ? p.data : [])),
    [data?.pages],
  );

  const handleEndReached = useCallback(() => {
    Sentry.addBreadcrumb({
      category: 'ui',
      message: 'Catalog reached end, attempting to fetch next page',
      level: 'info',
    });

    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback(async () => {
    Sentry.addBreadcrumb({
      category: 'ui',
      message: 'Catalog pull-to-refresh triggered',
      level: 'info',
    });
    await refetch(); // pull-to-refresh
  }, [refetch]);

  return (
    <WithModal>
      <View style={[styles.mainContainer, { marginTop: insets.top + 16 }]}>
        <View style={{ zIndex: 100, paddingHorizontal: 20, width: '100%' }}>
          <FilterButton>
            <Text style={styles.headerText}>Catalog</Text>
          </FilterButton>
        </View>

        <View style={tailwind`z-5 flex-1 w-[${width}px]`}>
          {isLoading && flatData.length === 0 ? (
            <MiniArtworkCardLoader />
          ) : (
            <ArtworksListing
              data={flatData}
              loadingMore={isFetchingNextPage}
              onEndReached={handleEndReached}
              onRefresh={handleRefresh}
            />
          )}
        </View>
      </View>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.primary_black,
  },
});
