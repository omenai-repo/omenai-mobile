import { View, Text } from "react-native";
import Input from "#components/inputs/Input";
import DimensionUnitPicker from "#components/artwork/DimensionUnitPicker";
import tw from "twrnc";
import { colors } from "#config/colors.config";

export default function DimensionInputRow(props: DimensionInputRowProps) {
  const { label, value, placeholder, errorMessage, onChangeText } = props;

  return (
    <View style={tw`gap-1.5 w-full`}>
      <Text style={[tw`text-sm font-sans-regular`, { color: colors.grey }]}>
        {label}
      </Text>
      <View style={tw`flex-row items-start w-full`}>
        <View style={tw`flex-1`}>
          <Input
            label=""
            keyboardType="numeric"
            value={value}
            placeHolder={placeholder ?? "e.g. 24"}
            onInputChange={onChangeText}
            errorMessage={errorMessage}
            containerStyle={tw`w-full`}
            inputStyle={tw`rounded-r-none border-r-0 h-[48px]`}
          />
        </View>

        <View style={tw`w-[100px]`}>
          {props.type === "dimension" ? (
            <DimensionUnitPicker
              type="dimension"
              value={props.unit}
              onChange={props.onUnitChange}
            />
          ) : (
            <DimensionUnitPicker
              type="weight"
              value={props.unit}
              onChange={props.onUnitChange}
            />
          )}
        </View>
      </View>
    </View>
  );
}
