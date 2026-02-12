import { Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { colors } from "#config/colors.config";
import { Feather } from "@expo/vector-icons";
import tw from "twrnc";
import GenericFilterOptionBox from "./FilterOptionBox";
import { SharedFilterStore } from "./types";

const priceFilterOptions = [
  { option: "$0 to $1,000", value: { min: 0, max: 1000 } },
  { option: "$1,001 to $10,000", value: { min: 1001, max: 10000 } },
  { option: "$10,001 to $50,000", value: { min: 1001, max: 50000 } },
  { option: "Premium Range", value: { min: 50001, max: 10000000 } },
];

export default function GenericPriceFilter({
  store,
}: {
  readonly store: SharedFilterStore;
}) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const { filterOptions } = store;

  return (
    <View style={{ position: "relative", zIndex: 10 }}>
      <TouchableOpacity onPress={() => setOpenDropdown(!openDropdown)}>
        <View
          style={[
            tw`h-14 px-5 items-center gap-2.5 flex-row rounded-lg`,
            { borderWidth: 1, borderColor: colors.inputBorder },
          ]}
        >
          <View style={tw`flex-1 flex-row items-center gap-2.5`}>
            <Text style={{ color: "#616161", fontSize: 16 }}>Price Range</Text>
            {filterOptions.price.length > 0 && (
              <View
                style={[
                  tw`px-2.5 rounded-lg py-1`,
                  { backgroundColor: "#f5f5f5" },
                ]}
              >
                <Text style={{ fontSize: 12, color: colors.primary_black }}>
                  {filterOptions.price.length}
                </Text>
              </View>
            )}
          </View>
          <Feather name="chevron-down" size={20} color={"#616161"} />
        </View>
      </TouchableOpacity>
      {/* Filter options */}
      {openDropdown && (
        <GenericFilterOptionBox
          filters={priceFilterOptions}
          label={"price"}
          store={store}
        />
      )}
    </View>
  );
}
