import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { screenName } from "../../constants/screenNames.constants";
import { colors } from "../../config/colors.config";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { onboardingdata } from "#constants/onBoardingData.constants";
import OnBoardingSection from "./components/OnBoardingSection";
import { utils_storeAsyncData } from "#utils/utils_asyncStorage";
import { utils_determineOnboardingPages } from "#utils/utils_determineOnboardingPages";
import WithModal from "#components/modal/WithModal";

import tw from "twrnc";
import { StatusBar } from "expo-status-bar";
import TiltedGridBackground from "./components/TiltedGridBackground";
import {
  primaryGridImages,
  secondaryGridImages,
} from "#constants/images.constants";
import { useDevice } from "#hooks/useDevice";

export default function Welcome() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { isTablet } = useDevice();

  const [selected, setSelected] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    async function handleOnboardingCheck() {
      const isOnboarded = await utils_determineOnboardingPages();
      if (isOnboarded) setShowWelcome(true);
    }
    handleOnboardingCheck();
  }, []);

  const handleNavigation = (value: any) => {
    navigation.navigate(value);
  };

  if (!showWelcome) {
    return (
      <>
        <StatusBar style="light" />
        <OnBoardingSection
          data={onboardingdata[selected]}
          currentIndex={selected}
          onFinish={() => {
            setShowWelcome(true);
            utils_storeAsyncData("isOnboarded", JSON.stringify(true));
          }}
          handleNext={() => setSelected((prev) => prev + 1)}
        />
      </>
    );
  }

  return (
    <WithModal>
      <View style={[tw`flex-1`, { backgroundColor: colors.black }]}>
        <StatusBar style="light" />

        {/* Horizontal Animated Grid Background */}
        <TiltedGridBackground
          primaryImages={primaryGridImages}
          secondaryImages={secondaryGridImages}
          isActive={isFocused}
        />

        {/* Bottom content container */}
        <View
          style={[
            tw`rounded-6 py-8 px-8`,
            {
              backgroundColor: colors.primary_black,
              position: "absolute",
              bottom: insets.bottom + 20,
              left: isTablet ? undefined : 12,
              right: isTablet ? undefined : 12,
            },
            isTablet && {
              alignSelf: "center",
              width: "100%",
              maxWidth: 500,
            },
          ]}
        >
          <Text style={[tw`text-3xl text-white font-medium mb-1.5`]}>
            Build Your Art World
          </Text>

          <Text style={tw`text-sm text-[#FFFFFFB2]`}>
            Collect, discover, and follow artists shaping contemporary art.
          </Text>

          <View style={tw`gap-3 mt-6`}>
            <LongBlackButton
              value="Create Account"
              onClick={() => handleNavigation(screenName.register)}
              style={{ backgroundColor: colors.white, height: 48 }}
              textStyle={{
                color: colors.black,
                fontSize: 16,
                fontWeight: "600",
              }}
            />

            <LongBlackButton
              value="Log In"
              onClick={() => handleNavigation(screenName.login)}
              style={{ height: 48, backgroundColor: colors.black_light }}
              textStyle={{
                color: colors.white,
                fontSize: 16,
                fontWeight: "600",
              }}
            />
          </View>
        </View>
      </View>
    </WithModal>
  );
}
