import React, { useEffect } from "react";
import { View, TouchableOpacity, Keyboard, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useAnimatedKeyboard,
} from "react-native-reanimated";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { useSupport } from "../../providers/SupportProvider";
import { useMobileSupportDefaulter } from "../../hooks/useMobileSupportDefaulter";
import SupportForm from "./SupportForm";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SupportWidget() {
  const { isOpen, openSupport, closeSupport } = useSupport();
  const insets = useSafeAreaInsets();
  const { height } = Dimensions.get("window");
  const keyboard = useAnimatedKeyboard();

  const animatedStyle = useAnimatedStyle(() => ({
    paddingBottom: keyboard.height.value,
  }));

  const defaults = useMobileSupportDefaulter();

  useEffect(() => {
    if (!isOpen) {
      Keyboard.dismiss();
    }
  }, [isOpen]);

  return (
    <>
      <TouchableOpacity
        onPress={openSupport}
        style={[
          tw`absolute z-50 rounded-full items-center justify-center shadow-lg bg-black`,
          {
            bottom: insets.bottom + 80,
            right: 20,
            width: 56,
            height: 56,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
          },
        ]}
      >
        <Ionicons name="sparkles-sharp" size={28} color="white" />
      </TouchableOpacity>

      <Modal
        isVisible={isOpen}
        onBackdropPress={closeSupport}
        onSwipeComplete={closeSupport}
        swipeDirection="down"
        style={tw`m-0 justify-end`}
        propagateSwipe={true}
      >
        <View
          style={[
            tw`bg-white rounded-t-3xl overflow-hidden`,
            { height: height * 0.85, paddingBottom: insets.bottom },
          ]}
        >
          <View style={tw`items-center py-4 bg-white w-full`}>
            <View style={tw`w-12 h-1.5 bg-gray-300 rounded-full`} />
          </View>
          <Animated.View style={[animatedStyle, { flex: 1 }]}>
            <SupportForm
              defaultCategory={defaults.category}
              defaultReferenceId={defaults.referenceId}
            />
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}
