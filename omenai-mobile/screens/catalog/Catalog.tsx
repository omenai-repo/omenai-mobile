import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Platform,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "config/colors.config";
import { artworkActionStore } from "store/artworks/ArtworkActionStore";
import { artworkStore } from "store/artworks/ArtworkStore";
import { filterStore } from "store/artworks/FilterStore";
import { fetchPaginatedArtworks } from "services/artworks/fetchPaginatedArtworks";
import FilterButton from "components/filter/FilterButton";
import Loader from "components/general/Loader";
import WithModal from "components/modal/WithModal";
import { useModalStore } from "store/modal/modalStore";
import MiniArtworkCardLoader from "components/general/MiniArtworkCardLoader";
import ScrollWrapper from "components/general/ScrollWrapper";
import ArtworksListing from "components/general/ArtworksListing";

type TagItemProps = {
  name: string;
  isSelected: boolean;
};

const tags = ["All collections", "Live arts", "Sculptures"];

export default function Catalog() {
  const { paginationCount, updatePaginationCount } = artworkActionStore();
  const { updateModal } = useModalStore();
  const {
    setArtworks,
    artworks,
    isLoading,
    setPageCount,
    setIsLoading,
    pageCount,
  } = artworkStore();
  const { filterOptions, clearAllFilters } = filterStore();
  const [reloadCount, setReloadCount] = useState<number>(0);

  const [loadingMore, setLoadingmore] = useState<boolean>(false);

  useEffect(() => {
    handleFecthArtworks();
    updatePaginationCount("reset");
  }, [reloadCount]);

  const handleFecthArtworks = async () => {
    setIsLoading(true);
    clearAllFilters();
    setArtworks([]);
    const response = await fetchPaginatedArtworks(1, {
      medium: [],
      price: [],
      rarity: [],
      year: [],
    });
    if (response?.isOk) {
      setArtworks(response.data);
      setPageCount(response.count);
    } else {
      updateModal({
        message: "Error fetching artworks, reload page again",
        modalType: "error",
        showModal: true,
      });
    }
    setIsLoading(false);
  };

  const handlePagination = async (type: "dec" | "inc") => {
    setLoadingmore(true);

    const response = await fetchPaginatedArtworks(
      paginationCount + 1,
      filterOptions
    );
    if (response?.isOk) {
      const arr = [...artworks, ...response.data];

      setArtworks(arr);
      updatePaginationCount(type);
      setPageCount(response.count);
    } else {
      //throw error
      console.log(response);
      updateModal({
        message: response?.message,
        showModal: true,
        modalType: "error",
      });
    }

    setLoadingmore(false);
  };

  return (
    <WithModal>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainContainer}>
          <View style={{ zIndex: 100 }}>
            <FilterButton>
              <Text style={styles.headerText}>Catalog</Text>
            </FilterButton>
          </View>
          <View style={{ zIndex: 5, flex: 1 }}>
            {isLoading ? (
              <MiniArtworkCardLoader />
            ) : (
              <ScrollWrapper
                style={{ flex: 1,}}
                showsVerticalScrollIndicator={false}
                onEndReached={handlePagination}
                onEndReachedThreshold={0.9}
                refreshControl={
                  <RefreshControl
                    refreshing={false}
                    onRefresh={() => setReloadCount((prev) => prev + 1)}
                  />
                }
              >
                <ArtworksListing 
                  data={artworks} 
                  loadingMore={loadingMore}
                />
                <View style={{ height: 300 }} />
              </ScrollWrapper>
            )}
          </View>
        </View>
      </SafeAreaView>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    paddingHorizontal: 20,
  },
  introText: {
    fontSize: 28,
    fontWeight: "500",
    color: colors.primary_black,
    maxWidth: 290,
    paddingVertical: 40,
  },
  mainContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingTop: 10,
    flex: 1,
  },
  tagItem: {
    backgroundColor: "#FAFAFA",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginRight: 10,
  },
  tagText: {
    fontSize: 12,
    color: colors.primary_black,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.primary_black,
    paddingVertical: 20,
  },
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
  },
});
