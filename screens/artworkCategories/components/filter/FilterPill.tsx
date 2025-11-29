import { Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { colors } from "config/colors.config";
import { fetchPaginatedArtworks } from "services/artworks/fetchPaginatedArtworks";
import { artworkCategoriesStore } from "store/artworks/ArtworkCategoriesStore";
import tw from "twrnc";

export default function FilterPill({ filter }: { filter: string }) {
  const {
    setArtworks,
    setIsLoading,
    setPageCount,
    pageCount,
    selectedFilters,
    removeSingleFilterSelection,
  } = artworkCategoriesStore();

  const handleRemoveSingleFilter = async () => {
    setIsLoading(true);
    if (selectedFilters.length === 1) {
      removeSingleFilterSelection(filter);
      const response = await fetchPaginatedArtworks(pageCount, {
        price: [],
        year: [],
        medium: [],
        rarity: [],
      });
      if (response?.isOk) {
        setArtworks(response.data);
        setPageCount(response.count);
      }
    } else {
      removeSingleFilterSelection(filter);
    }

    setIsLoading(false);
  };

  return (
    <TouchableOpacity onPress={handleRemoveSingleFilter}>
      <View
        style={[
          tw`flex-row items-center gap-2.5 py-2.5 px-4 rounded-lg`,
          { backgroundColor: colors.primary_black },
        ]}
      >
        <Text style={{ fontSize: 14, color: colors.white }}>{filter}</Text>
        <Feather name="x" size={20} color={colors.white} />
      </View>
    </TouchableOpacity>
  );
}
