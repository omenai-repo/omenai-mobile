import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { colors } from "#config/colors.config";
import CustomSelectPicker from "#components/inputs/CustomSelectPicker";
import {
  useSupportTicketsFilterStore,
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  YEAR_OPTIONS,
} from "#store/support/supportTicketsFilterStore";
import GenericFilterLayout from "#components/filter/GenericFilterLayout";

type FilterSectionProps = {
  title: string;
  options: { label: string; value: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
};

function FilterSection({
  title,
  options,
  selectedValue,
  onSelect,
}: Readonly<FilterSectionProps>) {
  return (
    <View style={tw`mb-6`}>
      <Text style={tw`text-sm font-semibold text-gray-700 mb-3`}>{title}</Text>
      <View style={tw`flex-row flex-wrap gap-2`}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => onSelect(option.value)}
            style={[
              tw`px-4 py-2.5 rounded-lg border`,
              selectedValue === option.value
                ? { backgroundColor: colors.black, borderColor: colors.black }
                : tw`bg-white border-gray-200`,
            ]}
          >
            <Text
              style={[
                tw`text-sm font-medium`,
                selectedValue === option.value
                  ? tw`text-white`
                  : tw`text-gray-700`,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function SupportTicketsFilterModal() {
  const navigation = useNavigation();

  const {
    status,
    priority,
    year,
    setStatus,
    setPriority,
    setYear,
    clearAllFilters,
    getSelectedFilters,
  } = useSupportTicketsFilterStore();

  const handleApply = () => {
    navigation.goBack();
  };

  return (
    <GenericFilterLayout
      onApply={handleApply}
      onClear={clearAllFilters}
      selectedFilters={getSelectedFilters()}
      isLoading={false}
    >
      <FilterSection
        title="Status"
        options={STATUS_OPTIONS}
        selectedValue={status}
        onSelect={setStatus}
      />

      <FilterSection
        title="Priority"
        options={PRIORITY_OPTIONS}
        selectedValue={priority}
        onSelect={setPriority}
      />

      <View style={tw`mb-6`}>
        <CustomSelectPicker
          label="Year"
          data={YEAR_OPTIONS}
          value={year}
          handleSetValue={(item) => setYear(item.value)}
          placeholder="Select year"
        />
      </View>
    </GenericFilterLayout>
  );
}
