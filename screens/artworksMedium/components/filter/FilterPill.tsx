import { Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { colors } from "config/colors.config";
import { artworkActionStore } from "store/artworks/ArtworkActionStore";
import { fetchPaginatedArtworks } from "services/artworks/fetchPaginatedArtworks";
import { artworksMediumStore } from "store/artworks/ArtworksMediumsStore";
import { artworksMediumFilterStore } from "store/artworks/ArtworksMediumFilterStore";
import tw from "twrnc";

export default function FilterPill({ filter }: { filter: string }) {
  const { removeSingleFilterSelection, selectedFilters } =
    artworksMediumFilterStore();
  const { setArtworks, setIsLoading, setPageCount, medium } =
    artworksMediumStore();
  const { paginationCount, updatePaginationCount } = artworkActionStore();

  const handleRemoveSingleFilter = async () => {
    setIsLoading(true);
    if (selectedFilters.length === 1) {
      removeSingleFilterSelection(filter);
      const response = await fetchPaginatedArtworks(paginationCount, {
        price: [],
        year: [],
        medium: [medium],
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
