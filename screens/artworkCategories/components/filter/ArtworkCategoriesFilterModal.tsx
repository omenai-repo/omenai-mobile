import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "config/colors.config";
import { Feather } from "@expo/vector-icons";
import PriceFilter from "./PriceFilter";
import YearFilter from "./YearFilter";
import FilterPill from "./FilterPill";
import RarityFilter from "./RarityFilter";
import BackScreenButton from "components/buttons/BackScreenButton";
import LongBlackButton from "components/buttons/LongBlackButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { artworkCategoriesStore } from "store/artworks/ArtworkCategoriesStore";
import MediumFilter from "./MediumFilter";
import ScrollWrapper from "components/general/ScrollWrapper";

export default function ArtworkCategoriesFilterModal() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const {
    setArtworks,
    setIsLoading,
    setPageCount,
    isLoading,
    clearAllFilters,
    selectedFilters,
    filterOptions,
    setArtworkCount,
    category,
  } = artworkCategoriesStore();

  const handleSubmitFilter = async () => {
    setPageCount(1);
    setArtworkCount(0);
    setArtworks([]);
    navigation.goBack();
  };

  return (
    <View style={{ backgroundColor: colors.white, flex: 1 }}>
      <SafeAreaView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 20,
            backgroundColor: colors.white,
            paddingBottom: 10,
            paddingTop: 20,
          }}
        >
          <View style={{ flex: 1 }}>
            <BackScreenButton cancle handleClick={() => navigation.goBack()} />
          </View>

          {selectedFilters.length > 0 && (
            <TouchableOpacity onPress={clearAllFilters}>
              <View style={styles.clearButton}>
                <Text style={styles.filterButtonText}>Clear filters</Text>
                <Feather name="trash" size={18} color={colors.primary_black} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
      <ScrollWrapper style={{ flex: 1 }}>
        {selectedFilters.length > 0 && (
          <View style={styles.selectedFilterContainer}>
            {selectedFilters.map((filter, index) => (
              <FilterPill filter={filter.name} key={index} />
            ))}
          </View>
        )}
        <View style={styles.FiltersListing}>
          <MediumFilter />
          <PriceFilter />
          <YearFilter />
          <RarityFilter />
        </View>
        <View style={{ height: 200 }} />
      </ScrollWrapper>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          paddingHorizontal: 20,
          paddingVertical: 20,
          width: "100%",
        }}
      >
        <SafeAreaView>
          <LongBlackButton
            value={"Apply filters"}
            onClick={handleSubmitFilter}
            isLoading={isLoading}
          />
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  leftContainer: {
    flex: 1,
    overflow: "hidden",
  },
  clearButton: {
    height: 40,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#FAFAFA",
    borderRadius: 30,
    // borderWidth: 1,
    // borderColor: colors.inputBorder,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.primary_black,
  },
  sortIcon: {
    height: 20,
    width: 20,
  },
  FiltersListing: {
    gap: 15,
    marginTop: 30,
    paddingHorizontal: 20,
  },
  FilterSelectContainer: {
    height: 55,
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 5,
    flexDirection: "row",
  },
  selectedFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
    flexWrap: "wrap",
    paddingHorizontal: 20,
  },
});
