import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { colors } from 'config/colors.config';
import { artworkActionStore } from 'store/artworks/ArtworkActionStore';
import { artworkStore } from 'store/artworks/ArtworkStore';
import { filterStore } from 'store/artworks/FilterStore';
import { fetchPaginatedArtworks } from 'services/artworks/fetchPaginatedArtworks';
import FilterButton from 'components/filter/FilterButton';
import Loader from 'components/general/Loader';
import WithModal from 'components/modal/WithModal';
import { useModalStore } from 'store/modal/modalStore';
import MiniArtworkCardLoader from 'components/general/MiniArtworkCardLoader';
import ScrollWrapper from 'components/general/ScrollWrapper';
import ArtworksListing from 'components/general/ArtworksListing';
import tailwind from 'twrnc';
import { useFocusEffect } from '@react-navigation/native';

type TagItemProps = {
  name: string;
  isSelected: boolean;
};

const tags = ['All collections', 'Live arts', 'Sculptures'];

export default function Catalog() {
  const { paginationCount, updatePaginationCount } = artworkActionStore();
  const { updateModal } = useModalStore();
  const { setArtworks, artworks, isLoading, setPageCount, setIsLoading, pageCount } =
    artworkStore();
  const { filterOptions, clearAllFilters } = filterStore();
  const [reloadCount, setReloadCount] = useState<number>(0);

  const [loadingMore, setLoadingmore] = useState<boolean>(false);

  const { width } = Dimensions.get('screen');

  const handleFetchArtworks = useCallback(async () => {
    setIsLoading(true);
    setArtworks([]);
    updatePaginationCount('reset');
    const response = await fetchPaginatedArtworks(1, filterOptions);
    if (response?.isOk) {
      setArtworks(response.data);
      setPageCount(response.count);
      updateModal({
        message: 'Error fetching artworks, reload page again',
        modalType: 'error',
        showModal: true,
      });
    }
    setIsLoading(false);
  }, [filterOptions, setArtworks, setIsLoading, setPageCount, updatePaginationCount]);

  // Refetch whenever screen is focused OR filters change
  useFocusEffect(
    useCallback(() => {
      handleFetchArtworks();
    }, [handleFetchArtworks]),
  );

  const handlePagination = async () => {
    if (artworks.length < 1) return;
    setLoadingmore(true);
    const response = await fetchPaginatedArtworks(paginationCount + 1, filterOptions);
    if (response?.isOk) {
      setArtworks([...artworks, ...response.data]);
      updatePaginationCount('inc');
      setPageCount(response.count);
    }
    setLoadingmore(false);
  };

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
  topContainer: {
    paddingHorizontal: 20,
  },
  introText: {
    fontSize: 28,
    fontWeight: '500',
    color: colors.primary_black,
    maxWidth: 290,
    paddingVertical: 40,
  },
  mainContainer: {
    // paddingHorizontal: 10,
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  tagItem: {
    backgroundColor: '#FAFAFA',
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
    fontWeight: '500',
    color: colors.primary_black,
    paddingVertical: 20,
  },
});
