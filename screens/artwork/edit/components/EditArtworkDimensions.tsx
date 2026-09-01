import { View } from "react-native";
import React from "react";
import DimensionInputRow from "#components/artwork/DimensionInputRow";
import tw from "twrnc";
import FormSectionHeader from "#components/general/FormSectionHeader";

export type DimensionsFormState = {
  height: string;
  width: string;
  weight: string;
};

export type DimensionsErrorsState = {
  height: string;
  width: string;
  weight: string;
};

type EditArtworkDimensionsProps = Readonly<{
  dims: DimensionsFormState;
  errors: DimensionsErrorsState;
  dimUnit: DimensionUnit;
  weightUnit: WeightUnit;
  onFieldChange: (field: keyof DimensionsFormState, value: string) => void;
  onDimUnitChange: (unit: DimensionUnit) => void;
  onWeightUnitChange: (unit: WeightUnit) => void;
}>;

export default function EditArtworkDimensions({
  dims,
  errors,
  dimUnit,
  weightUnit,
  onFieldChange,
  onDimUnitChange,
  onWeightUnitChange,
}: EditArtworkDimensionsProps) {
  return (
    <View style={tw`bg-white rounded-sm border border-neutral-200 p-5`}>
      <FormSectionHeader title="Artwork Dimensions" style={tw`mb-5`} />

      <View style={tw`gap-5`}>
        <DimensionInputRow
          type="dimension"
          label="Height"
          value={dims.height}
          unit={dimUnit}
          placeholder="e.g. 24"
          errorMessage={errors.height}
          onChangeText={(val) => onFieldChange("height", val)}
          onUnitChange={onDimUnitChange}
        />

        <DimensionInputRow
          type="dimension"
          label="Width"
          value={dims.width}
          unit={dimUnit}
          placeholder="e.g. 36"
          errorMessage={errors.width}
          hideUnitSelector={true}
          onChangeText={(val) => onFieldChange("width", val)}
          onUnitChange={onDimUnitChange}
        />

        <DimensionInputRow
          type="weight"
          label="Weight"
          value={dims.weight}
          unit={weightUnit}
          placeholder="e.g. 5"
          errorMessage={errors.weight}
          onChangeText={(val) => onFieldChange("weight", val)}
          onUnitChange={onWeightUnitChange}
        />
      </View>
    </View>
  );
}
