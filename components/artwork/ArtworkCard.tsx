import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { colors } from "config/colors.config";
import { getImageFileView } from "lib/storage/getImageFileView";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";
import { utils_formatPrice } from "utils/utils_priceFormatter";
import LikeComponent from "./LikeComponent";
import tw from "twrnc";
import { resizeImageDimensions } from "utils/utils_resizeImageDimensions.utils";
import { fontNames } from "constants/fontNames.constants";

type ArtworkCardType = {
  title: string;
  url: string;
  price: number;
  artist: string;
  rarity?: string;
  medium?: string;
  showPrice?: boolean;
  availiablity?: boolean;
  showTags?: boolean;
  lightText?: boolean;
  width?: number;
  art_id?: string;
  impressions?: number;
  like_IDs?: string[];
  galleryView?: boolean;
};

export default function ArtworkCard({
  title,
  url,
  artist,
  showPrice,
  price,
  lightText,
  width = 0,
  impressions,
  art_id,
  like_IDs,
  galleryView = false,
  availiablity,
}: ArtworkCardType) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const image_href = getImageFileView(url, 270);

  const [imageDimensions, setImageDimensions] = useState({
    width: 200,
    height: 200,
  });

  useEffect(() => {
    Image.getSize(image_href, (defaultWidth, defaultHeight) => {
      const { width, height } = resizeImageDimensions(
        { width: defaultWidth, height: defaultHeight },
        300
      );
      setImageDimensions({ height, width });
      // setRenderDynamicImage(true);
    });
  }, [image_href]);

  return (
    // <TouchableOpacity
    //   activeOpacity={1}
    //   style={[styles.container, width > 0 && { width: width }]}
    //   onPress={() => {
    //     navigation.push(screenName.artwork, { title: title });
    //   }}
    // >
    //   <View
    //     style={[
    //       styles.imageContainer,
    //       lightText && {
    //         backgroundColor: "rgba(225,225,225,0.15)",
    //         padding: 15,
    //       },
    //     ]}
    //   >
    //     <Image
    //       source={{ uri: image_href }}
    //       style={styles.image}
    //       resizeMode="contain"
    //     />
    //   </View>
    //   <View style={styles.mainDetailsContainer}>
    //     <View style={{ flex: 1 }}>
    //       <Text
    //         style={[
    //           { fontSize: 14, color: colors.primary_black },
    //           lightText && { color: colors.white },
    //         ]}
    //       >
    //         {title}
    //       </Text>
    //       <Text
    //         style={[
    //           {
    //             fontSize: 12,
    //             color: colors.primary_black,
    //             opacity: 0.7,
    //             marginTop: 5,
    //           },
    //           lightText && { color: colors.white, opacity: 1 },
    //         ]}
    //       >
    //         {artist}
    //       </Text>
    //       {galleryView ? (
    //         <Text
    //           style={[
    //             { fontSize: 12, color: colors.primary_black, marginTop: 5 },
    //             lightText && { color: colors.white },
    //           ]}
    //         >
    //           {impressions} impressions
    //         </Text>
    //       ) : !availiablity ? (
    //         <Text
    //           style={[
    //             {
    //               fontSize: 14,
    //               color: colors.primary_black,
    //               opacity: 0.7,
    //               marginTop: 5,
    //             },
    //             lightText && { color: colors.white },
    //           ]}
    //         >
    //           Sold
    //         </Text>
    //       ) : (
    //         <Text
    //           style={[
    //             {
    //               fontSize: 14,
    //               color: colors.primary_black,
    //               fontWeight: "500",
    //               marginTop: 5,
    //             },
    //             lightText && { color: colors.white },
    //           ]}
    //         >
    //           {showPrice ? utils_formatPrice(price) : "Price on request"}
    //         </Text>
    //       )}
    //     </View>
    //     {!galleryView && (
    //       <LikeComponent
    //         art_id={art_id}
    //         impressions={impressions || 0}
    //         likeIds={like_IDs || []}
    //         lightText={lightText}
    //       />
    //     )}
    //   </View>
    // </TouchableOpacity>
    <View>
      <TouchableOpacity
        activeOpacity={1}
        style={[
          tw`ml-[20px] bg-[#E7D9D9] p-[15px] rounded-2xl`,
          width > 0 && { width: width },
        ]}
        onPress={() => {
          navigation.push(screenName.artwork, { title: title });
        }}
      >
        <View style={tw`rounded-2xl overflow-hidden relative`}>
          <Image
            source={{ uri: image_href }}
            style={{
              // width: imageWidth,
              width: imageDimensions.width,
              height: imageDimensions.height,
              objectFit: "cover",
              borderRadius: 10,
            }}
            resizeMode="contain"
          />
          <View
            style={tw`absolute top-0 left-0 h-full w-full flex items-end justify-start p-2`}
          >
            {!galleryView && (
              <View
                style={tw`bg-white h-[30px] w-[30px] rounded-full flex items-center justify-center`}
              >
                <LikeComponent
                  art_id={art_id}
                  impressions={impressions || 0}
                  likeIds={like_IDs || []}
                />
              </View>
            )}
          </View>
        </View>
      <View style={tw`mt-[15px]`}>
        <View style={tw`flex-wrap w-[${imageDimensions.width}px]`}>
          <Text style={[tw`text-base text-black/70 w-full`, {fontFamily: fontNames.dmSans + 'Regular'}]}>{title}</Text>
          <Text style={[tw`text-base text-black/70 w-full`, {fontFamily: fontNames.dmSans + 'Regular'}]}>{artist}</Text>
        </View>
        <View style={tw`flex flex-row items-center gap-2`}>
          <Text style={[tw`text-base font-bold text-black/90 flex-1`, {fontFamily: fontNames.dmSans + 'Bold'}]}>{showPrice ? utils_formatPrice(price) : "Price on request"}</Text>
          <View style={tw`flex-wrap`}>
            <TouchableOpacity
              style={tw`bg-black rounded-full px-5 py-2 w-fit mt-2`}
              onPress={() =>
                navigation.push(screenName.purchaseArtwork, {
                  title,
                })
              }
              activeOpacity={1}
            >
              <Text style={[tw`text-white text-sm`, {fontFamily: fontNames.dmSans + 'Medium'}]}>Purchase</Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // width: 270,
    marginLeft: 20,
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
