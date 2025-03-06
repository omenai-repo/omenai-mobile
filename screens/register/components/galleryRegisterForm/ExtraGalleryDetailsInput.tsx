import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useGalleryAuthRegisterStore } from "../../../../store/auth/register/GalleryAuthRegisterStore";
import NextButton from "../../../../components/buttons/NextButton";
import { validate } from "../../../../lib/validations/validatorGroup";
import Input from "../../../../components/inputs/Input";
import BackFormButton from "../../../../components/buttons/BackFormButton";
import LargeInput from "../../../../components/inputs/LargeInput";
import CustomSelectPicker from "components/inputs/CustomSelectPicker";
import { country_codes } from "json/country_alpha_2_codes";
import { debounce } from "lodash";

const transformedCountries = country_codes.map((item) => ({
  value: item.key,
  label: item.name,
}));

export default function ExtraGalleryDetailsInput() {
  const [formErrors, setFormErrors] = useState<Partial<GallerySignupData>>({
    admin: "",
    address: "",
    description: "",
    country: "",
  });

  const {
    pageIndex,
    setPageIndex,
    galleryRegisterData,
    setAdmin,
    setAddress,
    setCountry,
    setDescription,
  } = useGalleryAuthRegisterStore();

  const checkIsDisabled = () => {
    // Check if there are no error messages and all input fields are filled
    const isFormValid = Object.values(formErrors).every(
      (error) => error === ""
    );
    const areAllFieldsFilled = Object.values({
      admin: galleryRegisterData.admin,
      location: galleryRegisterData.address,
      description: galleryRegisterData.description,
      country: galleryRegisterData.country,
    }).every((value) => value !== "");

    return !(isFormValid && areAllFieldsFilled);
  };

  const handleValidationChecks = debounce(
    (label: string, value: string, confirm?: string) => {
      // Clear error if the input is empty
      if (value.trim() === "") {
        setFormErrors((prev) => ({ ...prev, [label]: "" }));
        return;
      }

      const { success, errors } = validate(value, label, confirm);
      setFormErrors((prev) => ({
        ...prev,
        [label]: errors.length > 0 ? errors[0] : "",
      }));
    },
    500
  ); // ✅ Delay validation by 500ms

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
        <CustomSelectPicker
          data={transformedCountries}
          placeholder="Select country of operation"
          value={galleryRegisterData.country}
          handleSetValue={setCountry}
          search={true}
          searchPlaceholder="Search country"
          label="Country of operation"
          dropdownPosition="top"
        />
        <Input
          label={`Gallery address`}
          keyboardType="default"
          onInputChange={(text) => {
            setAddress(text);
            handleValidationChecks("location", text);
          }}
          placeHolder="Enter gallery address"
          value={galleryRegisterData.address}
          errorMessage={formErrors.address}
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
