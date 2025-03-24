import { View, Text, Animated, useWindowDimensions, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';
import tw from 'twrnc';
import { Image } from 'react-native';
import omenaiLogo from '../../assets/omenai-logo.png';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import { SvgXml } from 'react-native-svg';
import { starEffect } from 'utils/SvgImages';

const SuccessComp = ({ onPress }: { onPress: () => void }) => {
  const { height } = useWindowDimensions();
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
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <Image
        style={tw.style(`w-[130px] h-[30px] ml-[20px]`, {
          marginTop: height / 12,
        })}
        resizeMode="contain"
        source={omenaiLogo}
      />
      <View
        style={tw.style({
          marginTop: height / 5,
        })}
      >
        <Animated.View
          style={[
            tw`bg-[#FFFFFF] rounded-[20px] py-[35px]`,
            {
              marginHorizontal: '5%',
              opacity: fadeAnim, // Apply fade animation
              transform: [{ scale: scaleAnim }], // Apply scale animation
            },
          ]}
        >
          <View style={tw`flex-row self-center gap-[20px]`}>
            <SvgXml xml={starEffect} style={{ transform: [{ scaleX: -1 }] }} />
            <Text style={tw`text-[18px] text-[#1A1A1A] font-bold`}>Congratulations</Text>
            <SvgXml xml={starEffect} />
          </View>

          <Text style={tw`text-[16px] leading-[25px] text-[#00000099] text-center mx-[40px]`}>
            please wait your details are currently being computed and this process might take up to
            48 hours, in the main time, you will have partial acess to the dashboard for now, until
            you are completely verified.
          </Text>
          <View style={tw`mt-[30px] mx-[30px]`}>
            <FittedBlackButton onClick={onPress} value="Proceed to Home" />
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

export default SuccessComp;
