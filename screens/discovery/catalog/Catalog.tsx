import React, { useMemo, useCallback } from "react";
import { Text, View, Dimensions } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { colors } from "#config/colors.config";
import FilterButton from "#components/filter/FilterButton";

import MiniArtworkCardLoader from "#components/general/MiniArtworkCardLoader";
import ArtworksListing from "#components/general/ArtworksListing";
import tailwind from "twrnc";
import { filterStore } from "#store/artwork/filterStore";
import { fetchPaginatedArtworks } from "#services/artwork/fetchPaginatedArtworks";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FetchResult = {
  isOk: boolean;
  data: any[];
  count: number; // total pages
  message?: string;
};

// Single fetcher for useInfiniteQuery
async function fetchPage({
  pageParam,
  filters,
}: {
  pageParam: number;
  filters: any;
}): Promise<FetchResult> {
  return fetchPaginatedArtworks(pageParam, filters);
}

export default function Catalog() {
  const { width } = Dimensions.get("screen");
  const { filterOptions } = filterStore();
  const insets = useSafeAreaInsets();

  // Stable key part for filters (changes only when content actually changes)
  const filterKey = useMemo(
    () => filterOptions,
    [JSON.stringify(filterOptions)],
  );

  const {
    data,
    isLoading,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["catalog", filterKey],
    queryFn: ({ pageParam = 1 }) =>
      fetchPage({ pageParam, filters: filterOptions }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.isOk) return undefined;
      const totalPages = lastPage.count ?? 1;
      const next = allPages.length + 1;
      return next <= totalPages ? next : undefined;
    },

    // Keep showing the previous list while new filters load
    // (keepPreviousData (symbol) is fine for useQuery; for infinite queries we pass the previous data through)
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
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback(async () => {
    await refetch(); // pull-to-refresh
  }, [refetch]);

  return (
    <View
      style={[tailwind`flex-1 items-center`, { marginTop: insets.top + 16 }]}
    >
      <View style={tailwind`z-50 px-5 w-full mb-4`}>
        <FilterButton>
          <Text
            style={[
              tailwind`text-lg font-sans-medium`,
              { color: colors.primary_black },
            ]}
          >
            All Works
          </Text>
        </FilterButton>
      </View>

      <View style={tailwind`z-5 flex-1 w-[${width}px]`}>
        {isLoading && flatData.length === 0 ? (
          <MiniArtworkCardLoader />
        ) : (
          <ArtworksListing
            data={flatData}
            hasMore={!!hasNextPage}
            loadingMore={isFetchingNextPage}
            onEndReached={handleEndReached}
            onRefresh={handleRefresh}
          />
        )}
      </View>
    </View>
  );
}
