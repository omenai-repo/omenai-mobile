import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { colors } from "#config/colors.config";
import AuthHeader from "#components/auth/AuthHeader";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { screenName } from "#constants/screenNames.constants";

import { useIndividualAuthRegisterStore } from "#store/auth/register/IndividualAuthRegisterStore";
import { useGalleryAuthRegisterStore } from "#store/auth/register/GalleryAuthRegisterStore";
import { useArtistAuthRegisterStore } from "#store/auth/register/ArtistAuthRegisterStore";
import { useDevice } from "#hooks/useDevice";
import tw from "twrnc";
import InputForm from "./components/inputForm/InputForm";
import { useLowRiskFeatureFlag } from "#hooks/useFeatureFlag";

import FormSkeleton from "#components/skeleton/FormSkeleton";
import ScrollWrapper, {
  type ScrollWrapperRef,
} from "#components/general/ScrollWrapper";

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
  const [artistInviteValidated, setArtistInviteValidated] = useState(false);
  const { value: waitlistActivated, loading: isLoading } =
    useLowRiskFeatureFlag("waitlistActivated");

  const isGalleryWaitlist =
    selectedTabIndex === 2 && waitlistActivated && !galleryInviteValidated;

  const isArtistWaitlist =
    selectedTabIndex === 1 && waitlistActivated && !artistInviteValidated;

  const isWaitlist = isGalleryWaitlist || isArtistWaitlist;

  const headerTitle = isWaitlist ? "Join Waitlist" : "Create an account";
  const headerSubtitle = isWaitlist
    ? "We're building something special, and we want you to be part of it from day one."
    : "Fill in required details and create an account";

  const resetAll = () => {
    clearIndividualState();
    clearGalleryState();
    clearArtistState();
  };

  const scrollViewRef = useRef<ScrollWrapperRef>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollTo?.({ y: 0, animated: false });
  }, [collectorPage, galleryPage, artistPage]);

  const handleBack = () => {
    resetAll();
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate(screenName.welcome);
    }
  };

  return (
    <>
      <AuthHeader
        title={isLoading ? " " : headerTitle}
        subTitle={isLoading ? " " : headerSubtitle}
        handleBackClick={handleBack}
      />
      {isLoading ? (
        <FormSkeleton rows={5} />
      ) : (
        <View style={[tw`flex-1 bg-white`, isTablet && tw`items-center`]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={0}
            style={[
              styles.container,
              isTablet && { width: "100%", maxWidth: 650 },
            ]}
          >
            <ScrollWrapper
              ref={scrollViewRef}
              nestedScrollEnabled
              style={{ flexGrow: 1 }}
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}
              alwaysBounceVertical={false}
              overScrollMode="never"
              contentInsetAdjustmentBehavior="never"
            >
              <InputForm
                onTabChange={(index) => {
                  setSelectedTabIndex(index);
                  setGalleryInviteValidated(false);
                  setArtistInviteValidated(false);
                }}
                onGalleryInviteValidated={setGalleryInviteValidated}
                onArtistInviteValidated={setArtistInviteValidated}
              />
            </ScrollWrapper>
          </KeyboardAvoidingView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
});
