import { Pressable, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import Input from "#components/inputs/Input";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { useForgetPasswordStore } from "#store/auth/forgotPassword/forgotPasswordStore";
import { colors } from "#config/colors.config";
import tw from "twrnc";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";
import { validate } from "#lib/validations/validatorGroup";
import { sendPasswordResetLink } from "#services/password/sendPasswordResetLink";
import { useModalStore } from "#store/modal/modalStore";

export default function Form() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { email, setEmail, isLoading, setIsLoading } = useForgetPasswordStore();
  const { updateModal } = useModalStore();

  const [formErrors, setFormErrors] = useState({ email: "" });

  useEffect(() => {
    return () => {
      setEmail("");
    };
  }, [setEmail]);

  const handleSubmit = async () => {
    setIsLoading(true);
    const results = await sendPasswordResetLink({ email }, "individual");

    if (results?.isOk) {
      updateModal({
        message: results?.body.message,
        showModal: true,
        modalType: "success",
        onDismiss: () => navigation.navigate(screenName.login),
      });
    } else {
      updateModal({
        message: results?.body.message,
        showModal: true,
        modalType: "error",
      });
    }

    setIsLoading(false);
  };

  const checkIsDisabled = () => {
    // Check if there are no error messages and all input fields are filled
    const isFormValid = Object.values(formErrors).every(
      (error) => error === "",
    );
    const areAllFieldsFilled = Object.values({ email }).every(
      (value) => value !== "",
    );

    return !(isFormValid && areAllFieldsFilled);
  };

  const handleValidationChecks = (
    label: string,
    value: string,
    confirm?: string,
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
    <SafeAreaView style={tw`flex-1 px-5`}>
      <View style={tw`flex-1`}>
        <View style={tw`gap-5`}>
          <Input
            label="Email address"
            keyboardType="email-address"
            onInputChange={setEmail}
            placeHolder="Enter your email address"
            value={email}
            handleBlur={() => handleValidationChecks("email", email)}
            errorMessage={formErrors.email}
          />
          {email.length > 0 && (
            <Text style={tw`text-[#858585]`}>
              A verification link will be sent to example {email}
            </Text>
          )}
        </View>
        <View style={tw`mt-[60px]`}>
          <LongBlackButton
            value={isLoading ? "Loading..." : "Send verification link"}
            isLoading={isLoading}
            isDisabled={checkIsDisabled()}
            onClick={handleSubmit}
          />
        </View>
      </View>
      <View style={tw`mt-5`}>
        <Pressable onPress={() => navigation.navigate(screenName.register)}>
          <Text
            style={[tw`text-center text-base`, { color: colors.primary_black }]}
          >
            Don&apos;t have an account? Create one
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
