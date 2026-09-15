import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import LongBlackButton from "#components/buttons/LongBlackButton";
import AnimatedScreenContainer from "#components/animations/AnimatedScreenContainer";

const EligibityResponseScreen = ({
  label,
  daysLeft,
  onPress,
}: {
  label: string;
  daysLeft?: number;
  onPress: () => void;
}) => {
  return (
    <AnimatedScreenContainer>
      <Text
        style={tw`text-[18px] text-[#1A1A1A]00099] leading-[20px] text-center mx-[40px]`}
      >
        {label}
      </Text>
      {daysLeft && (
        <Text
          style={tw`text-[24px] text-[#1A1A1A]000] font-bold leading-[20px] text-center pt-[20px]`}
        >
          {daysLeft} days
        </Text>
      )}

      <View style={tw`mt-[30px] mx-[40px]`}>
        <LongBlackButton value="Go Back" onClick={onPress} />
      </View>
    </AnimatedScreenContainer>
  );
};

export default EligibityResponseScreen;
