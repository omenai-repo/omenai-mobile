import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useGalleryAuthRegisterStore } from "../../../../store/auth/register/GalleryAuthRegisterStore";
import NextButton from "../../../../components/buttons/NextButton";
import { validate } from "../../../../lib/validations/validatorGroup";
import Input from "../../../../components/inputs/Input";
import PasswordInput from "../../../../components/inputs/PasswordInput";
import { debounce } from "lodash";

export default function AccountDetailsInput() {
  const [formErrors, setFormErrors] = useState<Partial<GallerySignupData>>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {
    pageIndex,
    setPageIndex,
    galleryRegisterData,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
  } = useGalleryAuthRegisterStore();

  const checkIsDisabled = () => {
    // Check if there are no error messages and all input fields are filled
    const isFormValid = Object.values(formErrors).every(
      (error) => error === ""
    );
    const areAllFieldsFilled = Object.values({
      email: galleryRegisterData.email,
      name: galleryRegisterData.name,
      password: galleryRegisterData.password,
      confirmPassword: galleryRegisterData.confirmPassword,
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
          label="Gallery Name"
          keyboardType="default"
          onInputChange={(text) => {
            setName(text);
            handleValidationChecks("name", text);
          }}
          placeHolder="Enter the name of your gallery"
          value={galleryRegisterData.name}
          errorMessage={formErrors.name}
        />
        <Input
          label={`Gallery's email address`}
          keyboardType="email-address"
          onInputChange={(text) => {
            setEmail(text);
            handleValidationChecks("email", text);
          }}
          placeHolder={`Enter your gallery's email address`}
          value={galleryRegisterData.email}
          errorMessage={formErrors.email}
        />
        <PasswordInput
          label="Password"
          onInputChange={(text) => {
            setPassword(text);
            handleValidationChecks("password", text);
          }}
          placeHolder="Enter password"
          value={galleryRegisterData.password}
          errorMessage={formErrors.password}
        />
        <PasswordInput
          label="Confirm password"
          onInputChange={(text) => {
            setConfirmPassword(text);
            handleValidationChecks(
              "confirmPassword",
              galleryRegisterData.password,
              text
            );
          }}
          placeHolder="Enter password again"
          value={galleryRegisterData.confirmPassword}
          errorMessage={formErrors.confirmPassword}
        />
      </View>
      <View style={styles.buttonsContainer}>
        {/* <BackFormButton handleBackClick={() => console.log('')} /> */}
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
