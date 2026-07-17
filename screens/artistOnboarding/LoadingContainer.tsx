import { Text } from "react-native";
import React from "react";
import tw from "twrnc";
import LottieView from "lottie-react-native";
import { animations } from "#constants/animations.constants";
import AnimatedScreenContainer from "#components/animations/AnimatedScreenContainer";

const LoadingContainer = ({ label }: { label: string }) => {
  return (
    <AnimatedScreenContainer>
      <LottieView
        autoPlay
        style={{ width: 200, height: 100, alignSelf: "center" }}
        source={animations.loader}
      />

      <Text
        style={tw`text-[20px] text-[#1A1A1A]000] font-bold text-center mx-[20px] mt-[10px]`}
      >
        Please wait a moment
      </Text>

      <Text
        style={tw`text-[16px] text-[#1A1A1A]00099] text-center mx-[40px] mt-[10px]`}
      >
        {label}
      </Text>
    </AnimatedScreenContainer>
  );
};

export default LoadingContainer;
