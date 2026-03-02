import React from "react";
import {
  View,
  Pressable,
  Image,
  NativeSyntheticEvent,
  ImageLoadEventData,
} from "react-native";
import tw from "twrnc";

export default function ArtworkImageSection({
  imageUri,
  imageDimensions,
  setModalVisible,
  isTabletLandscape,
  screenWidth,
  onImageLoad,
}: Readonly<{
  imageUri: string;
  imageDimensions: { width: number; height: number } | null;
  setModalVisible: (visible: boolean) => void;
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
    </View>
  );
}
