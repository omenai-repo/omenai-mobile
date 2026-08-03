import { StyleSheet, View } from "react-native";
import React from "react";
import { useGalleryAuthRegisterStore } from "#store/auth/register/GalleryAuthRegisterStore";
import NextButton from "#components/buttons/NextButton";
import Input from "#components/inputs/Input";
import BackFormButton from "#components/buttons/BackFormButton";
import LargeInput from "#components/inputs/LargeInput";
import { useFormValidation } from "#hooks/useFormValidation";

export default function ExtraGalleryDetailsInput() {
  const {
    pageIndex,
    setPageIndex,
    galleryRegisterData,
    setAdmin,
    setDescription,
  } = useGalleryAuthRegisterStore();

  const { formErrors, touched, handleBlur, checkIsDisabled } =
    useFormValidation({
      admin: galleryRegisterData.admin,
      description: galleryRegisterData.description,
    });

  const isButtonDisabled = () => {
    return checkIsDisabled();
  };

  return (
    <View style={{ gap: 40 }}>
      <View style={{ gap: 20 }}>
        <Input
          label={`Administrator’s Full Name`}
          keyboardType="default"
          onInputChange={setAdmin}
          handleBlur={() => handleBlur("admin")}
          placeHolder="Enter your full name"
          value={galleryRegisterData.admin}
          errorMessage={touched.admin ? formErrors.admin : ""}
        />

        <LargeInput
          label={`Gallery Description`}
          onInputChange={setDescription}
          handleBlur={() => handleBlur("description")}
          placeHolder="Write a description of your gallery (not more than 100 words)"
          value={galleryRegisterData.description}
          errorMessage={touched.description ? formErrors.description : ""}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
        <View style={{ flex: 1 }} />
        <NextButton
          isDisabled={isButtonDisabled()}
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
