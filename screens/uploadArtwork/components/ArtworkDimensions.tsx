import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Input from "#components/inputs/Input";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { uploadArtworkStore } from "#store/gallery/uploadArtworkStore";
import tw from "twrnc";
import { validateOrderMeasurement } from "#lib/validations/upload_artwork_input_validator/validateOrderMeasurement";
import PackagingTypeSelector from "./PackagingTypeSelector";

type ArtworkDimensionsErrorsType = {
  length: string;
  height: string;
  weight: string;
};

type PackagingType = "rolled" | "stretched";

export default function ArtworkDimensions() {
  const {
    setActiveIndex,
    activeIndex,
    updateArtworkUploadData,
    artworkUploadData,
  } = uploadArtworkStore();

  const [packagingType, setPackagingType] = useState<PackagingType>(
    (artworkUploadData.packaging_type as PackagingType) || "rolled",
  );

  const [dimensions, setDimensions] = useState({
    length: "",
    height: "",
    weight: "",
  });

  const [formErrors, setFormErrors] = useState<ArtworkDimensionsErrorsType>({
    length: "",
    height: "",
    weight: "",
  });

  const checkIsDisabled = () => {
    const isFormValid = Object.values(formErrors).every(
      (error) => error === "",
    );
    const areAllFieldsFilled = Object.values(dimensions).every(
      (value) => value !== "",
    );
    return !(isFormValid && areAllFieldsFilled);
  };

  const handleValidationChecks = (
    label: keyof ArtworkDimensionsErrorsType,
    value: string,
  ) => {
    if (value.trim() === "") {
      setFormErrors((prev) => ({ ...prev, [label]: "" }));
    } else {
      const errors = validateOrderMeasurement(value);
      setFormErrors((prev) => ({
        ...prev,
        [label]: errors.length === 0 ? "" : errors,
      }));
    }
  };

  useEffect(() => {
    if (dimensions.length) {
      handleValidationChecks("length", dimensions.length);
    }
  }, [dimensions.length]);

  useEffect(() => {
    if (dimensions.height) {
      handleValidationChecks("height", dimensions.height);
    }
  }, [dimensions.height]);

  useEffect(() => {
    if (dimensions.weight) {
      handleValidationChecks("weight", dimensions.weight);
    }
  }, [dimensions.weight]);

  const handleProceed = () => {
    // Store values with units
    updateArtworkUploadData("length", `${dimensions.length}in`);
    updateArtworkUploadData("height", `${dimensions.height}in`);
    updateArtworkUploadData("weight", `${dimensions.weight}kg`);
    updateArtworkUploadData("packaging_type", packagingType);

    setActiveIndex(activeIndex + 1);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
      >
        <ScrollView
          nestedScrollEnabled={true}
          style={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <PackagingTypeSelector
            value={packagingType}
            onChange={setPackagingType}
          />

          <View style={tw`mb-4`}>
            <Text style={tw`text-sm font-medium text-gray-700`}>
              Artwork Dimensions
            </Text>
            <Text style={tw`text-xs text-gray-500 mt-1`}>
              Enter measurements in inches. Weight in kilograms.
            </Text>
          </View>

          <View style={tw`gap-[10px]`}>
            <View>
              <Input
                label="Length (in)"
                keyboardType="numeric"
                onInputChange={(text) => {
                  setDimensions((prev) => ({ ...prev, length: text }));
                  handleValidationChecks("length", text);
                }}
                placeHolder="e.g 24"
                value={dimensions.length}
                errorMessage={formErrors.length}
              />
            </View>

            <View>
              <Input
                label="Height (in)"
                keyboardType="numeric"
                onInputChange={(text) => {
                  setDimensions((prev) => ({ ...prev, height: text }));
                  handleValidationChecks("height", text);
                }}
                placeHolder="e.g 24"
                value={dimensions.height}
                errorMessage={formErrors.height}
              />
            </View>

            <View>
              <Input
                label="Weight (kg)"
                keyboardType="numeric"
                onInputChange={(text) => {
                  setDimensions((prev) => ({ ...prev, weight: text }));
                  handleValidationChecks("weight", text);
                }}
                placeHolder="e.g 10"
                value={dimensions.weight}
                errorMessage={formErrors.weight}
              />
            </View>
          </View>

          <View style={tw`mt-[60px] mb-[150px]`}>
            <LongBlackButton
              value="Proceed"
              onClick={handleProceed}
              isLoading={false}
              isDisabled={checkIsDisabled()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
