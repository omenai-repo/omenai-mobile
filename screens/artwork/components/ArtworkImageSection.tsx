import React from "react";
import {
  View,
  Pressable,
  Image,
  Text,
  NativeSyntheticEvent,
  ImageLoadEventData,
} from "react-native";
import tw from "twrnc";
import { Feather } from "@expo/vector-icons";
import { museumColors } from "#config/colors.config";

export default function ArtworkImageSection({
  imageUri,
  imageDimensions,
  setModalVisible,
  setMuseumVisible,
  isTabletLandscape,
  screenWidth,
  onImageLoad,
}: Readonly<{
  imageUri: string;
  imageDimensions: { width: number; height: number } | null;
  setModalVisible: (visible: boolean) => void;
  setMuseumVisible: (visible: boolean) => void;
  isTabletLandscape: boolean;
  screenWidth: number;
  onImageLoad: (w: number, h: number) => void;
}>) {
  const fallbackHeight = isTabletLandscape ? 400 : 300;
  const height = imageDimensions?.height ?? fallbackHeight;

  const handleLoad = (e: NativeSyntheticEvent<ImageLoadEventData>) => {
    const { width: w, height: h } = e.nativeEvent.source;
    onImageLoad(w, h);
  };

  return (
    <View
      style={
        isTabletLandscape
          ? [tw`justify-start items-center`, { flex: 0.5 }]
          : [tw`items-center`, { width: screenWidth }]
      }
    >
      <Pressable
        onPress={() => setModalVisible(true)}
        style={{ width: screenWidth }}
      >
        <Image
          source={{ uri: imageUri }}
          style={[
            {
              height,
              width: screenWidth,
              resizeMode:
                imageDimensions &&
                imageDimensions.width > imageDimensions.height
                  ? "cover"
                  : "contain",
              alignSelf: "center",
              backgroundColor: imageDimensions ? "white" : "#f5f5f5",
            },
            isTabletLandscape && { maxWidth: "100%", maxHeight: 500 },
          ]}
          onLoad={handleLoad}
        />
      </Pressable>

      {/* Pressable pressed state must stay inline — style exception */}
      <Pressable
        onPress={() => setMuseumVisible(true)}
        style={({ pressed }) => [
          tw`flex-row items-center gap-1.5 self-end mt-1.5 mr-4 py-1.5 px-3.5 rounded-sm`,
          {
            backgroundColor: pressed
              ? museumColors.buttonBackgroundPressed
              : museumColors.buttonBackground,
            borderWidth: 0.5,
            borderColor: museumColors.buttonBorder,
          },
        ]}
        accessibilityLabel="View artwork in museum viewer"
        accessibilityRole="button"
      >
        <Feather name="image" size={14} color={museumColors.buttonText} />
        <Text
          style={[
            tw`text-sm font-sans-medium tracking-wide`,
            { color: museumColors.buttonText },
          ]}
        >
          View in museum
        </Text>
      </Pressable>
    </View>
  );
}
