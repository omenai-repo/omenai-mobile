import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { colors } from "config/colors.config";
import BackHeaderTitle from "components/header/BackHeaderTitle";
import MiniArtworkCardLoader from "components/general/MiniArtworkCardLoader";
import { RefreshControl } from "react-native-gesture-handler";
import { fetchArtworks } from "services/artworks/fetchArtworks";
import { useModalStore } from "store/modal/modalStore";
import { fetchCuratedArtworks } from "services/artworks/fetchCuratedArtworks";
import Pagination from "screens/catalog/components/Pagination";
import ArtworksCountsContainer from "./components/ArtworksCountsContainer";
import { artworkCategoriesStore } from "store/artworks/ArtworkCategoriesStore";
import { fetchTrendingArtworks } from "services/artworks/fetchTrendingArtworks";
import { fetchPaginatedArtworks } from "services/artworks/fetchPaginatedArtworks";
import ScrollWrapper from "components/general/ScrollWrapper";
import ArtworksListing from "components/general/ArtworksListing";

export default function ArtworkCategories() {
  const isFocused = useIsFocused();
  const route = useRoute();
  const { title } = route.params as { title: artworkListingType };

  // const [data, setData] = useState([]);
  const [loadingMore, setLoadingmore] = useState<boolean>(false);

  const { updateModal } = useModalStore();
  const {
    artworks,
    setArtworks,
    isLoading,
    setIsLoading,
    pageCount,
    setPageCount,
    filterOptions,
    artworkCount,
    setArtworkCount,
    setCategory,
    clearAllFilters,
  } = artworkCategoriesStore();

  useEffect(() => {
    if (isFocused) {
      setCategory(title);
      handleFetchArtworks();
    }
  }, [filterOptions, isFocused]);

  const handleDataReset = () => {
    setArtworks([]);
    setPageCount(1);
    setArtworkCount(0);
    clearAllFilters();
  };

  const handleFetchArtworks = async () => {
    setIsLoading(true);

    let results;

    if (title === "curated") {
      results = await fetchCuratedArtworks({
        page: pageCount,
        filters: filterOptions,
      });
    } else if (title === "trending") {
      results = await fetchTrendingArtworks({
        page: pageCount,
        filters: filterOptions,
      });
    } else if (title === "recent") {
      results = await fetchPaginatedArtworks(pageCount, filterOptions);
    }

    if (results) {
      const resData = results.data;
      // const newArr = [...data, ...resData]
      setArtworks(resData);
      setArtworkCount(resData.length);
    } else {
      updateModal({
        message: "Error fetching " + title + " artworks",
        showModal: true,
        modalType: "error",
      });
    }

    setIsLoading(false);
    setLoadingmore(false);
  };

  const handlePagination = async () => {
    setLoadingmore(true);

    let response;

    if (title === "curated") {
      response = await fetchCuratedArtworks({ page: pageCount + 1 });
    } else if (title === "trending") {
      response = await fetchTrendingArtworks({
        page: pageCount + 1,
        filters: filterOptions,
      });
    } else if (title === "recent") {
      response = await fetchArtworks({
        listingType: title,
        page: pageCount + 1,
      });
    }

    if (response.isOk) {
      const responseData = response.body.data;
      const newArr = [...responseData, ...artworks];

      setArtworks(newArr);
      setArtworkCount(newArr.length);
    } else {
      //throw error
    }

    setPageCount(pageCount + 1);
    setLoadingmore(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <BackHeaderTitle title={title + " artworks"} callBack={handleDataReset} />
      {isLoading ? (
        <View style={{ paddingTop: 20, paddingHorizontal: 20 }}>
          <MiniArtworkCardLoader />
        </View>
      ) : (
        <ScrollWrapper
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          onEndReached={handlePagination}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => {
                handleDataReset();
                handleFetchArtworks();
              }}
            />
          }
        >
          <ArtworksCountsContainer count={artworkCount} title={title} />
          <ArtworksListing 
            data={artworks} 
          />
          <View style={{ height: 300 }} />
        </ScrollWrapper>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
