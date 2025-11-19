import { StyleSheet, View } from "react-native";
import React from "react";
import { useGalleryAuthRegisterStore } from "../../../../store/auth/register/GalleryAuthRegisterStore";
import NextButton from "../../../../components/buttons/NextButton";
import Input from "../../../../components/inputs/Input";
import BackFormButton from "../../../../components/buttons/BackFormButton";
import LargeInput from "../../../../components/inputs/LargeInput";
import { useFormValidation } from "hooks/useFormValidation";

export default function ExtraGalleryDetailsInput() {
  const { pageIndex, setPageIndex, galleryRegisterData, setAdmin, setDescription } =
    useGalleryAuthRegisterStore();

  const { formErrors, handleValidationChecks, checkIsFormValid } =
    useFormValidation<Partial<GallerySignupData>>();

  const checkIsDisabled = () => {
    return !checkIsFormValid({
      admin: galleryRegisterData.admin,
      description: galleryRegisterData.description,
    });
  };

  return (
    <View style={{ gap: 40 }}>
      <View style={{ gap: 20 }}>
        <Input
          label={`Administrator’s Full Name`}
          keyboardType="default"
          onInputChange={(text) => {
            setAdmin(text);
            handleValidationChecks("admin", text);
          }}
          placeHolder="Enter your full name"
          value={galleryRegisterData.admin}
          errorMessage={formErrors.admin}
        />

        <LargeInput
          label={`Gallery Description`}
          onInputChange={(text) => {
            setDescription(text);
            handleValidationChecks("description", text);
          }}
          placeHolder="Write a description of your gallery (not more than 100 words)"
          value={galleryRegisterData.description}
          errorMessage={formErrors.description}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
        <View style={{ flex: 1 }} />
        <NextButton
          isDisabled={checkIsDisabled()}
          handleButtonClick={() => setPageIndex(pageIndex + 1)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});
