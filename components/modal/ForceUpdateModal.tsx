import { Text, View, TouchableOpacity, Linking, Platform } from "react-native";
import Modal from "react-native-modal";
import React from "react";
import { colors } from "#config/colors.config";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";

type ForceUpdateModalProps = {
  isVisible: boolean;
};

export default function ForceUpdateModal({ isVisible }: ForceUpdateModalProps) {
  const handleUpdate = () => {
    const storeUrl =
      "https://play.google.com/store/apps/details?id=com.omenai.omenaiapp";
    Linking.openURL(storeUrl);
  };

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.4}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
      style={tw`m-0 justify-end`}
    >
      <View style={tw`bg-white rounded-t-[24px] p-6 pb-12`}>
        {/* App Update Icon */}
        <View
          style={tw`w-[80px] h-[80px] rounded-[40px] bg-[#F7F7F7] items-center justify-center mb-5 self-center`}
        >
          <MaterialIcons name="system-update" size={48} color={colors.black} />
        </View>

        {/* Title */}
        <Text
          style={[
            tw`text-xl font-semibold mb-2 text-center`,
            { color: colors.black },
          ]}
        >
          Update Required
        </Text>

        {/* Description */}
        <Text style={tw`text-sm text-[#666] text-center leading-5 mb-6`}>
          We've made some important improvements! Please update to the latest
          version to continue using the app.
        </Text>

        {/* Update Button */}
        <TouchableOpacity
          onPress={handleUpdate}
          style={[
            tw`w-full h-[52px] rounded-xl flex-row items-center justify-center gap-2`,
            { backgroundColor: colors.black },
          ]}
          activeOpacity={0.8}
        >
          <Text style={tw`text-white text-base font-medium`}>Update Now</Text>
          <MaterialIcons name="arrow-forward" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
