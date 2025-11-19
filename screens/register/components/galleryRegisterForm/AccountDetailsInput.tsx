import { View } from \"react-native\";
import React from \"react\";
import { useGalleryAuthRegisterStore } from \"../../../../store/auth/register/GalleryAuthRegisterStore\";
import NextButton from \"../../../../components/buttons/NextButton\";
import Input from \"../../../../components/inputs/Input\";
import PasswordInput from \"../../../../components/inputs/PasswordInput\";
import { useFormValidation } from \"hooks/useFormValidation\";

export default function AccountDetailsInput() {
  const {
    pageIndex,
    setPageIndex,
    galleryRegisterData,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
  } = useGalleryAuthRegisterStore();

  const { formErrors, handleValidationChecks, checkIsFormValid } = useFormValidation<
    Partial<GallerySignupData>
  >();

  const checkIsDisabled = () => {
    return !checkIsFormValid({
      email: galleryRegisterData.email,
      name: galleryRegisterData.name,
      password: galleryRegisterData.password,
      confirmPassword: galleryRegisterData.confirmPassword,
    });
  };

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
