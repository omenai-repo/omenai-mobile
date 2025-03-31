import { View, Text, Animated, Easing, Image } from 'react-native';
import React, { useEffect, useRef } from 'react';
import tw from 'twrnc';
import LottieView from 'lottie-react-native';
import loaderAnimation from '../../assets/other/loader-animation.json';
import omenaiLogo from '../../assets/omenai-logo.png';

const LoadingContainer = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Start opacity at 0
  const scaleAnim = useRef(new Animated.Value(0.5)).current; // Start scale at 0.5

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, // Fade in
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1, // Scale up to normal
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={tw`flex-1 bg-[#F7F7F7] `}>
      <Image
        style={tw`w-[117px] h-[19px] ml-[25px] mt-[80px]`}
        resizeMode="contain"
        source={omenaiLogo}
      />
      <View style={tw`flex-1 justify-center items-center mb-[100px]`}>
        <Animated.View
          style={[
            tw`bg-[#FFFFFF] rounded-[20px] py-[35px]`,
            {
              marginHorizontal: '10%',
              opacity: fadeAnim, // Apply fade animation
              transform: [{ scale: scaleAnim }], // Apply scale animation
            },
          ]}
        >
          <LottieView
            autoPlay
            style={{ width: 200, height: 100, alignSelf: 'center' }}
            source={loaderAnimation}
          />

          <Text style={tw`text-[20px] text-[#000000] font-bold text-center mx-[20px] mt-[10px]`}>
            Please wait a moment
          </Text>

          <Text style={tw`text-[16px] text-[#00000099] text-center mx-[40px] mt-[10px]`}>
            This process might take up to minutes, as we’re trying to compile all your onboarding
            data.
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

export default LoadingContainer;
