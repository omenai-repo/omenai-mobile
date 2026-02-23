import { Text, View, Pressable } from "react-native";
import React from "react";
import { colors } from "#config/colors.config";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";
import { SafeAreaView } from "react-native-safe-area-context";

type NotificationProps = {
  title: string;
  message: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  iconBg: string;
  onDismiss: () => void;
};

export const ToastView = ({
  title,
  message,
  iconName,
  iconColor,
  iconBg,
  onDismiss,
}: NotificationProps) => (
  <SafeAreaView edges={["top"]} style={tw`w-full`}>
    <View
      style={tw`mx-5 mt-2 bg-[${colors.white}] p-4 rounded-md shadow-lg flex-row items-center gap-3 border border-gray-100`}
    >
      <View
        style={[
          tw`w-10 h-10 rounded-full items-center justify-center`,
          { backgroundColor: iconBg },
        ]}
      >
        <MaterialIcons name={iconName} color={iconColor} size={24} />
      </View>
      <View style={tw`flex-1`}>
        <Text style={tw`text-base font-bold text-[${colors.primary_black}]`}>
          {title}
        </Text>
        <Text style={tw`text-xs text-[${colors.black_light}] leading-4`}>
          {message}
        </Text>
      </View>
      <Pressable onPress={onDismiss} style={tw`p-2`}>
        <MaterialIcons name="close" size={20} color={colors.grey} />
      </Pressable>
    </View>
  </SafeAreaView>
);
