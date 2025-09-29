import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import React, { memo } from 'react';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import LikeComponent from './LikeComponent';
import tw from 'twrnc';
import { fontNames } from 'constants/fontNames.constants';
import { getNumberOfColumns } from 'utils/utils_screen';
import MiniImage from './MiniImage';

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
  availability: boolean;
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
    availability,
  }: MiniArtworkCardType) => {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const screenWidth = Dimensions.get('window').width - 10;

    const dividerNum = getNumberOfColumns();

    let imageWidth = 0;
    imageWidth = Math.round(screenWidth / dividerNum);

    const image_href = getImageFileView(url, imageWidth);

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={tw`flex flex-col pb-[20px]`}
        onPress={() => navigation.push(screenName.artwork, { title, url })}
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
        <View style={tw`mt-3 w-full`}>
          <Text
            style={[
              tw`text-base font-medium text-[#1A1A1A]/90`,
              { fontFamily: fontNames.dmSans + 'Medium' },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              tw`text-sm text-[#1A1A1A]/70 my-1`,
              { fontFamily: fontNames.dmSans + 'Regular' },
            ]}
          >
            {artist}
          </Text>
          {availability ? (
            <Text
              style={[
                tw`text-base font-bold text-[#1A1A1A]/90`,
                { fontFamily: fontNames.dmSans + 'Bold' },
              ]}
            >
              {showPrice ? utils_formatPrice(price) : 'Price on request'}
            </Text>
          ) : (
            !availability && (
              <Text
                style={[
                  tw`text-base font-bold text-[#1A1A1A]/90`,
                  { fontFamily: fontNames.dmSans + 'Bold' },
                ]}
              >
                Sold
              </Text>
            )
          )}
        </View>
      </TouchableOpacity>
    );
  },
);

export default MiniArtworkCard;
