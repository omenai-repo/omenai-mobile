import { Dimensions, Image, Platform, StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import { colors } from 'config/colors.config';
import tw from 'twrnc';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getPromotionalFileView } from 'lib/storage/getPromotionalsFileView';
import { fontNames } from 'constants/fontNames.constants';
import { AntDesign } from '@expo/vector-icons';

type BannerItemProps = {
  image: string;
  headline: string;
  subheadline: string;
  cta: string;
  handleClick: (url: string) => void;
};

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const BannerCard = memo(({ image, headline, subheadline, cta, handleClick }: BannerItemProps) => {
  const image_href = getPromotionalFileView(image, 500);

  return (
    <View
      style={tw.style(`w-[${windowWidth - 50}px] pl-[15px]`, {
        width: subheadline.length <= 20 ? windowWidth - 50 : windowWidth - 10,
      })}
    >
      <View style={tw`bg-[#000000] rounded-[10px] p-[13px] flex-row gap-[15px]`}>
        <View style={tw`flex-1 justify-center`}>
          <Text
            style={[
              tw`font-bold text-[#FFFFFF] text-[15px]`,
              { fontFamily: fontNames.dmSans + 'SemiBold' },
            ]}
          >
            {headline}
          </Text>
          <Text
            style={[
              tw`mt-2 text-[13px] text-[#FFFFFF]`,
              { fontFamily: fontNames.dmSans + 'Regular' },
            ]}
          >
            {subheadline}
          </Text>
          <View
            style={tw`flex-row items-center mt-[15px] rounded-[26px] bg-[#0000] border-[1px] border-[#fff] px-[5px] py-[10px] justify-center items-center gap-[10px] mr-[35px]`}
          >
            <Text style={tw`text-[13px] text-[#fff] font-medium`}>Explore</Text>
            <AntDesign name="arrowright" color={colors.white} size={15} />
          </View>
        </View>
        <View style={tw`justify-center`}>
          <Image
            source={{ uri: image_href }}
            style={tw.style(`rounded-[4px]`, {
              width: Platform.OS === 'android' ? windowWidth - 240 : windowWidth - 280,
              height: 135,
            })}
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  );
});

export default BannerCard;
