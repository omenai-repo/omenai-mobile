import React, { useEffect, useRef } from "react";
import { Animated, Text, View, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import tw from "twrnc";

type Props = {
  message?: string;
};

export default function SubscriptionBillingBlocker({
  message = "Our billing system is currently undergoing a crucial stability update. We're working quickly to finalize the changes and will be back online shortly.",
}: Props) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
        isInteraction: false,
      })
    ).start();

    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
        isInteraction: false,
      })
    ).start();
  }, [rotateAnim, spinAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const { width } = Dimensions.get("window");

  return (
    <View style={tw`flex-1 bg-[#0f172a] items-center justify-center p-6 flex-1`}>
      <View style={[tw`absolute inset-0`, { opacity: 0.04, backgroundColor: "transparent" }]} />
      <Animated.View
        style={[
          tw`absolute inset-0`,
          { backgroundColor: "rgba(42,158,223,0.03)", transform: [{ rotate }] },
        ]}
      />

      <View
        style={[
          tw`w-full items-center p-7 rounded-2xl border`,
          {
            maxWidth: 720,
            borderColor: "rgba(71,116,142,0.12)",
            backgroundColor: "rgba(15,23,42,0.9)",
          },
        ]}
      >
        <View style={tw`relative mb-3 items-center justify-center`}>
          <Animated.View
            style={[
              tw`w-24 h-24 items-center justify-center rounded-full`,
              { transform: [{ rotate }] },
            ]}
          >
            <Feather name="settings" size={48} color="#2A9EDF" />
          </Animated.View>

          <Animated.View
            style={[
              {
                position: "absolute",
                right: -6,
                bottom: -6,
                backgroundColor: "#0f172a",
                padding: 6,
                borderRadius: 20,
                transform: [{ rotate: spin }],
              },
            ]}
          >
            <Feather name="refresh-ccw" size={20} color="#2A9EDF" />
          </Animated.View>

          <View
            style={{
              position: "absolute",
              right: -18,
              bottom: -18,
              backgroundColor: "#0f172a",
              padding: 6,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "rgba(71,116,142,0.12)",
            }}
          >
            <Feather name="check-square" size={14} color="#161616" />
          </View>
        </View>

        <Text style={tw`mt-1 text-[10px] tracking-widest text-[#47748E] font-mono uppercase`}>
          Subscriptions and Billing
        </Text>

        <Text style={tw`mt-2 text-[20px] text-white font-bold text-center`}>
          Billing System <Text style={tw`text-[#2A9EDF]`}>Under Maintenance</Text>
        </Text>

        <Text
          style={[
            tw`mt-3 text-[#47748E] text-center text-base leading-6`,
            { maxWidth: Math.min(520, width - 80) },
          ]}
        >
          {message}
        </Text>

        <View
          style={[
            tw`mt-4`,
            {
              width: "100%",
              maxWidth: 360,
              height: 10,
              backgroundColor: "rgba(71,116,142,0.12)",
              borderRadius: 20,
              overflow: "hidden",
            },
          ]}
        >
          <View
            style={{ height: "100%", backgroundColor: "#2A9EDF", borderRadius: 20, width: "35%" }}
          />
        </View>

        <Text style={tw`mt-2 text-[12px] text-[#818181]`}>
          Working on a fix. Thank you for your patience.
        </Text>
      </View>
    </View>
  );
}
