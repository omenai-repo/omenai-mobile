import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import tw from "twrnc";

interface SectionHeaderProps {
  subtitle: string;
  title: string;
  onActionPress?: () => void;
  dark?: boolean;
}

export default function SectionHeader({
  subtitle,
  title,
  onActionPress,
  dark = false,
}: Readonly<SectionHeaderProps>) {
  const subtitleColor = dark ? "#a3a3a3" : "#858585";
  const redDotColor = "#E44C3F";

  const pingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(pingAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ).start();
  }, [pingAnim]);

  const scale = pingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.5],
  });

  const opacity = pingAnim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0.5, 0, 0],
  });

  return (
    <View style={tw`flex-row items-center justify-between px-5`}>
      <View style={tw`flex-1 mr-4`}>
        <View style={tw`flex-row items-center mb-1`}>
          <View style={tw`w-3 h-3 justify-center items-center mr-1`}>
            {/* Animated outer circle */}
            <Animated.View
              style={[
                tw`absolute w-1.5 h-1.5 rounded-full`,
                {
                  backgroundColor: redDotColor,
                  opacity: opacity,
                  transform: [{ scale: scale }],
                },
              ]}
            />
            {/* Static inner circle */}
            <View
              style={[
                tw`w-1.5 h-1.5 rounded-full`,
                { backgroundColor: redDotColor },
              ]}
            />
          </View>
          <Text
            style={[
              tw`text-[8px] uppercase tracking-widest font-sans-regular`,
              { color: subtitleColor },
            ]}
          >
            {subtitle}
          </Text>
        </View>
        <Text
          style={tw`text-lg font-serif ${
            dark ? "text-white" : "text-gray-800"
          }`}
        >
          {title}
        </Text>
      </View>

      {onActionPress && (
        <TouchableOpacity
          style={tw`flex-row items-center gap-1 mb-1`}
          onPress={onActionPress}
        >
          <Feather name="arrow-right" size={14} color={subtitleColor} />
        </TouchableOpacity>
      )}
    </View>
  );
}
