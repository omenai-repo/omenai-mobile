import {
  Image,
  Text,
  View,
  Platform,
  useWindowDimensions,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";

import omenai_logo from "../../assets/omenai-logo.png";
import onboarding3 from "../../assets/images/onboarding3.jpg";
import onboarding4 from "../../assets/images/onboarding4.jpg";
import onboarding5 from "../../assets/images/onboarding5.jpg";
import onboarding6 from "../../assets/images/onboarding6.jpg";
import onboarding7 from "../../assets/images/onboarding7.jpg";
import onboarding8 from "../../assets/images/onboarding8.jpg";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { screenName } from "../../constants/screenNames.constants";
import { onboardingdata } from "constants/onBoardingData.constants";
import OnBoardingSection from "./components/OnBoardingSection";
import { utils_storeAsyncData } from "utils/utils_asyncStorage";
import { utils_determineOnboardingPages } from "utils/utils_determineOnboardingPages";
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
    <View style={tw`flex-1 bg-[#FFFFFF]`}>
      <View>
        <View style={tw`flex-row justify-between`}>
          <View style={tw`mt-[70px] android:mt-[20px]`}>
            <Image
              source={omenai_logo}
              style={{
                width: width / 3,
                height: height / 40,
                alignSelf: "center",
                marginBottom: Platform.OS === "ios" ? 25 : 20,
              }}
            />
            <Image
              source={onboarding8}
              style={{
                width: width / 2.1,
                height: Platform.OS === "ios" ? 190 : 160,
              }}
              resizeMode="contain"
            />
          </View>
          <Image
            source={onboarding7}
            style={{
              width: width / 2.1,
              height: 274,
              marginTop: Platform.OS === "ios" ? 35 : -40,
            }}
            resizeMode="contain"
          />
        </View>
        <View style={tw`flex-row justify-between`}>
          <View>
            <Image
              source={onboarding3}
              style={{
                width: width / 2.14,
                height: Platform.OS === "ios" ? 190 : 160,
                marginTop: Platform.OS === "ios" ? 20 : 10,
              }}
              resizeMode="contain"
            />
            <Image
              source={onboarding5}
              style={{
                width: width / 3.2,
                height: Platform.OS === "ios" ? 190 : 160,
                marginTop: 20,
              }}
              resizeMode="contain"
            />
          </View>
          <View>
            <Image
              source={onboarding4}
              style={{
                width: width / 2.14,
                height: Platform.OS === "ios" ? 274 : 220,
              }}
              resizeMode="contain"
            />
            <Image
              source={onboarding6}
              style={{
                width: width / 2.14,
                height: Platform.OS === "ios" ? 190 : 140,
                marginTop: Platform.OS === "ios" ? 0 : 20,
              }}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
      <View
        style={tw.style(`bg-[#1A1A1A] rounded-[20px]`, {
          position: "absolute",
          bottom: Platform.OS === "ios" ? 40 : 20,
          left: 10,
          right: 10,
        })}
      >
        <Text
          style={tw.style(
            `text-[32px] text-[#FFFFFF] font-medium text-center`,
            {
              paddingHorizontal: Platform.OS === "ios" ? width / 8 : width / 10,
              paddingTop: Platform.OS === "ios" ? height / 15 : height / 20,
            }
          )}
        >
          Find every artwork you desire here
        </Text>

        <Text
          style={tw.style(`text-[15px] text-[#FFFFFFB2] text-center pt-[25px]`)}
        >
          Buy, Trade, Discover
        </Text>
        <Text
          style={tw.style(`text-[15px] text-[#FFFFFFB2] text-center px-[10px]`)}
        >
          and experience art like the louvre with a single tap.
        </Text>

        <Pressable
          style={tw.style(
            `rounded-[100px] bg-[#FFFFFF] h-[56px] justify-center items-center self-center`,
            {
              width: width / 1.2,
              marginTop: height / 20,
            }
          )}
          onPress={() => handleNavigation(screenName.login)}
        >
          <Text style={tw`text-[#000000] text-[16px]`}>Log In</Text>
        </Pressable>

        <Pressable
          style={tw.style(
            `rounded-[100px] border-[2px] border-[#FFFFFF] h-[56px] justify-center items-center self-center`,
            {
              width: width / 1.2,
              marginTop: height / 35,
              marginBottom: height / 15,
            }
          )}
          onPress={() => handleNavigation(screenName.register)}
        >
          <Text style={tw`text-[#FFFFFF] text-[16px]`}>Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
}
