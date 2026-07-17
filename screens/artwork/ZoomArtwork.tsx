import React, { useEffect, useState } from "react";
import { Modal, Dimensions, View, Image } from "react-native";
import { GestureHandlerRootView, Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import tw from "twrnc";
import BackScreenButton from "components/buttons/BackScreenButton";
import { getImageFileView } from "lib/storage/getImageFileView";

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

  const [imageDimensions, setImageDimensions] = useState({
    width: screenWidth,
    height: screenHeight,
  });

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (url) {
      const image = getImageFileView(url, 800);
      setImageUrl(image);
    }
  }, [url]);

  // Shared values for gestures
  const scale = useSharedValue(1);
  const lastScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastTranslateX = useSharedValue(0);
  const lastTranslateY = useSharedValue(0);

  // Track the focal point for better zooming experience
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  // Fetch and calculate image dimensions
  useEffect(() => {
    if (imageUrl) {
      Image.getSize(
        imageUrl,
        (imageWidth, imageHeight) => {
          const aspectRatio = imageWidth / imageHeight;
          let targetWidth = screenWidth;
          let targetHeight = screenWidth / aspectRatio;

          if (targetHeight > screenHeight) {
            targetHeight = screenHeight;
            targetWidth = screenHeight * aspectRatio;
          }

          setImageDimensions({
            width: targetWidth,
            height: targetHeight,
          });
        },
        (error) => console.error("Failed to load image size:", error)
      );
    }
  }, [imageUrl, screenWidth, screenHeight]);

  // Reset image position and scale when modal closes
  useEffect(() => {
    if (!modalVisible) {
      scale.value = 1;
      translateX.value = 0;
      translateY.value = 0;
    }
  }, [modalVisible]);

  // Pinch gesture handler (with focal point handling)
  const pinchGesture = Gesture.Pinch()
    .onStart((event) => {
      lastScale.value = scale.value;
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    })
    .onUpdate((event) => {
      const newScale = Math.max(1, Math.min(3, lastScale.value * event.scale));
      const scaleFactor = newScale / scale.value;

      // Adjust translation to keep zoom centered around fingers
      translateX.value = (translateX.value - focalX.value) * scaleFactor + focalX.value;
      translateY.value = (translateY.value - focalY.value) * scaleFactor + focalY.value;

      scale.value = newScale;
    })
    .onEnd(() => {
      scale.value = withSpring(scale.value, {
        damping: 10,
        stiffness: 100,
      });
    });

  // Pan gesture handler
  const panGesture = Gesture.Pan()
    .onStart(() => {
      lastTranslateX.value = translateX.value;
      lastTranslateY.value = translateY.value;
    })
    .onUpdate((event) => {
      const scaledWidth = imageDimensions.width * scale.value;
      const scaledHeight = imageDimensions.height * scale.value;

      const boundaryX = Math.max(0, (scaledWidth - screenWidth) / 2);
      const boundaryY = Math.max(0, (scaledHeight - screenHeight) / 2);

      translateX.value = Math.max(
        -boundaryX,
        Math.min(boundaryX, lastTranslateX.value + event.translationX)
      );
      translateY.value = Math.max(
        -boundaryY,
        Math.min(boundaryY, lastTranslateY.value + event.translationY)
      );
    })
    .onEnd(() => {
      translateX.value = withSpring(translateX.value, {
        damping: 10,
        stiffness: 100,
      });
      translateY.value = withSpring(translateY.value, {
        damping: 10,
        stiffness: 100,
      });
    });

  // Combined gestures
  const combinedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <GestureHandlerRootView style={tw`flex-1`}>
        <View style={tw`flex-1 bg-white`}>
          {/* Back Button */}
          <View style={tw`pt-[60px] android:pt-[40px] pl-[20px] absolute z-10`}>
            <BackScreenButton handleClick={() => setModalVisible(false)} />
          </View>

          {/* Gesture Detector */}
          <GestureDetector gesture={combinedGesture}>
            <Animated.Image
              source={{ uri: imageUrl }}
              style={[
                {
                  width: imageDimensions.width,
                  height: imageDimensions.height,
                  alignSelf: "center",
                  marginTop: screenHeight / 6,
                  resizeMode: "contain",
                },
                animatedStyle,
              ]}
            />
          </GestureDetector>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default ZoomArtwork;
