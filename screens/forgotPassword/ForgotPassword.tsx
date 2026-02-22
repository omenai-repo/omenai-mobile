import { KeyboardAvoidingView, Platform, View } from "react-native";
import React from "react";
import AuthHeader from "../../components/auth/AuthHeader";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../constants/screenNames.constants";
import Form from "./components/form/Form";
import tw from "twrnc";

import ScrollWrapper from "#components/general/ScrollWrapper";

export default function ForgotPassword() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <View style={tw`flex-1 bg-white`}>
      <AuthHeader
        title="Forgot Password?"
        subTitle="Provide the details required and reset your password"
        handleBackClick={() => navigation.navigate(screenName.login)}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1 bg-white`}
      >
        <ScrollWrapper style={tw`flex-1 bg-white`}>
          <Form />
        </ScrollWrapper>
      </KeyboardAvoidingView>
    </View>
  );
}
