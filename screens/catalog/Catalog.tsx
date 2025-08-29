import React, { useCallback, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { colors } from 'config/colors.config';
import { artworkActionStore } from 'store/artworks/ArtworkActionStore';
import { artworkStore } from 'store/artworks/ArtworkStore';
import { filterStore } from 'store/artworks/FilterStore';
import { fetchPaginatedArtworks } from 'services/artworks/fetchPaginatedArtworks';
import FilterButton from 'components/filter/FilterButton';
import WithModal from 'components/modal/WithModal';
import { useModalStore } from 'store/modal/modalStore';
import MiniArtworkCardLoader from 'components/general/MiniArtworkCardLoader';
import ArtworksListing from 'components/general/ArtworksListing';
import tailwind from 'twrnc';
import { useFocusEffect } from '@react-navigation/native';

export default function Catalog() {
  const { paginationCount, updatePaginationCount } = artworkActionStore();
  const { updateModal } = useModalStore();
  const { setArtworks, artworks, isLoading, setPageCount, setIsLoading, pageCount } =
    artworkStore();
  const [loadingMore, setLoadingmore] = useState<boolean>(false);
  const { filterOptions } = filterStore();

  const inFlight = useRef(false);
  const { width } = Dimensions.get('screen');

  const handleFetchArtworks = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;

    try {
      setIsLoading(true);
      setArtworks([]);
      updatePaginationCount('reset');

      const response = await fetchPaginatedArtworks(1, filterOptions);

      if (response?.isOk) {
        setArtworks(response.data);
        setPageCount(response.count);
      } else {
        updateModal({
          message: response?.message || 'Error fetching artworks. Please try again.',
          modalType: 'error',
          showModal: true,
        });
      }
    } finally {
      setIsLoading(false);
      inFlight.current = false;
    }
  }, [filterOptions, setArtworks, setIsLoading, setPageCount, updatePaginationCount, updateModal]);

  // Refetch whenever screen is focused OR filters change
  useFocusEffect(
    useCallback(() => {
      handleFetchArtworks();
    }, [handleFetchArtworks]),
  );

  const handlePagination = useCallback(async () => {
    if (inFlight.current) return;
    if (artworks.length < 1) return;
    setLoadingmore(true);
    setTimeout(() => {
      setLoadingmore(false);
    }, 1000);
    // stop if we’re already on/over the last page
    if (pageCount && paginationCount >= pageCount) return;

    inFlight.current = true;
    try {
      const response = await fetchPaginatedArtworks(paginationCount + 1, filterOptions);
      if (response?.isOk) {
        setArtworks([...artworks, ...response.data]);
        updatePaginationCount('inc');
        setPageCount(response.count);
      }
    } finally {
      inFlight.current = false;
    }
  }, [
    artworks.length,
    pageCount,
    paginationCount,
    filterOptions,
    setArtworks,
    updatePaginationCount,
    setPageCount,
  ]);

  return (
    <WithModal>
      <SafeAreaView style={styles.mainContainer}>
        <View style={{ zIndex: 100, paddingHorizontal: 20, width: '100%' }}>
          <FilterButton>
            <Text style={styles.headerText}>Catalog</Text>
          </FilterButton>
        </View>

        <View style={tailwind`z-5 flex-1 w-[${width}px]`}>
          {isLoading ? (
            <MiniArtworkCardLoader />
          ) : (
            <ArtworksListing
              data={artworks}
              loadingMore={loadingMore}
              onEndReached={handlePagination}
              onRefresh={handleFetchArtworks}
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
