import { Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { colors } from "#config/colors.config";
import { Feather } from "@expo/vector-icons";
import tw from "twrnc";
import GenericFilterOptionBox from "./FilterOptionBox";
import { SharedFilterStore } from "./types";

const yearFilterOptions = [
  { option: "2020s — Present", value: { min: 2020, max: 2029 } },
  { option: "2010s", value: { min: 2010, max: 2019 } },
  { option: "2000s", value: { min: 2000, max: 2009 } },
  { option: "Modernist Era", value: { min: 1900, max: 1999 } },
  { option: "Historical", value: { min: 0, max: 1899 } },
];

export default function GenericYearFilter({
  store,
}: {
  readonly store: SharedFilterStore;
}) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const { filterOptions } = store;

  return (
    <View style={{ position: "relative", zIndex: 9 }}>
      <TouchableOpacity onPress={() => setOpenDropdown(!openDropdown)}>
        <View
          style={[
            tw`h-14 px-5 items-center gap-2.5 flex-row rounded-md`,
            { borderWidth: 1, borderColor: colors.inputBorder },
          ]}
        >
          <View style={tw`flex-1 flex-row items-center gap-2.5`}>
            <Text style={{ color: "#616161", fontSize: 16 }}>
              Year of creation
            </Text>
            {filterOptions.year.length > 0 && (
              <View
                style={[
                  tw`px-2.5 rounded-md py-1`,
                  { backgroundColor: "#f5f5f5" },
                ]}
              >
                <Text style={{ fontSize: 12, color: colors.primary_black }}>
                  {filterOptions.year.length}
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
          filters={yearFilterOptions}
          label={"year"}
          store={store}
        />
      )}
    </View>
  );
}
