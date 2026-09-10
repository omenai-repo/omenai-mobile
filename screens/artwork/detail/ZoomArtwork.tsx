import React, { useEffect, useState } from "react";
import {
  Modal,
  Dimensions,
  View,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  useAnimatedReaction,
} from "react-native-reanimated";
import tw from "twrnc";
import { getImageFileView } from "#lib/storage/getImageFileView";
import Slider from "@react-native-community/slider";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "#config/colors.config";

const ZoomArtwork = ({
  modalVisible,
  setModalVisible,
  url,
}: {
  url: string;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const insets = useSafeAreaInsets();
  const [imageUrl, setImageUrl] = useState("");
  const [imageDimensions, setImageDimensions] = useState({
    width: screenWidth,
    height: screenHeight,
  });

  // Slider state
  const [sliderValue, setSliderValue] = useState(1);

  useEffect(() => {
    if (url) {
      setImageUrl(getImageFileView(url, 1200)); // Higher res for zoom
    }
  }, [url]);

  // Shared values
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // Sync Slider to Pinch (Throttle logic could be added if needed, but smooth enough for now)
  useAnimatedReaction(
    () => scale.value,
    (currentScale) => {
      runOnJS(setSliderValue)(currentScale);
    }
  );

  useEffect(() => {
    if (imageUrl) {
      Image.getSize(
        imageUrl,
        (w, h) => {
          const aspectRatio = w / h;
          let targetWidth = screenWidth;
          let targetHeight = screenWidth / aspectRatio;

          if (targetHeight > screenHeight * 0.8) {
            // Fit within 80% of height to leave room for controls
            targetHeight = screenHeight * 0.8;
            targetWidth = targetHeight * aspectRatio;
          }

          setImageDimensions({ width: targetWidth, height: targetHeight });
        },
        () => {}
      );
    }
  }, [imageUrl, screenWidth, screenHeight]);

  useEffect(() => {
    if (!modalVisible) {
      scale.value = 1;
      translateX.value = 0;
      translateY.value = 0;
      setSliderValue(1);
    }
  }, [modalVisible]);

  const onSliderValueChange = (val: number) => {
    scale.value = val;
    setSliderValue(val);
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((e) => {
      // Allow panning only when zoomed in or if image is naturally larger (not the case here as we fit it)
      if (scale.value > 1) {
        translateX.value = savedTranslateX.value + e.translationX;
        translateY.value = savedTranslateY.value + e.translationY;
      }
    })
    .onEnd(() => {
      // Reset to center if scale is 1
      if (scale.value <= 1) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      scale.value = Math.max(1, Math.min(4, savedScale.value * e.scale));
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withSpring(1);
      }
    });

  const composed = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
      statusBarTranslucent
    >
      <GestureHandlerRootView style={tw`flex-1 bg-[${colors.black}]`}>
        {/* Close Button */}
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={[
            tw`absolute right-5 z-50 bg-[${colors.black_light}] rounded-full p-2`,
            { top: Platform.OS === "android" ? 40 : insets.top + 10 },
          ]}
        >
          <Feather name="x" size={24} color="white" />
        </TouchableOpacity>

        {/* Main Image Area */}
        <View style={tw`flex-1 justify-center items-center overflow-hidden`}>
          <GestureDetector gesture={composed}>
            <Animated.Image
              source={{ uri: imageUrl }}
              style={[
                {
                  width: imageDimensions.width,
                  height: imageDimensions.height,
                  resizeMode: "contain",
                },
                animatedStyle,
              ]}
            />
          </GestureDetector>
        </View>

        {/* Bottom Controls */}
        <View
          style={[
            tw`absolute bottom-10 w-full px-8 items-center gap-4`,
            { paddingBottom: insets.bottom },
          ]}
        >
          <View style={tw`flex-row items-center w-full gap-4`}>
            <Feather name="minus" size={20} color={colors.white} />
            <Slider
              style={tw`flex-1 h-10`}
              minimumValue={1}
              maximumValue={4}
              value={sliderValue}
              onValueChange={onSliderValueChange}
              minimumTrackTintColor={colors.white}
              maximumTrackTintColor={colors.grey}
              thumbTintColor={colors.white}
            />
            <Feather name="plus" size={20} color={colors.white} />
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default ZoomArtwork;
