import { Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  DIMENSION_UNITS,
  WEIGHT_UNITS,
} from "#utils/artwork/utils_artworkUnits";
import tw from "twrnc";

import { colors } from "#config/colors.config";

type DimensionUnitPickerProps =
  | {
      type: "dimension";
      value: DimensionUnit;
      onChange: (unit: DimensionUnit) => void;
    }
  | {
      type: "weight";
      value: WeightUnit;
      onChange: (unit: WeightUnit) => void;
    };

export default function DimensionUnitPicker(props: DimensionUnitPickerProps) {
  const units = props.type === "dimension" ? DIMENSION_UNITS : WEIGHT_UNITS;
  const data = units.map((unit) => ({ label: unit, value: unit }));

  return (
    <View style={tw`w-full`}>
      <Dropdown
        style={[
          tw`h-[48px] rounded-sm rounded-l-none border px-3`,
          { backgroundColor: "#FAFAFA", borderColor: colors.inputBorder },
        ]}
        placeholderStyle={tw`text-sm font-sans-medium text-[#606C84]`}
        selectedTextStyle={tw`text-sm font-sans-medium text-[#0F172A]`}
        iconStyle={tw`w-5 h-5`}
        containerStyle={[
          tw`bg-white rounded-sm border overflow-hidden`,
          { borderColor: colors.inputBorder },
        ]}
        itemContainerStyle={tw`m-0 p-0`}
        data={data}
        search={false}
        maxHeight={120}
        labelField="label"
        valueField="value"
        placeholder="Select Unit"
        value={props.value}
        onChange={(item) => {
          (props.onChange as (u: string) => void)(item.value);
        }}
        renderItem={(item) => {
          const isSelected = item.value === props.value;
          return (
            <View
              style={[
                tw`p-4 flex-row justify-between items-center`,
                isSelected ? tw`bg-gray-100` : null,
              ]}
            >
              <Text
                style={[
                  tw`text-sm font-sans-medium`,
                  isSelected ? tw`text-[#0F172A]` : tw`text-[#606C84]`,
                ]}
              >
                {item.label}
              </Text>
              {isSelected && <Text style={tw`text-[#0F172A]`}>✓</Text>}
            </View>
          );
        }}
      />
    </View>
  );
}
