import { View, Animated, Easing, Image } from "react-native";
import React, { useEffect, useRef } from "react";
import tw from "twrnc";
import omenaiLogo from "../../assets/omenai-logo.png";

type AnimatedScreenContainerProps = {
  children: React.ReactNode;
};

export default function AnimatedScreenContainer({
  children,
}: Readonly<AnimatedScreenContainerProps>) {
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
            tw`bg-[#FFFFFF] rounded-md py-[35px] w-[80%]`,
            {
              opacity: fadeAnim, // Apply fade animation
              transform: [{ scale: scaleAnim }], // Apply scale animation
            },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </View>
  );
}
