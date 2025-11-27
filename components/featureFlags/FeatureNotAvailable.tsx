import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

import FittedBlackButton from "../buttons/FittedBlackButton";

type FeatureNotAvailableProps = {
  readonly onGoBack?: () => void;
};

export default function FeatureNotAvailable({
  onGoBack,
}: FeatureNotAvailableProps) {
  return (
    <View style={tw`flex-1 items-center justify-center px-8 mt-5`}>
      <View
        style={tw`items-center p-8 bg-white rounded-2xl shadow-xl w-full max-w-sm`}
      >
        <Text style={tw`text-2xl font-extrabold text-black mb-2 text-center`}>
          Coming Soon!
        </Text>
        <Text style={tw`text-base text-gray-600 text-center mb-6`}>
          We&apos;re busy polishing this feature to make it awesome. It&apos;ll
          be available for you really soon!
        </Text>
        <Text style={tw`text-sm text-gray-400 italic text-center mb-8`}>
          Thanks for your patience.
        </Text>
      </View>
      {onGoBack && (
        <FittedBlackButton
          value="Take Me Back"
          onClick={onGoBack}
          style={tw`mt-8 w-full max-w-sm`}
          textStyle={tw`font-bold text-lg`}
        />
      )}
    </View>
  );
}
