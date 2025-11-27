import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, Animated, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "config/colors.config";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { screenName } from "constants/screenNames.constants";
import tw from "twrnc";

type OnboardingBlockerScreenProps = {
  readonly message?: string;
};

export default function OnboardingBlockerScreen({
  message,
}: OnboardingBlockerScreenProps) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handleExploreOmenai = async () => {
    const url = process.env.EXPO_PUBLIC_WEB_URL || "https://omenai.app";
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        return;
      }
    } catch {}
    navigation.navigate(screenName.welcome);
  };

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-5deg", "0deg", "5deg"],
  });

  return (
    <View style={tw`flex-1 justify-center px-5`}>
      <SafeAreaView />
      <View
        style={[
          tw`items-center rounded-3xl px-7 py-8`,
          {
            backgroundColor: colors.white,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
          },
        ]}
      >
        <Animated.View style={[tw`mb-6`, { transform: [{ rotate }] }]}>
          <View
            style={[
              tw`h-20 w-20 rounded-full items-center justify-center`,
              { backgroundColor: colors.primary_black },
            ]}
          >
            <Text style={tw`text-white text-[32px] font-semibold`}>i</Text>
          </View>
        </Animated.View>
        <Text style={tw`text-[22px] font-bold text-center mb-3`}>
          Registration is temporarily unavailable
        </Text>
        <Text
          style={[
            tw`text-[14px] text-center mb-4 leading-5`,
            { color: "#4B5563" },
          ]}
        >
          {message ||
            "We\u2019re fixing some issues right now. Please check back soon or explore other parts of the app and see what tickles your fancy."}
        </Text>
        <Text
          style={[
            tw`text-[14px] text-center mb-4 leading-5`,
            { color: "#4B5563" },
          ]}
        >
          Thank you for your patience ❤️
        </Text>
        <Pressable
          onPress={handleExploreOmenai}
          style={({ pressed }) => [
            tw`mt-2 self-stretch rounded-lg py-3 px-6 items-center`,
            { backgroundColor: colors.primary_black },
            pressed && tw`opacity-85`,
          ]}
        >
          <Text style={tw`text-white text-[15px] font-semibold`}>
            Explore Omenai
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
