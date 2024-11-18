import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import WithModal from "components/modal/WithModal";
import Header from "./components/Header";
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
      console.log(res);
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
      <Header image={getImageUrl()} goBack={() => navigation.goBack()} />
      <ScrollWrapper
        style={styles.container}
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
        <View style={{ height: 100 }} />
      </ScrollWrapper>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.primary_black,
    paddingVertical: 20,
  },
});
