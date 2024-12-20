import {
  Button,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { memo, useEffect, useState } from "react";
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
import tw from "twrnc";
import { fontNames } from "constants/fontNames.constants";
import { getNumberOfColumns } from "utils/utils_screen";
import MiniImage from "./MiniImage";

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

const MiniArtworkCard = memo(
  ({
    url,
    artist,
    title,
    showPrice,
    price,
    art_id,
    impressions,
    like_IDs,
    galleryView = false,
  }: MiniArtworkCardType) => {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const screenWidth = Dimensions.get("window").width - 10;
    // const [imageDimensions, setImageDimensions] = useState({
    //   width: 0,
    //   height: 0,
    // });
    // const [renderDynamicImage, setRenderDynamicImage] = useState(false);

    const dividerNum = getNumberOfColumns();

    let imageWidth = 0;
    imageWidth = Math.round(screenWidth / dividerNum);

    const image_href = getImageFileView(url, imageWidth);

    // useEffect(() => {
    //   Image.getSize(image_href, (defaultWidth, defaultHeight) => {
    //     const { width, height } = resizeImageDimensions(
    //       { width: defaultWidth, height: defaultHeight },
    //       300
    //     );
    //     setImageDimensions({ height, width });
    //     setRenderDynamicImage(true);
    //   });
    // }, [image_href, screenWidth]);

    return (
      // <TouchableOpacity
      //   activeOpacity={1}
      //   style={[styles.container, { width: "100%" }]}
      //   onPress={() => navigation.push(screenName.artwork, { title: title })}
      // >
      //   {renderDynamicImage ? (
      //     <Image
      //       source={{ uri: image_href }}
      //       style={{
      //         width: imageDimensions.width,
      //         height: imageDimensions.height,
      //         objectFit: "contain",
      //       }}
      //       resizeMode="contain"
      //     />
      //   ) : (
      //     <View
      //       style={{ height: 200, width: "100%", backgroundColor: "#f5f5f5" }}
      //     >
      //       <Image
      //         source={{ uri: image_href }}
      //         style={{
      //           width: imageWidth,
      //           height: 200,
      //           objectFit: "contain",
      //         }}
      //         resizeMode="contain"
      //       />
      //     </View>
      //   )}
      //   <View style={styles.mainDetailsContainer}>
      //     <View style={{ flex: 1 }}>
      //       <Text style={{ fontSize: 14, color: colors.primary_black }}>
      //         {title}
      //       </Text>
      //       <Text
      //         style={{
      //           fontSize: 12,
      //           color: colors.primary_black,
      //           opacity: 0.7,
      //           marginTop: 5,
      //         }}
      //       >
      //         {artist}
      //       </Text>
      //       <Text
      //         style={{
      //           fontSize: 14,
      //           color: colors.primary_black,
      //           fontWeight: "500",
      //           marginTop: 5,
      //         }}
      //       >
      //         {showPrice ? utils_formatPrice(price) : "Price on request"}
      //       </Text>
      //     </View>
      //     {galleryView && (
      //       <LikeComponent
      //         art_id={art_id}
      //         impressions={impressions || 0}
      //         likeIds={like_IDs || []}
      //       />
      //     )}
      //   </View>
      // </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        style={tw`flex flex-col items-center pb-[20px]`}
        onPress={() => navigation.push(screenName.artwork, { title: title })}
      >
        <View style={tw`rounded-[5px] overflow-hidden relative`}>
          <View style={tw`w-full flex items-center justify-center`}>
            {MiniImage({ maxWidth: imageWidth, url: image_href })}
          </View>
          <View
            style={tw`absolute top-0 left-0 h-full w-[${
              imageWidth - 10
            }px] bg-black/20 flex items-end justify-end p-3`}
          >
            {galleryView && (
              <View
                style={tw`bg-white/20 h-[30px] w-[30px] rounded-full flex items-center justify-center`}
              >
                <LikeComponent
                  art_id={art_id}
                  impressions={impressions || 0}
                  likeIds={like_IDs || []}
                  lightText
                />
              </View>
            )}
          </View>
        </View>
        <View style={tw`mt-3 w-full px-3`}>
          <Text
            style={[
              tw`text-base font-medium text-black/90`,
              { fontFamily: fontNames.dmSans + "Medium" },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              tw`text-sm text-black/70 my-1`,
              { fontFamily: fontNames.dmSans + "Regular" },
            ]}
          >
            {artist}
          </Text>
          <Text
            style={[
              tw`text-base font-bold text-black/90`,
              { fontFamily: fontNames.dmSans + "Bold" },
            ]}
          >
            {showPrice ? utils_formatPrice(price) : "Price on request"}
          </Text>
          {/* <View style={tw`flex-wrap`}>
          <TouchableOpacity
            style={tw`bg-black rounded-full px-3 py-1 w-fit mt-2`}
            onPress={() =>
              navigation.push(screenName.purchaseArtwork, {
                title,
              })
            }
            activeOpacity={1}
          >
            <Text style={tw`text-white text-sm font-medium`}>Purchase</Text>
          </TouchableOpacity>
        </View> */}
        </View>
      </TouchableOpacity>
    );
  }
);

export default MiniArtworkCard;
