import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { colors } from "../../config/colors.config";
import AuthHeader from "../../components/auth/AuthHeader";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { screenName } from "../../constants/screenNames.constants";
import WithModal from "components/modal/WithModal";
import { useIndividualAuthRegisterStore } from "store/auth/register/IndividualAuthRegisterStore";
import { useGalleryAuthRegisterStore } from "store/auth/register/GalleryAuthRegisterStore";
import { useArtistAuthRegisterStore } from "store/auth/register/ArtistAuthRegisterStore";
import InputForm from "./components/inputForm/InputForm";

type RootStackParamList = {
  [screenName.welcome]: undefined;
  [screenName.register]: undefined;
};

export default function Register() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { clearState: clearIndividualState, pageIndex: collectorPage } =
    useIndividualAuthRegisterStore();
  const { clearState: clearGalleryState, pageIndex: galleryPage } = useGalleryAuthRegisterStore();
  const { clearState: clearArtistState, pageIndex: artistPage } = useArtistAuthRegisterStore();

  const resetAll = () => {
    clearIndividualState();
    clearGalleryState();
    clearArtistState();
  };

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollTo?.({ y: 0, animated: false });
  }, [collectorPage, galleryPage, artistPage]);

  return (
    <WithModal>
      <AuthHeader
        title="Create an account"
        subTitle="Fill in required details and create an account"
        handleBackClick={() => {
          resetAll();
          navigation.navigate(screenName.welcome);
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollViewRef}
            nestedScrollEnabled
            style={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <InputForm />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
});
