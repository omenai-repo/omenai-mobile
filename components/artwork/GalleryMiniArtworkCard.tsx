import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useState } from "react";
import { Image, ImageLoadEventData } from "expo-image";
import { colors } from "#config/colors.config";
import { getImageFileView } from "#lib/storage/getImageFileView";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";
import { utils_formatPrice } from "#utils/utils_priceFormatter";
import EditArtworkButton from "#components/buttons/EditArtworkButton";
import tw from "twrnc";
import { useAppStore } from "#store/app/appStore";

type MiniArtworkCardType = {
  readonly title: string;
  readonly url: string;
  readonly art_id: string;
  readonly artist: string;
  readonly usd_price: number;
};

function GalleryMiniArtworkCard({
  url,
  title,
  art_id,
  artist,
  usd_price,
}: Readonly<MiniArtworkCardType>) {
  const { isLoggedIn } = useAppStore();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const screenWidth = Dimensions.get("window").width;
  const displayWidth = (screenWidth - 60) / 2;
  const image_href = getImageFileView(url, 300);

  const [imageDimensions, setImageDimensions] = useState({
    width: displayWidth,
    height: 200,
  });

  const handleImageLoad = useCallback(
    (e: ImageLoadEventData) => {
      const { source } = e;
      const aspectRatio = source.height / source.width;
      setImageDimensions({
        width: displayWidth,
        height: displayWidth * aspectRatio,
      });
    },
    [displayWidth],
  );

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[tw`ml-0`, { width: displayWidth }]}
      onPress={() => {
        navigation.push(screenName.artwork, { art_id, url });
      }}
    >
      <View
        style={{
          width: displayWidth,
          height: imageDimensions.height,
          position: "relative",
        }}
      >
        <Image
          source={{ uri: image_href }}
          style={{
            width: displayWidth,
            height: imageDimensions.height,
          }}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
          recyclingKey={art_id}
          onLoad={handleImageLoad}
        />
        <EditArtworkButton
          handlePress={() => {
            navigation.navigate(screenName.gallery.editArtwork, {
              art_id: art_id,
            });
          }}
        />
      </View>
      <View style={styles.mainDetailsContainer}>
        <Text style={{ fontSize: 14, color: colors.primary_black }}>
          {title}
        </Text>
        <Text
          style={{ fontSize: 12, color: colors.primary_black, opacity: 0.7 }}
        >
          {artist}
        </Text>
        {isLoggedIn && <Text>{utils_formatPrice(usd_price, "$")}</Text>}
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(GalleryMiniArtworkCard);

const styles = StyleSheet.create({
  mainDetailsContainer: {
    marginTop: 10,
    gap: 5,
  },
});
