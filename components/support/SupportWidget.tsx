import React, { useEffect } from "react";
import { View, TouchableOpacity, Keyboard, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useAnimatedKeyboard,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { useSupport } from "../../providers/SupportProvider";
import { useMobileSupportDefaulter } from "../../hooks/useMobileSupportDefaulter";
import SupportForm from "./SupportForm";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const BUTTON_SIZE = 56;
const MARGIN = 20;

export default function SupportWidget() {
  const { isOpen, openSupport, closeSupport } = useSupport();
  const insets = useSafeAreaInsets();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");
  const keyboard = useAnimatedKeyboard();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const contextX = useSharedValue(0);
  const contextY = useSharedValue(0);

  const initialX = SCREEN_WIDTH - BUTTON_SIZE - MARGIN;
  const initialY = SCREEN_HEIGHT - BUTTON_SIZE - MARGIN - insets.bottom - 80;

  const animatedStyle = useAnimatedStyle(() => ({
    paddingBottom: keyboard.height.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const pan = Gesture.Pan()
    .onStart(() => {
      contextX.value = translateX.value;
      contextY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = contextX.value + event.translationX;
      translateY.value = contextY.value + event.translationY;
    })
    .onEnd(() => {
      // Calculate final position based on drag
      const absoluteX = initialX + translateX.value;
      const absoluteY = initialY + translateY.value;

      // Smart boundary handling
      let finalTranslateY = translateY.value;

      // Horizontal boundaries (snap to nearest side)
      const distToLeft = absoluteX;
      const distToRight = SCREEN_WIDTH - (absoluteX + BUTTON_SIZE);

      const finalTranslateX =
        distToLeft < distToRight
          ? MARGIN - initialX
          : SCREEN_WIDTH - MARGIN - BUTTON_SIZE - initialX;

      // Vertical boundaries
      const minY = insets.top + MARGIN;
      const maxY = SCREEN_HEIGHT - insets.bottom - MARGIN - BUTTON_SIZE;

      if (absoluteY < minY) {
        finalTranslateY = minY - initialY;
      } else if (absoluteY > maxY) {
        finalTranslateY = maxY - initialY;
      }

      translateX.value = withSpring(finalTranslateX, {
        damping: 15,
        stiffness: 150,
      });
      translateY.value = withSpring(finalTranslateY, {
        damping: 15,
        stiffness: 150,
      });
    });

  const defaults = useMobileSupportDefaulter();

  useEffect(() => {
    if (!isOpen) {
      Keyboard.dismiss();
    }
  }, [isOpen]);

  return (
    <>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            tw`absolute z-50 rounded-full items-center justify-center shadow-lg bg-black`,
            {
              width: BUTTON_SIZE,
              height: BUTTON_SIZE,
              top: initialY,
              left: initialX,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4.65,
              elevation: 8,
            },
            buttonAnimatedStyle,
          ]}
        >
          <TouchableOpacity
            onPress={openSupport}
            style={tw`w-full h-full items-center justify-center`}
          >
            <Ionicons name="sparkles-sharp" size={28} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>

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
            tw`bg-white rounded-t-sm overflow-hidden`,
            { height: SCREEN_HEIGHT * 0.85, paddingBottom: insets.bottom },
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
