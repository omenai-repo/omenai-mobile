import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useState } from "react";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { uploadArtworkStore } from "#store/artwork/uploadArtworkStore";
import { validateOrderMeasurement } from "#lib/validation/artwork/validateOrderMeasurement";
import DimensionInputRow from "#components/artwork/DimensionInputRow";
import {
  stripUnit,
  toCanonicalDimensionString,
  toCanonicalWeightString,
} from "#utils/artwork/utils_artworkUnits";
import tw from "twrnc";

type DimensionErrors = {
  length: string;
  height: string;
  width: string;
  weight: string;
};

function runValidation(value: string): string {
  if (value.trim() === "") return "";
  const errors = validateOrderMeasurement(value);
  return errors.length === 0 ? "" : errors[0];
}

export default function ArtworkDimensions() {
  const {
    setActiveIndex,
    activeIndex,
    updateArtworkUploadData,
    artworkUploadData,
  } = uploadArtworkStore();

  const [dimUnit, setDimUnit] = useState<DimensionUnit>(
    artworkUploadData.length?.includes("cm") ? "cm" : "in",
  );
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(
    artworkUploadData.weight?.includes("kg") ? "kg" : "lbs",
  );

  const [dimensions, setDimensions] = useState({
    length: stripUnit(artworkUploadData.length),
    height: stripUnit(artworkUploadData.height),
    width: stripUnit(artworkUploadData.width),
    weight: stripUnit(artworkUploadData.weight),
  });

  const [formErrors, setFormErrors] = useState<DimensionErrors>({
    length: "",
    height: "",
    width: "",
    weight: "",
  });

  const setField = (field: keyof typeof dimensions) => (text: string) => {
    setDimensions((prev) => ({ ...prev, [field]: text }));
    setFormErrors((prev) => ({ ...prev, [field]: runValidation(text) }));
  };

  const handleDimUnitChange = (unit: DimensionUnit) => {
    setDimUnit(unit);
    setFormErrors({
      length: "",
      height: "",
      width: "",
      weight: "",
    });
  };

  const isDisabled =
    !Object.values(formErrors).every((e) => e === "") ||
    dimensions.length === "" ||
    dimensions.height === "" ||
    dimensions.width === "";

  const handleProceed = () => {
    updateArtworkUploadData(
      "length",
      dimensions.length
        ? toCanonicalDimensionString(Number(dimensions.length), dimUnit)
        : "",
    );
    updateArtworkUploadData(
      "height",
      dimensions.height
        ? toCanonicalDimensionString(Number(dimensions.height), dimUnit)
        : "",
    );
    updateArtworkUploadData(
      "weight",
      dimensions.weight
        ? toCanonicalWeightString(Number(dimensions.weight), weightUnit)
        : "",
    );
    updateArtworkUploadData(
      "width",
      dimensions.width
        ? toCanonicalDimensionString(Number(dimensions.width), dimUnit)
        : "",
    );

    setActiveIndex(activeIndex + 1);
  };

  return (
    <View style={tw`flex-1`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
      >
        <ScrollView
          nestedScrollEnabled
          style={tw`flex-1`}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={tw`gap-5 mb-4`}>
            <DimensionInputRow
              type="dimension"
              label="Length"
              value={dimensions.length}
              unit={dimUnit}
              placeholder="e.g. 24"
              errorMessage={formErrors.length}
              onChangeText={setField("length")}
              onUnitChange={handleDimUnitChange}
            />

            <DimensionInputRow
              type="dimension"
              label="Height"
              value={dimensions.height}
              unit={dimUnit}
              placeholder="e.g. 24"
              errorMessage={formErrors.height}
              onChangeText={setField("height")}
              onUnitChange={handleDimUnitChange}
            />

            <DimensionInputRow
              type="dimension"
              label="Width"
              value={dimensions.width}
              unit={dimUnit}
              placeholder="e.g. 24"
              errorMessage={formErrors.width}
              hideUnitSelector={true}
              onChangeText={setField("width")}
              onUnitChange={handleDimUnitChange}
            />

            <DimensionInputRow
              type="weight"
              label="Weight"
              value={dimensions.weight}
              unit={weightUnit}
              placeholder="e.g. 5"
              errorMessage={formErrors.weight}
              onChangeText={setField("weight")}
              onUnitChange={setWeightUnit}
            />
          </View>

          <View style={tw`mt-15 mb-[150px]`}>
            <LongBlackButton
              value="Proceed"
              onClick={handleProceed}
              isLoading={false}
              isDisabled={isDisabled}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
