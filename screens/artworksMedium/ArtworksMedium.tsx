import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect } from "react";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import WithModal from "components/modal/WithModal";
import FilterButton from "components/filter/FilterButton";
import { colors } from "config/colors.config";
import MiniArtworkCardLoader from "components/general/MiniArtworkCardLoader";
import { fetchArtworksByCriteria } from "services/artworks/fetchArtworksByCriteria";
import { artworksMediumStore } from "store/artworks/ArtworksMediumsStore";
import { useModalStore } from "store/modal/modalStore";
import { screenName } from "constants/screenNames.constants";
import { artworksMediumFilterStore } from "store/artworks/ArtworksMediumFilterStore";
import { mediums } from "constants/mediums";
import ScrollWrapper from "components/general/ScrollWrapper";
import ArtworksListing from "components/general/ArtworksListing";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ArtworksMedium() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const { updateModal } = useModalStore();
  const {
    setArtworks,
    artworks,
    isLoading,
    setMedium,
    setIsLoading,
    pageCount,
  } = artworksMediumStore();
  const { filterOptions, clearAllFilters } = artworksMediumFilterStore();

  const { catalog } = route.params as { catalog: string };

  useEffect(() => {
    setMedium(catalog);
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        clearAllFilters();
      };
    }, [])
  );

  useEffect(() => {
    clearAllFilters();
    handleFetchArtworks();
  }, []);

  const handleFetchArtworks = async () => {
    setIsLoading(true);

    const res = await fetchArtworksByCriteria({
      filters: filterOptions,
      medium: catalog,
      page: pageCount,
    });

    if (res.isOk) {
      setArtworks(res.data);
    } else {
      updateModal({
        message: `Error fetching ${catalog} artworks, reload page again`,
        modalType: "error",
        showModal: true,
      });
    }

    setIsLoading(false);
  };

  return (
    <WithModal>
      <ScrollWrapper
        style={[styles.container, { marginTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ zIndex: 100, paddingHorizontal: 10 }}>
          <FilterButton
            handleClick={() =>
              navigation.navigate(screenName.artworkMediumFilterModal)
            }
          >
            <Text style={styles.headerText}>{catalog}</Text>
          </FilterButton>
        </View>
        {isLoading && <MiniArtworkCardLoader />}
        {!isLoading && artworks && <ArtworksListing data={artworks} />}
      </ScrollWrapper>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.primary_black,
    paddingVertical: 20,
  },
});
