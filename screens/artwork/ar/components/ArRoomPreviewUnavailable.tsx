import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "twrnc";
import { getArUnavailableMessage } from "#utils/hooks/isArEnvironmentSupported";

type Props = {
  onClose: () => void;
};

export default function ArRoomPreviewUnavailable({ onClose }: Readonly<Props>) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[tw`flex-1 bg-black`, { paddingTop: insets.top }]}>
      <Pressable
        onPress={onClose}
        style={tw`absolute right-4 z-10 w-11 h-11 rounded-full bg-white/10 items-center justify-center`}
        hitSlop={8}
      >
        <Ionicons name="close" size={24} color="#fff" />
      </Pressable>

      <View style={tw`flex-1 items-center justify-center px-8`}>
        <View
          style={tw`w-20 h-20 rounded-full bg-white/10 items-center justify-center mb-6`}
        >
          <Ionicons name="cube-outline" size={36} color="#fff" />
        </View>
        <Text style={tw`text-xl font-semibold text-white text-center mb-3`}>
          AR preview unavailable
        </Text>
        <Text style={tw`text-sm text-white/70 text-center leading-relaxed`}>
          {getArUnavailableMessage()}
        </Text>
      </View>
    </View>
  );
}
