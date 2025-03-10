import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import NextButton from "../../../../components/buttons/NextButton";
import { validate } from "../../../../lib/validations/validatorGroup";
import Input from "../../../../components/inputs/Input";
import PasswordInput from "../../../../components/inputs/PasswordInput";
import { useArtistAuthRegisterStore } from "store/auth/register/ArtistAuthRegisterStore";
import { debounce } from "lodash";

const AccountDetailsInput = () => {
  const [formErrors, setFormErrors] = useState<Partial<ArtistSignupData>>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {
    pageIndex,
    setPageIndex,
    artistRegisterData,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
  } = useArtistAuthRegisterStore();

  const checkIsDisabled = () => {
    // Check if there are no error messages and all input fields are filled
    const isFormValid = Object.values(formErrors).every(
      (error) => error === ""
    );
    const areAllFieldsFilled = Object.values({
      email: artistRegisterData.email,
      name: artistRegisterData.name,
      password: artistRegisterData.password,
      confirmPassword: artistRegisterData.confirmPassword,
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
          label="Artist Name"
          keyboardType="default"
          onInputChange={(text) => {
            setName(text);
            handleValidationChecks("name", text);
          }}
          placeHolder="Enter your full name"
          value={artistRegisterData.name}
          errorMessage={formErrors.name}
        />
        <Input
          label={`Artist email address`}
          keyboardType="email-address"
          onInputChange={(text) => {
            setEmail(text);
            handleValidationChecks("email", text);
          }}
          placeHolder={`Enter your email address`}
          value={artistRegisterData.email}
          errorMessage={formErrors.email}
        />
        <PasswordInput
          label="Password"
          onInputChange={(text) => {
            setPassword(text);
            handleValidationChecks("password", text);
          }}
          placeHolder="Enter password"
          value={artistRegisterData.password}
          errorMessage={formErrors.password}
        />
        <PasswordInput
          label="Confirm password"
          onInputChange={(text) => {
            setConfirmPassword(text);
            handleValidationChecks(
              "confirmPassword",
              artistRegisterData.password,
              text
            );
          }}
          placeHolder="Enter password again"
          value={artistRegisterData.confirmPassword}
          errorMessage={formErrors.confirmPassword}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <View style={{ flex: 1 }} />
        <NextButton
          isDisabled={checkIsDisabled()}
          handleButtonClick={() => setPageIndex(pageIndex + 1)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});

export default AccountDetailsInput;
