import React, { useState, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Input from "#components/inputs/Input";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { useForgetPasswordStore } from "#store/auth/forgotPassword/forgotPasswordStore";
import { colors } from "#config/colors.config";
import tw from "twrnc";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";
import { validate } from "#lib/validation/validatorGroup";
import { sendPasswordResetLink } from "#services/auth/sendPasswordResetLink";
import { useModalStore } from "#store/account/modal/modalStore";

export default function Form() {
  const { updateModal } = useModalStore();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { email, setEmail, isLoading, setIsLoading } = useForgetPasswordStore();

  const [touched, setTouched] = useState({ email: false });

  const emailValidation = validate(email, "email");
  const emailError = emailValidation.success ? "" : emailValidation.errors[0];

  useEffect(() => {
    return () => {
      setEmail("");
    };
  }, [setEmail]);

  const handleSubmit = async () => {
    setTouched({ email: true });
    if (!emailValidation.success) return;

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

  return (
    <>
      <View style={tw`flex-1 px-5 pt-8`}>
        <View style={tw`gap-5`}>
          <Input
            label="Email address"
            keyboardType="email-address"
            onInputChange={setEmail}
            handleBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            placeHolder="Enter your email address"
            value={email}
            errorMessage={touched.email ? emailError : ""}
          />
        </View>
        <View style={tw`mt-16`}>
          <LongBlackButton
            value={isLoading ? "Loading..." : "Send verification link"}
            isLoading={isLoading}
            isDisabled={!emailValidation.success}
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
    </>
  );
}
