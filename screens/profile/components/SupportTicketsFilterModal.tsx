import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { colors } from "#config/colors.config";
import LongBlackButton from "#components/buttons/LongBlackButton";
import BackScreenButton from "#components/buttons/BackScreenButton";
import ScrollWrapper from "#components/general/ScrollWrapper";
import FilterPill from "#components/filter/FilterPill";
import CustomSelectPicker from "#components/inputs/CustomSelectPicker";
import {
  useSupportTicketsFilterStore,
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  YEAR_OPTIONS,
} from "#store/support/supportTicketsFilterStore";

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
  const { top } = useSafeAreaInsets();

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

  const selectedFilters = getSelectedFilters();

  const handleApply = () => {
    navigation.goBack();
  };

  return (
    <View style={[tw`flex-1`, { backgroundColor: colors.white }]}>
      <View
        style={[
          tw`flex-row items-center pb-2.5 gap-2.5 px-5`,
          {
            backgroundColor: colors.white,
            paddingTop: Platform.OS === "ios" ? 20 : top + 10,
          },
        ]}
      >
        <View style={tw`flex-1 overflow-hidden`}>
          <BackScreenButton cancle handleClick={() => navigation.goBack()} />
        </View>

        {selectedFilters.length > 0 && (
          <TouchableOpacity onPress={clearAllFilters}>
            <View
              style={[
                tw`flex-row items-center justify-center rounded-lg px-5 h-10 gap-2.5`,
                { backgroundColor: "#FAFAFA" },
              ]}
            >
              <Text style={[tw`text-sm`, { color: colors.primary_black }]}>
                Clear filters
              </Text>
              <Feather name="trash" size={18} color={colors.primary_black} />
            </View>
          </TouchableOpacity>
        )}
      </View>

      <ScrollWrapper style={tw`flex-1`}>
        {selectedFilters.length > 0 && (
          <View style={tw`flex-row items-center gap-2.5 mt-5 px-5 flex-wrap`}>
            {selectedFilters.map((filter, index) => (
              <FilterPill
                filter={filter.name}
                key={`${filter.name}-${index}`}
              />
            ))}
          </View>
        )}

        <View style={tw`px-5 mt-6`}>
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
        </View>

        <View style={{ height: 200 }} />
      </ScrollWrapper>

      <View style={tw`absolute bottom-0 w-full p-5 pb-10 bg-white`}>
        <LongBlackButton value="Apply filters" onClick={handleApply} />
      </View>
    </View>
  );
}
