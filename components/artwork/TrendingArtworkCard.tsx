import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { Image, ImageLoadEventData } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { colors } from "#config/colors.config";
import { getImageFileView } from "#lib/storage/getImageFileView";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";

type TrendingArtworkCardType = {
  title: string;
  image: string;
  artist: string;
  rarity?: string;
  medium?: string;
  likes: number;
  art_id: string;
  image_format?: { ratio: string; orientation?: string };
};

function TrendingArtworkCard({
  image,
  artist,
  title,
  likes,
  art_id,
  image_format,
}: Readonly<TrendingArtworkCardType>) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const screenWidth = Dimensions.get("window").width;
  const imageWidth = (screenWidth - 60) / 2;
  const image_href = getImageFileView(image, 300);

  const imageDimensions = React.useMemo(() => {
    let height = imageWidth; // Default fallback (1:1 aspect ratio)
    if (image_format?.ratio) {
      const [w, h] = image_format.ratio.split(":");
      const ratio = Number(w) / Number(h);
      if (!isNaN(ratio) && ratio > 0) {
        height = imageWidth / ratio;
      }
    }
    return {
      width: imageWidth,
      height: Math.max(100, Math.min(height, 500)), // Clamp height to reasonable bounds
    };
  }, [imageWidth, image_format?.ratio]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => navigation.push(screenName.artwork, { art_id, image })}
    >
      <View style={styles.container}>
        <View style={styles.top}>
          <View style={{ width: "100%", overflow: "hidden" }}>
            <Image
              source={{ uri: image_href }}
              style={{
                width: imageDimensions.width,
                height: imageDimensions.height,
              }}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
              recyclingKey={art_id}
            />
          </View>
          <View style={styles.likeContainer}>
            <TouchableOpacity style={{ padding: 10 }}>
              <View style={styles.likeButton}>
                <Feather name="heart" size={16} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.contentsContainer}>
          <Text style={{ fontSize: 16 }}>{title}</Text>
          <View style={styles.profileContainer}>
            <Text style={styles.artistName}>{artist}</Text>
            <Text style={styles.likes}>
              {likes} {likes > 1 ? "Likes" : "Like"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(TrendingArtworkCard);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
  },
  top: {
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    objectFit: "cover",
    height: "100%",
    backgroundColor: colors.grey50,
  },
  likeContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    position: "absolute",
    top: 0,
    right: 0,
    padding: 0,
  },
  likeButton: {
    height: 30,
    width: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  contentsContainer: {
    backgroundColor: "#FAFAFA",
    padding: 10,
  },
  profileContainer: {
    gap: 10,
    marginTop: 10,
  },
  artistName: {
    fontSize: 14,
    flex: 1,
  },
  likes: {
    fontSize: 14,
  },
  profileImage: {
    height: 25,
    width: 25,
    borderRadius: 20,
    objectFit: "cover",
    backgroundColor: colors.inputBorder,
  },
  tagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    paddingTop: 15,
    marginTop: 15,
    borderTopWidth: 1,
    borderColor: colors.inputBorder,
  },
  tags: {
    fontSize: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
});
