import { Image, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import LikeComponent from './LikeComponent';
import tw from 'twrnc';
import { resizeImageDimensions } from 'utils/utils_resizeImageDimensions.utils';
import { fontNames } from 'constants/fontNames.constants';

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
  const image_href = getImageFileView(url, 400);

  const [imageDimensions, setImageDimensions] = useState({
    width: 250,
    height: 250,
  });

  useEffect(() => {
    Image.getSize(image_href, (defaultWidth, defaultHeight) => {
      const screenWidth = Dimensions.get('window').width;
      const cardWidth = width > 0 ? width : screenWidth * 0.7; // fallback to 70% of screen
      const maxHeight = 300;

      const { width: resizedWidth, height: resizedHeight } = resizeImageDimensions(
        { width: defaultWidth, height: defaultHeight },
        cardWidth,
        maxHeight,
      );

      setImageDimensions({ height: resizedHeight, width: resizedWidth });
    });
  }, [image_href, width]);

  return (
    <View>
      <View style={tw`flex-1`} />
      <TouchableOpacity
        activeOpacity={1}
        style={[tw`ml-[20px] rounded-2xl`, { width: imageDimensions.width }]}
        onPress={() => {
          navigation.push(screenName.artwork, { title, url });
        }}
      >
        <View style={tw`rounded-[5px] overflow-hidden relative`}>
          <Image
            source={{ uri: image_href }}
            style={{
              width: imageDimensions.width,
              height: imageDimensions.height,
              objectFit: 'contain',
              borderRadius: 5,
              backgroundColor: '#f5f5f5',
            }}
            resizeMode="contain"
          />
          <View style={tw`absolute top-0 left-0 h-full w-full flex items-end justify-end p-3`}>
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
        <View style={[tw`mt-[15px]`, { width: imageDimensions.width }]}>
          <View style={tw`flex-wrap w-[${imageDimensions.width}px]`}>
            <Text
              style={[
                tw`text-base ${
                  lightText ? 'text-white/90' : 'text-[#1A1A1A]00099]'
                } font-medium w-full`,
                { fontFamily: fontNames.dmSans + 'Medium' },
              ]}
            >
              {title}
            </Text>
            <Text
              style={[
                tw`text-sm ${lightText ? 'text-white/80' : 'text-[#1A1A1A]/70'} w-full`,
                { fontFamily: fontNames.dmSans + 'Regular' },
              ]}
            >
              {artist}
            </Text>
          </View>
          <View style={tw`flex flex-row items-center gap-2`}>
            {availiablity && (
              <Text
                style={[
                  tw`text-base font-bold ${
                    lightText ? 'text-white/90' : 'text-[#1A1A1A]/90'
                  } flex-1`,
                  { fontFamily: fontNames.dmSans + 'Bold' },
                ]}
              >
                {showPrice ? utils_formatPrice(price) : 'Price on request'}
              </Text>
            )}

            <View style={tw`flex-wrap`}>
              {/* {availiablity && (
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
                      tw`${lightText ? "text-[#1A1A1A]" : "text-white"} text-sm`,
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
              )}  */}

              {!availiablity && (
                // <View style={tw`rounded-full bg-[#E0E0E0] px-5 py-2 mt-2`}>
                <Text
                  style={[
                    tw`text-base font-bold ${
                      lightText ? 'text-white/90' : 'text-[#1A1A1A]/90'
                    } flex-1`,
                    { fontFamily: fontNames.dmSans + 'Bold' },
                  ]}
                >
                  Sold
                </Text>
                // </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
