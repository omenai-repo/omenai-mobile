import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import PasswordInput from '../../../../components/inputs/PasswordInput';
import Input from '../../../../components/inputs/Input';
import NextButton from '../../../../components/buttons/NextButton';
import { useIndividualAuthRegisterStore } from '../../../../store/auth/register/IndividualAuthRegisterStore';
import { validate } from '../../../../lib/validations/validatorGroup';
import { debounce } from 'lodash';

export default function AccountDetailsInput() {
  const {
    individualRegisterData,
    setEmail,
    setName,
    setPassword,
    setConfirmPassword,
    pageIndex,
    setPageIndex,
  } = useIndividualAuthRegisterStore();

  const [formErrors, setFormErrors] = useState<Omit<IndividualRegisterData, 'address' | 'phone'>>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const checkIsDisabled = () => {
    // Check if there are no error messages and all input fields are filled
    const isFormValid = Object.values(formErrors).every((error) => error === '');
    const areAllFieldsFilled = Object.values({
      email: individualRegisterData.email,
      name: individualRegisterData.name,
      password: individualRegisterData.password,
      confirmPassword: individualRegisterData.confirmPassword,
    }).every((value) => value !== '');

    return !(isFormValid && areAllFieldsFilled);
  };

  const handleValidationChecks = debounce((label: string, value: string, confirm?: string) => {
    // Clear error if the input is empty
    if (value.trim() === '') {
      setFormErrors((prev) => ({ ...prev, [label]: '' }));
      return;
    }

    const { success, errors } = validate(value, label, confirm);
    setFormErrors((prev) => ({
      ...prev,
      [label]: errors.length > 0 ? errors[0] : '',
    }));
  }, 500); // ✅ Delay validation by 500ms

  return (
    <View style={styles.container}>
      <View style={{ gap: 20 }}>
        <Input
          label="Full name"
          keyboardType="default"
          onInputChange={(text) => {
            setName(text);
            handleValidationChecks('name', text);
          }}
          placeHolder="Enter your full name"
          value={individualRegisterData.name}
          errorMessage={formErrors.name}
        />
        <Input
          label="Email address"
          keyboardType="email-address"
          onInputChange={(text) => {
            setEmail(text);
            handleValidationChecks('email', text);
          }}
          placeHolder="Enter your email address"
          value={individualRegisterData.email}
          errorMessage={formErrors.email}
        />
        <PasswordInput
          label="Password"
          onInputChange={(text) => {
            setPassword(text);
            handleValidationChecks('password', text); // ✅ Debounced validation
          }}
          placeHolder="Enter password"
          value={individualRegisterData.password}
          errorMessage={formErrors.password}
        />
        <PasswordInput
          label="Confirm password"
          onInputChange={(text) => {
            setConfirmPassword(text);
            handleValidationChecks('confirmPassword', individualRegisterData.password, text);
          }}
          placeHolder="Enter password again"
          value={individualRegisterData.confirmPassword}
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
  container: {
    gap: 40,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
});
