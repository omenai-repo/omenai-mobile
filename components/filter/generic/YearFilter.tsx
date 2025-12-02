import { Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { colors } from "config/colors.config";
import { Feather } from "@expo/vector-icons";
import tw from "twrnc";
import GenericFilterOptionBox from "./FilterOptionBox";
import { SharedFilterStore } from "./types";

const yearFilterOptions = [
  { option: "2020s", value: { min: 2020, max: 2029 } },
  { option: "2010s", value: { min: 2010, max: 2019 } },
  { option: "2000s", value: { min: 2000, max: 2009 } },
  { option: "1990s", value: { min: 1990, max: 1999 } },
  { option: "1980s", value: { min: 1980, max: 1989 } },
  { option: "1970s", value: { min: 1970, max: 1979 } },
  { option: "1960s", value: { min: 1960, max: 1969 } },
  { option: "1950s", value: { min: 1950, max: 1959 } },
  { option: "1940s", value: { min: 1940, max: 1949 } },
  { option: "1930s", value: { min: 1930, max: 1939 } },
  { option: "1920s", value: { min: 1920, max: 1929 } },
  { option: "1910s", value: { min: 1910, max: 1919 } },
  { option: "1900s", value: { min: 1900, max: 1909 } },
  { option: "19th century", value: { min: 1800, max: 1899 } },
  { option: "18th century & Earlier", value: { min: 0, max: 1799 } },
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
            tw`h-14 px-5 items-center gap-2.5 flex-row rounded-lg`,
            { borderWidth: 1, borderColor: colors.inputBorder },
          ]}
        >
          <View style={tw`flex-1 flex-row items-center gap-2.5`}>
            <Text style={{ color: "#616161", fontSize: 16 }}>
              Filter by year
            </Text>
            {filterOptions.year.length > 0 && (
              <View
                style={[
                  tw`px-2.5 rounded-lg py-1`,
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
