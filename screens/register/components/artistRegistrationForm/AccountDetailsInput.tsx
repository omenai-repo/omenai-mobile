import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import NextButton from "../../../../components/buttons/NextButton";
import { validate } from "../../../../lib/validations/validatorGroup";
import Input from "../../../../components/inputs/Input";
import PasswordInput from "../../../../components/inputs/PasswordInput";
import { useArtistAuthRegisterStore } from "store/auth/register/ArtistAuthRegisterStore";

const AccountDetailsInput = () => {
  const [formErrors, setFormErrors] = useState<Partial<GallerySignupData>>({
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

  const handleValidationChecks = (
    label: string,
    value: string,
    confirm?: string
  ) => {
    const { success, errors }: { success: boolean; errors: string[] | [] } =
      validate(value, label, confirm);
    if (!success) {
      setFormErrors((prev) => ({ ...prev, [label]: errors[0] }));
    } else {
      setFormErrors((prev) => ({ ...prev, [label]: "" }));
    }
  };

  return (
    <View style={{ gap: 40 }}>
      <View style={{ gap: 20 }}>
        <Input
          label="Artist Name"
          keyboardType="default"
          onInputChange={setName}
          placeHolder="Enter your full name"
          value={artistRegisterData.name}
          handleBlur={() =>
            handleValidationChecks("name", artistRegisterData.name)
          }
          errorMessage={formErrors.name}
        />
        <Input
          label={`Artist email address`}
          keyboardType="email-address"
          onInputChange={setEmail}
          placeHolder={`Enter your email address`}
          value={artistRegisterData.email}
          handleBlur={() =>
            handleValidationChecks("email", artistRegisterData.email)
          }
          errorMessage={formErrors.email}
        />
        <PasswordInput
          label="Password"
          onInputChange={setPassword}
          placeHolder="Enter password"
          value={artistRegisterData.password}
          handleBlur={() =>
            handleValidationChecks("password", artistRegisterData.password)
          }
          errorMessage={formErrors.password}
        />
        <PasswordInput
          label="Confirm password"
          onInputChange={setConfirmPassword}
          placeHolder="Enter password again"
          value={artistRegisterData.confirmPassword}
          handleBlur={() =>
            handleValidationChecks(
              "confirmPassword",
              artistRegisterData.password,
              artistRegisterData.confirmPassword
            )
          }
          errorMessage={formErrors.confirmPassword}
        />
      </View>
      <View style={styles.buttonsContainer}>
        {/* <BackFormButton handleBackClick={() => console.log('')} /> */}
        <View style={{ flex: 1 }} />
        <NextButton
          // isDisabled={checkIsDisabled()}
          isDisabled={false}
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
