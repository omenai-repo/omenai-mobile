import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors } from "config/colors.config";
import { Feather } from "@expo/vector-icons";
import { filterStore } from "store/artworks/FilterStore";
import FilterOptionBox from "./FilterOptionBox";

export const optionsMedium = [
  "Acrylic",
  "Oil",
  "Fabric",
  "Mixed media",
  "Ink",
  "Collage or other works on paper",
  "Ankara",
  "Photography",
  "Charcoal",
  "Canvas",
  "Paper",
  "Other",
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
        <View style={styles.FilterSelectContainer}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Text style={{ color: "#616161", fontSize: 16 }}>
              Filter by medium
            </Text>
            {filterOptions.medium.length > 0 && (
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 20,
                }}
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

const styles = StyleSheet.create({
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
});
