import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
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
import BackScreenButton from "components/buttons/BackScreenButton";
import tw from "twrnc";

export default function ArtworksMedium() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();

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

  function getImageUrl() {
    const selectedCollection = mediums.filter(
      (collection) => collection.name === catalog
    );
    return `${selectedCollection[0].image}`;
  }

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
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`px-[20px] pt-[60px] android:pt-[40px]`}>
          <BackScreenButton handleClick={() => navigation.goBack()} />
        </View>

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
        <View style={{ height: 100 }} />
      </ScrollWrapper>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.primary_black,
    paddingVertical: 20,
  },
});
