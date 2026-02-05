import { Keyboard, Platform, View } from "react-native";
import React, { useEffect, useState } from "react";
import NextButton from "../../../../components/buttons/NextButton";
import Input from "../../../../components/inputs/Input";
import PasswordInput from "../../../../components/inputs/PasswordInput";
import { useArtistAuthRegisterStore } from "#store/auth/register/ArtistAuthRegisterStore";
import tw from "twrnc";
import { useFormValidation } from "#hooks/useFormValidation";

const AccountDetailsInput = () => {
  const {
    pageIndex,
    setPageIndex,
    artistRegisterData,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
  } = useArtistAuthRegisterStore();

  const { formErrors, handleValidationChecks, checkIsDisabled } =
    useFormValidation({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS === "android") return;
    const showSub = Keyboard.addListener("keyboardWillShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const isButtonDisabled = () => {
    return checkIsDisabled({
      name: artistRegisterData.name,
      email: artistRegisterData.email,
      password: artistRegisterData.password,
      confirmPassword: artistRegisterData.confirmPassword,
    });
  };

  return (
    <View style={tw`gap-10`}>
      <View style={tw`gap-5`}>
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
          textContentType="newPassword"
        />
        <PasswordInput
          label="Confirm password"
          onInputChange={(text) => {
            setConfirmPassword(text);
            handleValidationChecks(
              "confirmPassword",
              artistRegisterData.password,
              text,
            );
          }}
          placeHolder="Enter password again"
          value={artistRegisterData.confirmPassword}
          errorMessage={formErrors.confirmPassword}
          textContentType="newPassword"
        />
      </View>
      <View style={tw`flex-row gap-2.5 justify-end`}>
        <NextButton
          isDisabled={isButtonDisabled()}
          handleButtonClick={() => setPageIndex(pageIndex + 1)}
        />
      </View>

      <View style={{ height: keyboardHeight }} />
    </View>
  );
};

export default AccountDetailsInput;
