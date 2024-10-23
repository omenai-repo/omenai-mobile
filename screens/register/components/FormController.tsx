import { KeyboardAvoidingView, Platform, StyleSheet, ScrollView } from "react-native";
import React from "react";
import InputForm from "./inputForm/InputForm";
import Preferences from "./preferences/Preferences";
import TermsAndConditions from "./TermsAndConditions/TermsAndConditions";
import { useIndividualAuthRegisterStore } from "../../../store/auth/register/IndividualAuthRegisterStore";
// import ScrollWrapper from "components/general/ScrollWrapper";

export default function FormController() {
  const { pageIndex } = useIndividualAuthRegisterStore();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView nestedScrollEnabled={true} style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        {pageIndex === 0 && <InputForm />}
        {pageIndex === 1 && <Preferences />}
        {pageIndex === 2 && <TermsAndConditions />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
