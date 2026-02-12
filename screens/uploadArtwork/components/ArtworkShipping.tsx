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

type PackagingType = "rolled" | "stretched";

export default function ArtworkShipping() {
  const {
    setActiveIndex,
    activeIndex,
    updateArtworkUploadData,
    artworkUploadData,
  } = uploadArtworkStore();

  const [packagingType, setPackagingType] = useState<PackagingType>(
    (artworkUploadData.packaging_type as PackagingType) || "rolled",
  );

  const [weight, setWeight] = useState(artworkUploadData.weight || "");
  const [weightError, setWeightError] = useState("");

  const handleValidationChecks = (value: string) => {
    if (value.trim() === "") {
      setWeightError("");
    } else {
      const errors = validateOrderMeasurement(value);
      setWeightError(typeof errors === "string" ? errors : errors[0] || "");
    }
  };

  useEffect(() => {
    if (weight) {
      handleValidationChecks(weight);
    }
  }, [weight]);

  const checkIsDisabled = () => {
    return weightError !== "" || weight === "";
  };

  const handleProceed = () => {
    updateArtworkUploadData("weight", `${weight}kg`);
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
          <View style={tw`mb-4`}>
            <Text style={tw`text-sm font-medium text-gray-700`}>
              Shipping Configuration
            </Text>
            <Text style={tw`text-xs text-gray-500 mt-1`}>
              Specify how this artwork will be packaged and its weight.
            </Text>
          </View>

          <PackagingTypeSelector
            value={packagingType}
            onChange={setPackagingType}
          />

          <View style={tw`mt-4`}>
            <Input
              label="Weight (kg)"
              keyboardType="numeric"
              onInputChange={(text) => {
                setWeight(text);
                handleValidationChecks(text);
              }}
              placeHolder="e.g 10"
              value={weight}
              errorMessage={weightError}
            />
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
