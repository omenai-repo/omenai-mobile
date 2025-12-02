import { hasFilterValue } from "utils/utils_checkIfFilterExists";
import { Text, TouchableOpacity, View } from "react-native";
import { colors } from "config/colors.config";
import { Feather } from "@expo/vector-icons";
import tw from "twrnc";
import { SharedFilterStore } from "./types";

type FilterOptionBoxTypes = {
  readonly filters: readonly FilterValueType[];
  readonly label: string;
  readonly store: SharedFilterStore;
};

type FilterValueType = {
  option: string;
  value: { min: number; max: number } | string;
};

type FilterItemProps = {
  name: string;
  isChecked: boolean;
  handleClick: (e: boolean) => void;
};

const Item = ({ name, isChecked, handleClick }: FilterItemProps) => {
  return (
    <TouchableOpacity onPress={() => handleClick(!isChecked)}>
      <View style={tw`gap-2.5 flex-row items-center`}>
        <View
          style={[
            tw`h-5 w-5 items-center justify-center rounded`,
            {
              borderWidth: 1,
              borderColor: colors.inputBorder,
              backgroundColor: "#f5f5f5",
            },
            isChecked && { backgroundColor: colors.primary_black },
          ]}
        >
          {isChecked && <Feather name="check" size={15} color={colors.white} />}
        </View>
        <Text style={{ fontSize: 16 }}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function GenericFilterOptionBox({
  filters,
  label,
  store,
}: FilterOptionBoxTypes) {
  const {
    updateFilter,
    setSelectedFilters,
    removeSingleFilterSelection,
    selectedFilters,
  } = store;

  const handleSelect = (filter: string, value: string) => {
    updateFilter(label, value);
    setSelectedFilters(value, filter, label);
  };

  const handleDeselect = (filter: string) => {
    removeSingleFilterSelection(filter);
  };

  return (
    <View
      style={[
        tw`w-full rounded-lg gap-4 p-4 mt-2.5 bg-white`,
        {
          borderWidth: 1,
          borderColor: colors.inputBorder,
          zIndex: 500,
        },
      ]}
    >
      {filters.map((filter, index) => (
        <Item
          name={filter.option}
          isChecked={hasFilterValue(selectedFilters, filter.option)}
          handleClick={(e) => {
            if (e) {
              handleSelect(filter.option, JSON.stringify(filter.value));
            } else {
              handleDeselect(filter.option);
            }
          }}
          key={index}
        />
      ))}
    </View>
  );
}
