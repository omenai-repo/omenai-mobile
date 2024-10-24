import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { colors } from "config/colors.config";
import { getImageFileView } from "lib/storage/getImageFileView";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";
import { utils_formatPrice } from "utils/utils_priceFormatter";
import { resizeImageDimensions } from "utils/utils_resizeImageDimensions.utils";
import LikeComponent from "./LikeComponent";

type MiniArtworkCardType = {
  title: string;
  url: string;
  price: number;
  artist: string;
  showPrice?: boolean;
  art_id: string;
  impressions: number;
  like_IDs: string[];
  galleryView?: boolean;
};

export default function MiniArtworkCard({
  url,
  artist,
  title,
  showPrice,
  price,
  art_id,
  impressions,
  like_IDs,
  galleryView = false,
}: MiniArtworkCardType) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const screenWidth = Dimensions.get("window").width;
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [renderImage, setRenderImage] = useState(false);

  let imageWidth = 0;
  imageWidth = (screenWidth - 60) / 2; //screen width minus paddings applied to grid view tnen divided by two, to get the width of a single card
  const image_href = getImageFileView(url, imageWidth);

  useEffect(() => {
    Image.getSize(image_href, (defaultWidth, defaultHeight) => {
      const { width, height } = resizeImageDimensions(
        { width: defaultWidth, height: defaultHeight },
        300
      );
      setImageDimensions({ height, width });
      setRenderImage(true);
    });
  }, [image_href, screenWidth]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.container, { width: "100%" }]}
      onPress={() => navigation.push(screenName.artwork, { title: title })}
    >
      {renderImage ? (
        <View
          style={{
            width: imageDimensions.width,
            height: imageDimensions.height,
          }}
        >
          <Image
            source={{ uri: image_href }}
            style={{
              width: imageDimensions.width,
              height: imageDimensions.height,
              objectFit: "contain",
            }}
            resizeMode="contain"
          />
        </View>
      ) : (
        <View
          style={{ height: 200, width: "100%", backgroundColor: "#f5f5f5" }}
        />
      )}
      <View style={styles.mainDetailsContainer}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, color: colors.primary_black }}>
            {title}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.primary_black,
              opacity: 0.7,
              marginTop: 5,
            }}
          >
            {artist}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.primary_black,
              fontWeight: "500",
              marginTop: 5,
            }}
          >
            {showPrice ? utils_formatPrice(price) : "Price on request"}
          </Text>
        </View>
        {galleryView && (
          <LikeComponent
            art_id={art_id}
            impressions={impressions || 0}
            likeIds={like_IDs || []}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginLeft: 0,
  },
  imageContainer: {
    width: "100%",
    height: 250,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  mainDetailsContainer: {
    marginTop: 10,
    flexDirection: "row",
    gap: 10,
  },
});
