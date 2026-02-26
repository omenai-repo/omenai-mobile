import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import DimensionInput from "#components/forms/DimensionInput";

type ArtworkDimensionsErrorsType = {
  height: string;
  length: string;
  width: string;
  weight: string;
};

type CustomDimensionsInputProps = {
  usePreset: boolean;
  dimensions: {
    length: string;
    width: string;
    height: string;
    weight: string;
  };
  setDimensions: React.Dispatch<
    React.SetStateAction<{
      length: string;
      width: string;
      height: string;
      weight: string;
    }>
  >;
  formErrors: ArtworkDimensionsErrorsType;
  handleValidationChecks: (
    label: keyof ArtworkDimensionsErrorsType,
    value: string,
  ) => void;
};

export default function CustomDimensionsInput({
  usePreset,
  dimensions,
  setDimensions,
  formErrors,
  handleValidationChecks,
}: CustomDimensionsInputProps) {
  if (usePreset) return null;

  return (
    <View style={tw`gap-3 mt-4`}>
      <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
        Enter Custom Dimensions (inches / kg)
      </Text>
      {(["length", "width", "height"] as const).map((field) => (
        <DimensionInput
          key={field}
          field={field}
          unit="in"
          value={dimensions[field]}
          errorMessage={formErrors[field]}
          onInputChange={(text) =>
            setDimensions((prev) => ({ ...prev, [field]: text }))
          }
          onValidation={(text) => handleValidationChecks(field, text)}
        />
      ))}
      <DimensionInput
        field="weight"
        unit="kg"
        value={dimensions.weight}
        errorMessage={formErrors.weight}
        onInputChange={(text) =>
          setDimensions((prev) => ({ ...prev, weight: text }))
        }
        onValidation={(text) => handleValidationChecks("weight", text)}
      />
    </View>
  );
}
