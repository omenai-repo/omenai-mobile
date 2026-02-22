import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "#config/colors.config";
import tw from "twrnc";

type FilterType = "30d" | "90d" | "6m" | "all";

type TransactionFiltersProps = {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
};

export default function TransactionFilters({
  activeFilter,
  onFilterChange,
}: TransactionFiltersProps) {
  const filters: FilterType[] = ["all", "30d", "90d", "6m"];

  return (
    <View style={tw`flex-row gap-2.5 mb-5 flex-wrap`}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={tw`py-2 px-4 rounded-sm bg-[#f5f5f5] border border-transparent ${
            activeFilter === filter ? `bg-[${colors.primary_black}]` : ""
          }`}
          onPress={() => onFilterChange(filter)}
        >
          <Text
            style={tw`text-xs font-medium text-[${colors.grey}] ${
              activeFilter === filter ? "text-white" : ""
            }`}
          >
            {filter === "all" ? "All time" : filter}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
