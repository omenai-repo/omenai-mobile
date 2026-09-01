import { View } from "react-native";
import Input from "#components/inputs/Input";
import DimensionUnitPicker from "#components/artwork/DimensionUnitPicker";
import tw from "twrnc";

export default function DimensionInputRow(props: DimensionInputRowProps) {
  const { label, value, placeholder, errorMessage, onChangeText } = props;

  return (
    <View style={tw`gap-1.5`}>
      {!props.hideUnitSelector && (
        <View style={tw`mb-1`}>
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
      )}

      <Input
        label={`${label} (${props.unit})`}
        keyboardType="numeric"
        value={value}
        placeHolder={placeholder ?? "e.g. 24"}
        onInputChange={onChangeText}
        errorMessage={errorMessage}
        containerStyle={tw`w-full`}
      />
    </View>
  );
}
