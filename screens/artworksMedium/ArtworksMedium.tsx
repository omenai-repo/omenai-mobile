import { Text, View } from "react-native";
import tw from "twrnc";
import React, { useCallback, useEffect } from "react";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { StackNavigationProp } from "@react-navigation/stack";

import FilterButton from "#components/filter/FilterButton";
import { colors } from "#config/colors.config";
import MiniArtworkCardLoader from "#components/general/MiniArtworkCardLoader";
import { fetchArtworksByCriteria } from "#services/artworks/fetchArtworksByCriteria";
import { fetchArtworks } from "#services/artworks/fetchArtworks";
import { fetchCuratedArtworks } from "#services/artworks/fetchCuratedArtworks";
import { artworksMediumStore } from "#store/artworks/ArtworksMediumsStore";
import { screenName } from "#constants/screenNames.constants";
import { artworksMediumFilterStore } from "#store/artworks/ArtworksMediumFilterStore";
import ScrollWrapper from "#components/general/ScrollWrapper";
import ArtworksListing from "#components/general/ArtworksListing";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ArtworksMedium() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { catalog } = route.params as { catalog: string };

  const { filterOptions, clearAllFilters } = artworksMediumFilterStore();
  const { setMedium } = artworksMediumStore();

  useEffect(() => {
    setMedium(catalog);
  }, [catalog]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        clearAllFilters();
      };
    }, []),
  );

  const fetchArtworksData = async ({ pageParam = 1 }) => {
    switch (catalog) {
      case "trending": {
        const res = await fetchArtworks({
          listingType: "trending",
          page: pageParam,
        });
        return res.isOk
          ? { data: res.body.data, nextCursor: pageParam + 1 }
          : null;
      }
      case "recent": {
        const res = await fetchArtworks({
          listingType: "recent",
          page: pageParam,
        });
        return res.isOk
          ? { data: res.body.data, nextCursor: pageParam + 1 }
          : null;
      }
      case "curated": {
        const res = await fetchCuratedArtworks({
          page: pageParam,
          filters: filterOptions,
        });
        return res.isOk ? { data: res.data, nextCursor: pageParam + 1 } : null;
      }
      default: {
        const res = await fetchArtworksByCriteria({
          filters: filterOptions,
          medium: catalog,
          page: pageParam,
        });
        return res.isOk ? { data: res.data, nextCursor: pageParam + 1 } : null;
      }
    }
  };

  const getCatalogTitle = () => {
    switch (catalog) {
      case "trending":
        return "Trending";
      case "curated":
        return "Curated";
      case "recent":
        return "New Arrivals";
      default:
        return catalog;
    }
  };

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["artworksMedium", catalog, filterOptions],
    queryFn: fetchArtworksData,
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages: any) => {
      if (!lastPage?.data || lastPage.data.length === 0) return undefined;
      return lastPage.nextCursor;
    },
  });

  const artworks = data?.pages.flatMap((page: any) => page?.data || []) || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <ScrollWrapper
      style={tw.style(`flex-1`, { marginTop: insets.top + 16 })}
      showsVerticalScrollIndicator={false}
    >
      <View style={tw`z-100 px-5`}>
        <FilterButton
          handleClick={() =>
            navigation.navigate(screenName.artworkMediumFilterModal)
          }
        >
          <Text
            style={tw`text-lg font-sans-medium text-[${colors.primary_black}] py-5`}
          >
            {getCatalogTitle()}
          </Text>
        </FilterButton>
      </View>
      {isLoading && <MiniArtworkCardLoader />}
      {!isLoading && artworks && (
        <ArtworksListing
          data={artworks}
          hasMore={!!hasNextPage}
          loadingMore={isFetchingNextPage}
          onEndReached={handleLoadMore}
          onRefresh={handleRefresh}
        />
      )}
    </ScrollWrapper>
  );
}
