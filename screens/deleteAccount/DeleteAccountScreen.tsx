import React, { useState, useRef } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRoute } from "@react-navigation/native";
import tw from "twrnc";
import { StatusBar } from "expo-status-bar";

import ScrollWrapper from "components/general/ScrollWrapper";
import DeleteAccountHeader from "components/deleteAccount/DeleteAccountHeader";
import WhatHappensNextSection from "components/deleteAccount/WhatHappensNextSection";
import WhyLeavingSection from "components/deleteAccount/WhyLeavingSection";
import OtherMessageInput from "components/deleteAccount/OtherMessageInput";
import DeleteAccountActions from "components/deleteAccount/DeleteAccountActions";
import StatusBarBackground from "components/deleteAccount/StatusBarBackground";
import { PRIVACY_POLICY_URL } from "constants/deleteAccount.constants";

export default function DeleteAccountScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { routeName } = (route.params as { routeName?: string }) || {
    routeName: "individual",
  };

  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherMessage, setOtherMessage] = useState<string>("");
  const scrollY = useRef(new Animated.Value(0)).current;

  const statusBarOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const statusBarShadowOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 0.08],
    extrapolate: "clamp",
  });

  const statusBarElevation = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 3],
    extrapolate: "clamp",
  });

  const handleReasonSelect = (id: string) => {
    setSelectedReason(id);
    if (id !== "other") {
      setOtherMessage("");
    }
  };

  const handleContinueToDelete = () => {
    if (selectedReason) {
      // TODO: Call delete account service based on routeName
      // if (routeName === 'individual') {
      //   deleteIndividualAccount(selectedReason, otherMessage);
      // } else if (routeName === 'artist') {
      //   deleteArtistAccount(selectedReason, otherMessage);
      // } else if (routeName === 'gallery') {
      //   deleteGalleryAccount(selectedReason, otherMessage);
      // }
      console.log("Deleting account:", {
        routeName,
        selectedReason,
        otherMessage,
      });
      // Navigate back or to success screen after deletion
      navigation.goBack();
    }
  };

  const handlePrivacyPolicyPress = () => {
    Linking.openURL(PRIVACY_POLICY_URL);
  };

  const isContinueDisabled =
    !selectedReason || (selectedReason === "other" && !otherMessage.trim());

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-[#F7F7F7]`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <StatusBar style="dark" />
      <View style={tw`flex-1 bg-[#F7F7F7]`}>
        <StatusBarBackground
          insets={insets}
          opacity={statusBarOpacity}
          shadowOpacity={statusBarShadowOpacity}
          elevation={statusBarElevation}
        />
        <ScrollWrapper
          style={tw`flex-1`}
          contentContainerStyle={[tw`pb-4`]}
          keyboardShouldPersistTaps="handled"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: false,
            }
          )}
        >
          <View style={[tw`px-5`, { paddingTop: insets.top + 24 }]}>
            <DeleteAccountHeader />
            <WhatHappensNextSection
              onPrivacyPolicyPress={handlePrivacyPolicyPress}
            />
            <WhyLeavingSection
              selectedReason={selectedReason}
              onReasonSelect={handleReasonSelect}
            />
            {selectedReason === "other" && (
              <OtherMessageInput
                message={otherMessage}
                onMessageChange={setOtherMessage}
              />
            )}
          </View>
        </ScrollWrapper>

        <DeleteAccountActions
          onCancel={() => navigation.goBack()}
          onContinue={handleContinueToDelete}
          isContinueDisabled={isContinueDisabled}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

