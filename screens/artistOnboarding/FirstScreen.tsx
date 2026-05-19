import {
  View,
  Text,
  Animated,
  Easing,
  Image,
  useWindowDimensions,
  Pressable,
} from "react-native";
import React, { useEffect, useRef } from "react";
import tw from "twrnc";
import FittedBlackButton from "#components/buttons/FittedBlackButton";
import { images } from "#constants/images.constants";
import { logout } from "#utils/logout.utils";
import { FontAwesome6 } from "@expo/vector-icons";

const onboardingItems = [
  {
    icon: <FontAwesome6 name="briefcase" size={18} color="#3B82F6" />,
    text: "Your art style and background",
  },
  {
    icon: <FontAwesome6 name="graduation-cap" size={18} color="#10B981" />,
    text: "Your education and exhibitions",
  },
  {
    icon: <FontAwesome6 name="building-columns" size={18} color="#8B5CF6" />,
    text: "Museum collections featuring your work",
  },
  {
    icon: <FontAwesome6 name="file-lines" size={18} color="#EF4444" />,
    text: "Your CV and credentials",
  },
];

const FirstScreen = ({ onPress }: { onPress: () => void }) => {
  const { height, width } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Start opacity at 0
  const scaleAnim = useRef(new Animated.Value(0.95)).current; // Start scale slightly smaller

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, // Fade in
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1, // Scale up to normal
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <View
        style={tw.style(`flex-row items-center justify-between mx-[25px]`, {
          marginTop: height / 15,
        })}
      >
        <Image
          style={tw`w-[130px] h-[30px]`}
          resizeMode="contain"
          source={images.omenaiLogo}
        />
        <Pressable onPress={logout}>
          <Text style={tw`text-sm font-sans-medium text-slate-700`}>
            Logout
          </Text>
        </Pressable>
      </View>

      <View style={tw`flex-1 justify-center pb-20`}>
        <Animated.View
          style={[
            tw`bg-white rounded-sm py-8 px-6 border border-neutral-100 shadow-sm`,
            {
              marginHorizontal: width / 18,
              opacity: fadeAnim, // Apply fade animation
              transform: [{ scale: scaleAnim }], // Apply scale animation
            },
          ]}
        >
          <Text
            style={tw`text-xl font-sans-bold text-slate-800 mb-3 leading-tight`}
          >
            One last step before you begin...
          </Text>
          <Text
            style={tw`text-sm leading-5 font-sans-regular text-slate-600 mb-8`}
          >
            To ensure a high standard of artistry and credibility on our
            platform, we need to learn more about your artistic journey.
          </Text>

          <View style={tw`mb-8 gap-5`}>
            {onboardingItems.map((item, idx) => (
              <View key={idx} style={tw`flex-row items-center gap-3`}>
                <View
                  style={tw`w-8 h-8 items-center justify-center bg-slate-50 rounded-sm`}
                >
                  {item.icon}
                </View>
                <Text style={tw`text-sm font-sans-medium text-slate-700`}>
                  {item.text}
                </Text>
              </View>
            ))}
          </View>

          <Text
            style={tw`text-sm font-sans-regular leading-5 text-slate-500 mb-8`}
          >
            Once submitted, our team will review your information and verify
            your profile. After approval, you&apos;ll gain full access to
            showcase and sell your work to collectors worldwide.
          </Text>

          <FittedBlackButton
            onClick={onPress}
            value="Start onboarding process"
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default FirstScreen;
