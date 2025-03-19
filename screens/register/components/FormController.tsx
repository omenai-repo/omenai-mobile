import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React from "react";
import InputForm from "./inputForm/InputForm";
import Preferences from "./preferences/Preferences";
import TermsAndConditions from "./TermsAndConditions/TermsAndConditions";
import { useIndividualAuthRegisterStore } from "../../../store/auth/register/IndividualAuthRegisterStore";
import IndividualAddressVerification from "./inputForm/individual/IndividualAddressVerification";
// import ScrollWrapper from "components/general/ScrollWrapper";

export default function FormController() {
  const { pageIndex } = useIndividualAuthRegisterStore();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          nestedScrollEnabled={true}
          style={{ flexGrow: 1, paddingHorizontal: 20, marginTop: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* {pageIndex === 0 && <InputForm />} */}
          {pageIndex === 0 && <IndividualAddressVerification />}
          {/* {pageIndex === 2 && <Preferences />} */}
          {/* {pageIndex === 3 && <TermsAndConditions />} */}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
