import { Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { colors } from "config/colors.config";
import { Feather } from "@expo/vector-icons";
import FilterOptionBox from "./FilterOptionBox";
import { artworkCategoriesStore } from "store/artworks/ArtworkCategoriesStore";
import tw from "twrnc";

const rarityFilterOptions = [
  { option: "Unique", value: "Unique" },
  { option: "Limited edition", value: "Limited edition" },
  { option: "Open edition", value: "Open edition" },
  { option: "Unknown edition", value: "Unknown edition" },
];

export default function RarityFilter() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const { filterOptions } = artworkCategoriesStore();

  return (
    <View style={{ position: "relative", zIndex: 7 }}>
      <TouchableOpacity onPress={() => setOpenDropdown(!openDropdown)}>
        <View
          style={[
            tw`h-14 px-5 items-center gap-2.5 flex-row rounded-lg`,
            { borderWidth: 1, borderColor: colors.inputBorder },
          ]}
        >
          <View style={tw`flex-1 flex-row items-center gap-2.5`}>
            <Text style={{ color: "#616161", fontSize: 16 }}>
              Filter by rarity
            </Text>
            {filterOptions.rarity.length > 0 && (
              <View
                style={[
                  tw`px-2.5 rounded-lg py-1`,
                  { backgroundColor: "#f5f5f5" },
                ]}
              >
                <Text style={{ fontSize: 12, color: colors.primary_black }}>
                  {filterOptions.rarity.length}
                </Text>
              </View>
            )}
          </View>
          <Feather name="chevron-down" size={20} color={"#616161"} />
        </View>
      </TouchableOpacity>
      {/* Filter options */}
      {openDropdown && (
        <FilterOptionBox filters={rarityFilterOptions} label={"rarity"} />
      )}
    </View>
  );
}
