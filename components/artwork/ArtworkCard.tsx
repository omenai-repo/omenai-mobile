import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getImageFileView } from "lib/storage/getImageFileView";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";
import { utils_formatPrice } from "utils/utils_priceFormatter";
import LikeComponent from "./LikeComponent";
import tw from "twrnc";
import { resizeImageDimensions } from "utils/utils_resizeImageDimensions.utils";
import { fontNames } from "constants/fontNames.constants";
import { utils_getAsyncData } from "utils/utils_asyncStorage";
import { requestArtworkPrice } from "services/artworks/requestArtworkPrice";
import { useModalStore } from "store/modal/modalStore";

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
  medium,
}: ArtworkCardType) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [loadingPriceQuote, setLoadingPriceQuote] = useState(false);
  const image_href = getImageFileView(url, 270);

  const { updateModal } = useModalStore();

  const [imageDimensions, setImageDimensions] = useState({
    width: 250,
    height: 250,
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

  const handleRequestPriceQuote = async () => {
    setLoadingPriceQuote(true);

    let userEmail = "";
    let userName = "";

    const userSession = await utils_getAsyncData("userSession");
    if (userSession.value) {
      userEmail = JSON.parse(userSession.value).email;
      userName = JSON.parse(userSession.value).name;
    } else return;

    const artwork_data = {
      title: title,
      artist: artist,
      art_id: art_id,
      url: url,
      medium: medium,
      pricing: price,
    };

    const results = await requestArtworkPrice(
      artwork_data,
      userEmail,
      userName
    );
    if (results.isOk) {
      updateModal({
        message: `Price quote for ${artwork_data.title} has been sent to ${userEmail}`,
        showModal: true,
        modalType: "success",
      });
    } else {
      updateModal({
        message:
          "Something went wrong, please try again or contact us for assistance.",
        showModal: true,
        modalType: "error",
      });
    }

    setLoadingPriceQuote(false);
  };

  return (
    <View>
      <View style={tw`flex-1`} />
      <TouchableOpacity
        activeOpacity={1}
        style={[tw`ml-[20px] rounded-2xl`, width > 0 && { width: width }]}
        onPress={() => {
          navigation.push(screenName.artwork, { title: title });
        }}
      >
        <View style={tw`rounded-[5px] overflow-hidden relative`}>
          <Image
            source={{ uri: image_href }}
            style={{
              // width: imageWidth,
              width: imageDimensions.width,
              height: imageDimensions.height,
              objectFit: "contain",
              borderRadius: 5,
              backgroundColor: "#f5f5f5",
            }}
            resizeMode="contain"
          />
          <View
            style={tw`absolute top-0 left-0 h-full w-full flex items-end justify-end p-3`}
          >
            {!galleryView && (
              <View
                style={tw`bg-white/20 h-[30px] w-[30px] rounded-full flex items-center justify-center`}
              >
                <LikeComponent
                  art_id={art_id}
                  impressions={impressions || 0}
                  likeIds={like_IDs || []}
                  lightText={true}
                />
              </View>
            )}
          </View>
        </View>
        <View style={tw`mt-[15px]`}>
          <View style={tw`flex-wrap w-[${imageDimensions.width}px]`}>
            <Text
              style={[
                tw`text-base ${
                  lightText ? "text-white/90" : "text-[#00000099]"
                } font-medium w-full`,
                { fontFamily: fontNames.dmSans + "Medium" },
              ]}
            >
              {title}
            </Text>
            <Text
              style={[
                tw`text-sm ${
                  lightText ? "text-white/80" : "text-black/70"
                } w-full`,
                { fontFamily: fontNames.dmSans + "Regular" },
              ]}
            >
              {artist}
            </Text>
          </View>
          <View style={tw`flex flex-row items-center gap-2`}>
            <Text
              style={[
                tw`text-base font-bold ${
                  lightText ? "text-white/90" : "text-black/90"
                } flex-1`,
                { fontFamily: fontNames.dmSans + "Bold" },
              ]}
            >
              {showPrice ? utils_formatPrice(price) : "Price on request"}
            </Text>

            <View style={tw`flex-wrap`}>
              {availiablity ? (
                <TouchableOpacity
                  style={tw`${
                    lightText ? "bg-white" : "bg-black"
                  } rounded-full px-5 py-2 w-fit mt-2`}
                  onPress={() => {
                    if (showPrice) {
                      navigation.push(screenName.purchaseArtwork, {
                        title,
                      });
                    } else {
                      handleRequestPriceQuote();
                    }
                  }}
                  activeOpacity={1}
                >
                  <Text
                    style={[
                      tw`${lightText ? "text-black" : "text-white"} text-sm`,
                      { fontFamily: fontNames.dmSans + "Medium" },
                    ]}
                  >
                    {showPrice
                      ? "Purchase"
                      : loadingPriceQuote
                      ? "Requesting ..."
                      : "Request price"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={tw`rounded-full bg-[#E0E0E0] px-5 py-2 w-fit mt-2`}
                >
                  <Text
                    style={[
                      tw`text-[#A1A1A1] text-sm`,
                      { fontFamily: fontNames.dmSans + "Medium" },
                    ]}
                  >
                    Sold
                  </Text>
                </View>
              )}
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
