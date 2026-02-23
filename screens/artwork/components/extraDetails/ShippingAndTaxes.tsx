import { Pressable, Text, View } from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import tw from "twrnc";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";

export default function ShippingAndTaxes() {
  const [expand, setExpand] = useState(false);

  const handleToggle = () => {
    setExpand(!expand);
  };

  return (
    <View style={tw`bg-white rounded-md px-4 border border-neutral-200`}>
      <Pressable onPress={handleToggle} style={tw`py-4 flex-row items-center`}>
        <Text style={tw`text-sm text-neutral-600 flex-1`}>
          Shipping & taxes
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
          <View style={tw`gap-3 pt-4`}>
            <Text
              style={tw`border-l border-neutral-200 pl-3 text-[13px] flex-1 text-neutral-500`}
            >
              Shipping calculated at checkout.
            </Text>
            <Text
              style={tw`border-l border-neutral-200 pl-3 text-[13px] flex-1 text-neutral-500`}
            >
              Duties and taxes may apply.
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
