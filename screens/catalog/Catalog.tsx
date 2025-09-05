import React, { useMemo, useCallback } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { keepPreviousData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { colors } from 'config/colors.config';
import FilterButton from 'components/filter/FilterButton';
import WithModal from 'components/modal/WithModal';
import MiniArtworkCardLoader from 'components/general/MiniArtworkCardLoader';
import ArtworksListing from 'components/general/ArtworksListing';
import tailwind from 'twrnc';
import { useFocusEffect } from '@react-navigation/native';
import { filterStore } from 'store/artworks/FilterStore';
import { fetchPaginatedArtworks } from 'services/artworks/fetchPaginatedArtworks';

type FetchResult = {
  isOk: boolean;
  data: any[];
  count: number; // total pages
  message?: string;
};

// single fetcher used by useInfiniteQuery
async function fetchPage({
  pageParam,
  filters,
}: {
  pageParam: number;
  filters: any;
}): Promise<FetchResult> {
  const res = await fetchPaginatedArtworks(pageParam, filters);
  return res;
}

export default function Catalog() {
  const { width } = Dimensions.get('screen');
  const { filterOptions } = filterStore();
  const queryClient = useQueryClient();

  // memoize filters in the key to avoid re-renders from new object refs
  const filterKey = useMemo(() => filterOptions, [JSON.stringify(filterOptions)]);

  const { data, isLoading, isFetchingNextPage, refetch, fetchNextPage, hasNextPage, status } =
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
      // Keep cached data visible when filters change (better UX)
      placeholderData: keepPreviousData,
    });

  // optional: refetch on focus only if there's no data in cache
  useFocusEffect(
    useCallback(() => {
      if (!data?.pages?.length) {
        refetch();
      }
    }, [data?.pages?.length, refetch]),
  );

  const flatData = useMemo(
    () => (data?.pages || []).flatMap((p) => (p?.isOk ? p.data : [])),
    [data?.pages],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <WithModal>
      <SafeAreaView style={styles.mainContainer}>
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
      </SafeAreaView>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.primary_black,
    paddingVertical: 20,
  },
});
