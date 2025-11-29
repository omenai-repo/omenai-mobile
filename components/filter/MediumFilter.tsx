import { Text, View } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors } from "config/colors.config";
import { Feather } from "@expo/vector-icons";
import { filterStore } from "store/artworks/FilterStore";
import FilterOptionBox from "./FilterOptionBox";
import tw from "twrnc";

export const optionsMedium = [
  "Photography",
  "Works on paper",
  "Acrylic on canvas/linen/panel",
  "Mixed media on paper/canvas",
  "Sculpture (Resin/plaster/clay)",
  "Oil on canvas/panel",
  "Sculpture (Bronze/stone/metal)",
];

const mediumFilterOptions = optionsMedium.map((option) => ({
  option: option,
  value: option,
}));

export default function MediumFilter() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const { filterOptions } = filterStore();

  return (
    <View style={{ position: "relative", zIndex: 8 }}>
      <TouchableOpacity onPress={() => setOpenDropdown(!openDropdown)}>
        <View
          style={[
            tw`h-14 px-5 items-center gap-2.5 flex-row rounded-lg`,
            { borderWidth: 1, borderColor: colors.inputBorder },
          ]}
        >
          <View style={tw`flex-1 flex-row items-center gap-2.5`}>
            <Text style={{ color: "#616161", fontSize: 16 }}>
              Filter by medium
            </Text>
            {filterOptions.medium.length > 0 && (
              <View
                style={[
                  tw`px-2.5 rounded-lg py-1`,
                  { backgroundColor: "#f5f5f5" },
                ]}
              >
                <Text style={{ fontSize: 12, color: colors.primary_black }}>
                  {filterOptions.medium.length}
                </Text>
              </View>
            )}
          </View>
          <Feather name="chevron-down" size={20} color={"#616161"} />
        </View>
      </TouchableOpacity>
      {/* Filter options */}
      {openDropdown && (
        <FilterOptionBox filters={mediumFilterOptions} label={"medium"} />
      )}
    </View>
  );
}
