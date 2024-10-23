import {
  Image,
  StyleSheet,
  Text,
  View,
  Platform,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";

import omenai_logo from "../../assets/omenai-logo.png";
import welcome_banner from "../../assets/images/welcome-banner.png";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { colors } from "../../config/colors.config";
import LongBlackButton from "../../components/buttons/LongBlackButton";
import LongWhiteButton from "../../components/buttons/LongWhiteButton";
import { screenName } from "../../constants/screenNames.constants";
import { onboardingdata } from "constants/onBoardingData.constants";
import OnBoardingSection from "./components/OnBoardingSection";
import { utils_storeAsyncData } from "utils/utils_asyncStorage";
import { utils_determineOnboardingPages } from "utils/utils_determineOnboardingPages";
import ScrollWrapper from "components/general/ScrollWrapper";
import tw from "twrnc";

export default function Welcome() {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const [selected, setSelected] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    async function handleOnboardingCheck() {
      const isOnboarded = await utils_determineOnboardingPages();

      if (isOnboarded) {
        setShowWelcome(true);
      }
    }

    handleOnboardingCheck();
  }, []);

  const handleNavigation = (value: any) => {
    navigation.navigate(value);
  };

  if (!showWelcome)
    return (
      <OnBoardingSection
        data={onboardingdata[selected]}
        currentIndex={selected}
        onFinish={() => {
          setShowWelcome(true);
          utils_storeAsyncData("isOnboarded", JSON.stringify(true));
        }}
        handleNext={() => setSelected((prev) => prev + 1)}
      />
    );

  return (
    <View style={tw`flex-1 bg-[#ffff]`}>
      <ScrollWrapper
        showsVerticalScrollIndicator={false}
        style={styles.container}
      >
        <View
          style={{
            marginTop: Platform.OS === "android" ? height / 13 : height / 10,
          }}
        >
          <Image
            source={omenai_logo}
            style={{
              width: width / 3,
              height: height / 40,
              alignSelf: "center",
            }}
          />
          <Image
            source={welcome_banner}
            style={{
              width: width / 1.13,
              height: height / 2.8,
              alignSelf: "center",
              marginTop: height / 45,
            }}
          />
          <Text style={styles.largeText}>
            Get the best art deals anywhere, any time
          </Text>
        </View>
        <View style={{ flex: 1, paddingTop: 50, marginHorizontal: 20 }}>
          <View style={styles.buttonContainer}>
            <LongBlackButton
              value="Log In"
              onClick={() => handleNavigation(screenName.login)}
              isDisabled={false}
            />
            <LongWhiteButton
              value="Sign Up"
              onClick={() => handleNavigation(screenName.register)}
            />
          </View>
        </View>
      </ScrollWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 50,
  },
  welcomeBanner: {
    width: "100%",
    objectFit: "contain",
    height: 350,
    marginTop: 10,
  },
  largeText: {
    fontSize: 38,
    fontWeight: "500",
    lineHeight: 54,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    // marginTop: 50,
    gap: 15,
  },
  logo: {
    // width: 150,
  },
});
