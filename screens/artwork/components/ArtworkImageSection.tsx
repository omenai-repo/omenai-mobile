import React from "react";
import { View, Pressable, Image } from "react-native";
import tw from "twrnc";

export default function ArtworkImageSection({
  imageUri,
  imageDimensions,
  setModalVisible,
  isTabletLandscape,
  screenWidth,
}: {
  imageUri: string;
  imageDimensions: { width: number; height: number };
  setModalVisible: (visible: boolean) => void;
  isTabletLandscape: boolean;
  screenWidth: number;
}) {
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
              height: imageDimensions.height,
              width: screenWidth,
              resizeMode:
                imageDimensions.width > imageDimensions.height
                  ? "cover"
                  : "contain",
              alignSelf: "center",
              backgroundColor: "white",
            },
            isTabletLandscape && { maxWidth: "100%", maxHeight: 500 },
          ]}
        />
      </Pressable>
    </View>
  );
}
