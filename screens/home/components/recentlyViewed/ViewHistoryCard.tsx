import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PixelRatio,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";
import { getImageFileView } from "lib/storage/getImageFileView";
import { colors } from "config/colors.config";
import { resizeImageDimensions } from "utils/utils_resizeImageDimensions.utils";

import { fontNames } from "constants/fontNames.constants";

export default function ViewHistoryCard({
  url,
  art_id,
  artist,
  artwork,
}: {
  url: string;
  art_id: string;
  artwork: string;
  artist: string;
}) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const dpr = PixelRatio.get();
  const displayWidth = 300;
  const fetchWidth = Math.round(displayWidth * dpr);
  const image_href = getImageFileView(url, fetchWidth);

  const [imageDimensions, setImageDimensions] = useState({
    width: 200,
    height: 200,
  });

  useEffect(() => {
    let isMounted = true;

    Image.getSize(
      image_href,
      (defaultWidth, defaultHeight) => {
        if (!isMounted) return;
        const { width, height } = resizeImageDimensions(
          { width: defaultWidth, height: defaultHeight },
          displayWidth,
          300 // Optional maxHeight
        );
        setImageDimensions({ height, width });
      },
      (error) => {
        console.warn(
          "Failed to get image size for history card:",
          error?.message || error
        );
      }
    );

    return () => {
      isMounted = false;
    };
  }, [image_href]);

  return (
    <View>
      <View style={{ flex: 1 }} />
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={() => {
          navigation.navigate(screenName.artwork, { art_id, url });
        }}
      >
        <Image
          source={{ uri: image_href }}
          style={{
            width: imageDimensions.width,
            height: imageDimensions.height,
            borderRadius: 10,
          }}
          resizeMode="cover"
        />
        <View style={styles.mainDetailsContainer}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 16,
              color: "#1A1A1A",
              fontFamily: fontNames.dmSans + "Medium",
            }}
          >
            {artwork}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 14,
              color: "#1A1A1A",
              opacity: 0.7,
              marginTop: 2,
              fontFamily: fontNames.dmSans + "Regular",
            }}
          >
            {artist}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // width: 270,
    marginLeft: 20,
    // padding: 10,
    // borderRadius: 10,
    // backgroundColor: "#f0f0f0",
  },
  mainDetailsContainer: {
    marginTop: 10,
    width: 200,
  },
});
