import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Platform,
  useWindowDimensions,
  Pressable,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { screenName } from '../../constants/screenNames.constants';
import { onboardingdata } from 'constants/onBoardingData.constants';
import OnBoardingSection from './components/OnBoardingSection';
import { utils_storeAsyncData } from 'utils/utils_asyncStorage';
import { utils_determineOnboardingPages } from 'utils/utils_determineOnboardingPages';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import tw from 'twrnc';

const AnimatedImage = Animated.createAnimatedComponent(ImageBackground);

export default function Welcome() {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const [selected, setSelected] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const imageWidth = width * 1.5; // Wider image for horizontal movement
  const translateX = useSharedValue(0);

  useEffect(() => {
    // Animate from 0 to negative offset then reverse
    translateX.value = withRepeat(
      withTiming(-imageWidth + width, {
        duration: 10000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, []);

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

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
      <OnBoardingSection
        data={onboardingdata[selected]}
        currentIndex={selected}
        onFinish={() => {
          setShowWelcome(true);
          utils_storeAsyncData('isOnboarded', JSON.stringify(true));
        }}
        handleNext={() => setSelected((prev) => prev + 1)}
      />
    );
  }

  return (
    <View style={tw`flex-1`}>
      {/* Animated full-screen artwork */}
      <AnimatedImage
        source={require('../../assets/images/get.jpeg')}
        resizeMode="cover"
        style={[
          {
            width: imageWidth,
            height,
            position: 'absolute',
            left: 0,
            top: 0,
          },
          animatedImageStyle,
        ]}
      />

      {/* Bottom content container */}
      <View
        style={tw.style(`bg-[#1A1A1A] rounded-[20px]`, {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 40 : 20,
          left: 10,
          right: 10,
        })}
      >
        <Text
          style={tw.style(`text-[32px] text-[#FFFFFF] font-medium text-center`, {
            paddingHorizontal: Platform.OS === 'ios' ? width / 8 : width / 10,
            paddingTop: Platform.OS === 'ios' ? height / 15 : height / 20,
          })}
        >
          Find every artwork you desire here
        </Text>

        <Text style={tw`text-[15px] text-[#FFFFFFB2] text-center pt-[25px]`}>
          Buy, Trade, Discover
        </Text>
        <Text style={tw`text-[15px] text-[#FFFFFFB2] text-center px-[10px]`}>
          and experience art like the louvre with a single tap.
        </Text>

        <Pressable
          style={tw.style(
            `rounded-[100px] bg-[#FFFFFF] h-[56px] justify-center items-center self-center`,
            {
              width: width / 1.2,
              marginTop: height / 20,
            },
          )}
          onPress={() => handleNavigation(screenName.login)}
        >
          <Text style={tw`text-[#1A1A1A] text-[16px]`}>Log In</Text>
        </Pressable>

        <Pressable
          style={tw.style(
            `rounded-[100px] border-[2px] border-[#FFFFFF] h-[56px] justify-center items-center self-center`,
            {
              width: width / 1.2,
              marginTop: height / 35,
              marginBottom: height / 15,
            },
          )}
          onPress={() => handleNavigation(screenName.register)}
        >
          <Text style={tw`text-[#FFFFFF] text-[16px]`}>Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
}
