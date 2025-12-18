import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { colors } from "../../config/colors.config";
import AuthHeader from "../../components/auth/AuthHeader";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { screenName } from "../../constants/screenNames.constants";
import WithModal from "#components/modal/WithModal";
import { useIndividualAuthRegisterStore } from "#store/auth/register/IndividualAuthRegisterStore";
import { useGalleryAuthRegisterStore } from "#store/auth/register/GalleryAuthRegisterStore";
import { useArtistAuthRegisterStore } from "#store/auth/register/ArtistAuthRegisterStore";
import { useDevice } from "#hooks/useDevice";
import tw from "twrnc";
import InputForm from "./components/inputForm/InputForm";
import { useLowRiskFeatureFlag } from "#hooks/useFeatureFlag";

type RootStackParamList = {
  [screenName.welcome]: undefined;
  [screenName.register]: undefined;
};

export default function Register() {
  const { isTablet } = useDevice();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { clearState: clearIndividualState, pageIndex: collectorPage } =
    useIndividualAuthRegisterStore();
  const { clearState: clearGalleryState, pageIndex: galleryPage } =
    useGalleryAuthRegisterStore();
  const { clearState: clearArtistState, pageIndex: artistPage } =
    useArtistAuthRegisterStore();

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [galleryInviteValidated, setGalleryInviteValidated] = useState(false);
  const { value: waitlistActivated } =
    useLowRiskFeatureFlag("waitlistActivated");

  // Show waitlist header only if: gallery tab + waitlist active + NOT validated
  const isGalleryWaitlist =
    selectedTabIndex === 2 && waitlistActivated && !galleryInviteValidated;

  const headerTitle = isGalleryWaitlist ? "Join Waitlist" : "Create an account";
  const headerSubtitle = isGalleryWaitlist
    ? "We're building something special, and we want you to be part of it from day one."
    : "Fill in required details and create an account";

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
        title={headerTitle}
        subTitle={headerSubtitle}
        handleBackClick={() => {
          resetAll();
          navigation.navigate(screenName.welcome);
        }}
      />
      <View style={[tw`flex-1 bg-white`, isTablet && tw`items-center`]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
          style={[
            styles.container,
            isTablet && { width: "100%", maxWidth: 650 },
          ]}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              ref={scrollViewRef}
              nestedScrollEnabled
              style={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <InputForm
                onTabChange={setSelectedTabIndex}
                onInviteValidated={setGalleryInviteValidated}
              />
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
});
