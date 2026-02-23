import { Pressable, Text, View } from "react-native";
import { colors } from "#config/colors.config";
import React, { useState } from "react";
import { Feather, Octicons } from "@expo/vector-icons";

import tw from "twrnc";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";

export default function Coverage() {
  const [expand, setExpand] = useState(false);

  const handleToggle = () => {
    setExpand(!expand);
  };

  return (
    <View style={tw`bg-white rounded-md px-4 border border-neutral-200`}>
      <Pressable onPress={handleToggle} style={tw`py-4 flex-row items-center`}>
        <Text style={tw`text-sm text-neutral-600 flex-1`}>
          Covered by the Omenai Guarantee
        </Text>

        <Feather
          name={expand ? "minus" : "plus"}
          size={20}
          style={tw`text-neutral-600`}
        />
      </Pressable>
      {expand && (
        <Animated.View
          entering={FadeInDown.duration(600).damping(300)} // Duration in milliseconds
          exiting={FadeOut.duration(500).damping(300)}
          style={tw`pb-[16px]`}
        >
          <View style={tw`h-[1px] w-full bg-neutral-200`} />

          <View style={tw`pt-4 gap-4`}>
            <View style={tw`flex-row gap-3 items-center`}>
              <Feather name="lock" size={16} style={tw`text-neutral-500`} />
              <Text style={tw`text-[13px] text-neutral-500`}>
                Secure Checkout
              </Text>
            </View>
            <View style={tw`flex-row gap-3 items-center`}>
              <Octicons
                name="verified"
                size={16}
                style={tw`text-neutral-500`}
              />
              <Text style={[tw`text-[13px] text-neutral-500`]}>
                Authenticity Guarantee
              </Text>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
