import { filterStore } from "store/artworks/FilterStore";
import { hasFilterValue } from "utils/checkIfFilterExists";
import { ChangeEvent } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "config/colors.config";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";

type FilterOptionBoxTypes = {
  filters: FilterValueType[];
  label: string;
};

type FilterValueType = {
  option: string;
  value: { min: number; max: number } | string;
};

type FilterItemProps = {
  name: string,
  isChecked: boolean,
  handleClick: (e: boolean) => void
}
export default function FilterOptionBox({
  filters,
  label,
}: FilterOptionBoxTypes) {

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
      // removeFilter(label, e.target.value);
      removeSingleFilterSelection(filter);
    }
  };


  const Item = ({name, isChecked, handleClick}: FilterItemProps) => {
    return(
      <TouchableOpacity onPress={() => handleClick(!isChecked)}>
        <View style={styles.itemContainer}>
          <View style={[styles.checkBox, isChecked && {backgroundColor: colors.primary_black}]}>{isChecked && <Feather name="check" size={15} color={colors.white} />}</View>
          <Text style={{fontSize: 16}}>{name}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      {filters.map((filter, index) => (
        <Item
          name={filter.option}
          isChecked={hasFilterValue(selectedFilters, filter.option)}
          handleClick={(e) => handleChange(e, filter.option, JSON.stringify(filter.value))}
          key={index}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    // position: 'absolute',
    // top: '100%',
    zIndex: 500,
    padding: 15,
    gap: 15,
    marginTop: 10
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  checkBox: {
    height: 20,
    width: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center'
  }
})