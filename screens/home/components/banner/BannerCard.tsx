import { Dimensions, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import React, { memo } from 'react';
import { AntDesign } from '@expo/vector-icons';
import tw from 'twrnc';
import { getPromotionalFileView } from 'lib/storage/getPromotionalsFileView';
import { fontNames } from 'constants/fontNames.constants';
import { colors } from 'config/colors.config';

type BannerItemProps = {
  image: string;
  headline: string;
  subheadline: string;
  cta: string;
  handleClick: (url: string) => void;
};

const { width: windowWidth } = Dimensions.get('window');

const BannerCard = memo(({ image, headline, subheadline, cta, handleClick }: BannerItemProps) => {
  const image_href = getPromotionalFileView(image, 800);

  return (
    <View
      style={tw.style(`w-[${windowWidth - 50}px] pl-[15px]`, {
        width: subheadline.length <= 20 ? windowWidth - 50 : windowWidth - 10,
      })}
    >
      <ImageBackground
        source={{ uri: image_href }}
        // source={require('../../../../assets/images/gallery_one.png')}
        style={tw`h-[200px]`}
        imageStyle={tw`rounded-[12px]`}
        resizeMode="cover"
      >
        {/* Overlay */}
        <View style={tw`bg-black bg-opacity-50 flex-1 rounded-[12px] pt-[30px] pl-[20px]`}>
          <Text
            style={[
              tw`text-white text-[18px] font-bold`,
              { fontFamily: fontNames.dmSans + 'Bold' },
            ]}
          >
            {headline}
          </Text>
          <Text
            style={[
              tw`text-white text-[13px] mt-1 pr-[120px]`,
              { fontFamily: fontNames.dmSans + 'Regular' },
            ]}
          >
            {subheadline}
          </Text>

          <TouchableOpacity
            // onPress={() => handleClick(image_href)}
            style={tw`mt-4 flex-row bg-black bg-opacity-20 items-center gap-2 px-4 py-2 rounded-full w-[110px]`}
          >
            <Text style={tw`text-white text-[13px] font-semibold`}>Explore</Text>
            <AntDesign name="arrowright" color="#fff" size={15} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
});

export default BannerCard;
