import { View, Text, Animated, Easing } from "react-native";
import React, { useEffect, useRef } from "react";
import tw from "twrnc";
import FittedBlackButton from "components/buttons/FittedBlackButton";

const FirstScreen = ({ onPress }: { onPress: () => void }) => {
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
    <View style={tw`flex-1 bg-[#F7F7F7] justify-center items-center`}>
      <Animated.View
        style={[
          tw`bg-[#FFFFFF] rounded-[20px] py-[35px]`,
          {
            marginHorizontal: "10%",
            opacity: fadeAnim, // Apply fade animation
            transform: [{ scale: scaleAnim }], // Apply scale animation
          },
        ]}
      >
        <Text
          style={tw`text-[16px] font-medium leading-[25px] text-[#000000] text-center mx-[40px]`}
        >
          To help us evaluate your skills and certification in art, please
          answer a few onboarding questions. This will ensure we properly assess
          your experience and expertise.
        </Text>
        <View style={tw`mt-[30px] mx-[30px]`}>
          <FittedBlackButton onClick={onPress} value="Proceed" />
        </View>
      </Animated.View>
    </View>
  );
};

export default FirstScreen;
