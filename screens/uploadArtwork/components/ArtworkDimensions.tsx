import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "config/colors.config";
import Input from "components/inputs/Input";
import LongBlackButton from "components/buttons/LongBlackButton";
import { uploadArtworkStore } from "store/gallery/uploadArtworkStore";
import NoLabelInput from "components/inputs/NoLabelInput";
import { validate } from "lib/validations/upload_artwork_input_validator/validator";
import tw from 'twrnc';

type artworkDimensionsErrorsType = {
  height: string;
  depth: string;
  width: string;
  weight: string;
};

export default function ArtworkDimensions() {
  const {
    setActiveIndex,
    activeIndex,
    artworkUploadData,
    updateArtworkUploadData,
  } = uploadArtworkStore();

  const [formErrors, setFormErrors] = useState<artworkDimensionsErrorsType>({
    weight: "",
    depth: "",
    height: "",
    width: "",
  });

  const checkIsDisabled = () => {
    // Check if there are no error messages and all input fields are filled
    const isFormValid = Object.values({
      weight: formErrors.weight,
      height: formErrors.height,
      width: formErrors.width,
    }).every((error) => error === "");
    const areAllFieldsFilled = Object.values({
      weight: artworkUploadData.weight,
      height: artworkUploadData.height,
      width: artworkUploadData.width,
    }).every((value) => value !== "");

    return !(isFormValid && areAllFieldsFilled);
  };

  const handleValidationChecks = (label: string, value: string) => {
    const { success, errors }: { success: boolean; errors: string[] | [] } =
      validate(label, value);
    if (!success) {
      setFormErrors((prev) => ({ ...prev, [label]: errors[0] }));
    } else {
      setFormErrors((prev) => ({ ...prev, [label]: "" }));
    }
  };

  useEffect(() => {
    if (artworkUploadData.height) {
      handleValidationChecks("height", artworkUploadData.height);
    }
  }, [artworkUploadData.height]);

  useEffect(() => {
    if (artworkUploadData.width) {
      handleValidationChecks("width", artworkUploadData.width);
    }
  }, [artworkUploadData.width]);

  useEffect(() => {
    if (artworkUploadData.depth) {
      handleValidationChecks("depth", artworkUploadData.depth || "");
    }
  }, [artworkUploadData.depth]);

  useEffect(() => {
    if (artworkUploadData.weight) {
      handleValidationChecks("weight", artworkUploadData.weight);
    }
  }, [artworkUploadData.weight]);

  return (
    <View style={styles.container}>
      <View style={styles.inputsContainer}>
        <View>
          <Text style={styles.label}>Dimensions (e.g 20cm)</Text>
          <View style={styles.flexInputsContainer}>
            <NoLabelInput
              placeHolder="Height"
              onInputChange={(value) => {
                updateArtworkUploadData("height", value);
                handleValidationChecks("height", artworkUploadData.height);
              }}
              value={artworkUploadData.height}
              errorMessage={formErrors.height}
            />
            <NoLabelInput
              placeHolder="Width"
              onInputChange={(value) => {
                updateArtworkUploadData("width", value);
                handleValidationChecks("width", artworkUploadData.width);
              }}
              value={artworkUploadData.width}
              errorMessage={formErrors.width}
            />
            <NoLabelInput
              placeHolder="Depth"
              onInputChange={(value) => {
                updateArtworkUploadData("depth", value)
                handleValidationChecks("depth", artworkUploadData.depth);
              }}
              value={artworkUploadData.depth || ""}
              errorMessage={formErrors.depth}
            />
          </View>

          {/* Displaying only one error in the dimentions inputs */}
          {(formErrors.depth && 
            <Text style={tw`text-red-700 mt-2`}>{formErrors.depth}</Text>) ||
          (formErrors.width && 
            <Text style={tw`text-red-700 mt-2`}>{formErrors.width}</Text>) ||
          (formErrors.height && 
            <Text style={tw`text-red-700 mt-2`}>{formErrors.height}</Text>)
          }

        </View>
        <Input
          label="Weight (in Kg)"
          onInputChange={(value) => {
            updateArtworkUploadData("weight", value);
            handleValidationChecks("weight", artworkUploadData.weight);
          }}
          placeHolder="Enter weight of artwork"
          value={artworkUploadData.weight}
          errorMessage={formErrors.weight}
        />
      </View>
      <LongBlackButton
        value="Proceed"
        onClick={() => setActiveIndex(activeIndex + 1)}
        isLoading={false}
        isDisabled={checkIsDisabled()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
  },
  inputsContainer: {
    gap: 20,
    marginBottom: 50,
  },
  flexInputsContainer: {
    flexDirection: "row",
    gap: 20,
  },
  label: {
    fontSize: 14,
    color: colors.inputLabel,
  },
});
