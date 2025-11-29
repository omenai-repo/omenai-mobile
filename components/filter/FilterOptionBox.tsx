import { filterStore } from "store/artworks/FilterStore";
import { hasFilterValue } from "utils/utils_checkIfFilterExists";
import { Text, TouchableOpacity, View } from "react-native";
import { colors } from "config/colors.config";
import { Feather } from "@expo/vector-icons";
import tw from "twrnc";

type FilterOptionBoxTypes = {
  filters: readonly FilterValueType[];
  label: string;
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

const FilterItem = ({
  name,
  isChecked,
  handleClick,
}: Readonly<FilterItemProps>) => {
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

export default function FilterOptionBox({
  filters,
  label,
}: Readonly<FilterOptionBoxTypes>) {
  const {
    updateFilter,
    setSelectedFilters,
    removeSingleFilterSelection,
    selectedFilters,
  } = filterStore();

  const handleChange = (e: boolean, filter: string, value: string) => {
    if (e) {
      updateFilter(label, value);
      setSelectedFilters(value, filter, label);
    } else {
      removeSingleFilterSelection(filter);
    }
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
        <FilterItem
          name={filter.option}
          isChecked={hasFilterValue(selectedFilters, filter.option)}
          handleClick={(e: boolean) =>
            handleChange(e, filter.option, JSON.stringify(filter.value))
          }
          key={index}
        />
      ))}
    </View>
  );
}
