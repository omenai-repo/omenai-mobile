import { Pressable, Text, View } from "react-native";
import {
  DIMENSION_UNITS,
  WEIGHT_UNITS,
} from "#utils/artwork/utils_artworkUnits";
import tw from "twrnc";

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

  return (
    <View
      style={tw`flex-row rounded-sm border border-[#E8ECF4] bg-[#FAFAFA] p-1`}
    >
      {units.map((unit) => {
        const isSelected = props.value === unit;
        return (
          <Pressable
            key={unit}
            style={[
              tw`flex-1 items-center justify-center rounded-sm px-2 py-2.5`,
              isSelected && tw`bg-[#0F172A]`,
            ]}
            onPress={() => (props.onChange as (u: string) => void)(unit)}
          >
            <Text
              style={[
                tw`font-sans-medium text-sm`,
                isSelected ? tw`text-white` : tw`text-[#606C84]`,
              ]}
            >
              {unit}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
