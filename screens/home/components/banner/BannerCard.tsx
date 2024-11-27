import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { colors } from 'config/colors.config';
import tw from 'twrnc';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getPromotionalFileView } from 'lib/storage/getPromotionalsFileView';
import { fontNames } from 'constants/fontNames.constants';
import { AntDesign } from '@expo/vector-icons';

type BannerItemProps = {
  image?: string;
  headline: string;
  subheadline: string;
  cta: string;
  handleClick: (url: string) => void;
};

const { width: windowWidth } = Dimensions.get("window");

export default function BannerCard({
  image,
  headline,
  subheadline,
  cta,
  handleClick,
}: BannerItemProps) {

    const image_href = getPromotionalFileView(image, 500);

    return (
        <View style={tw`w-[${windowWidth - 50}px] pl-[15px]`}>
            <View style={tw`w-full h-full bg-[#f5f5f5] rounded-2xl p-[15px] gap-[15px] flex flex-row flex-1`}>
                <View style={tw`flex-1 h-full space-y-1`}>
                    <View style={tw`flex-1`}>
                        <Text style={[tw`font-semibold text-[#1a1a1a] text-base`, {fontFamily: fontNames.dmSans + 'SemiBold'}]}>{headline}</Text>
                        <Text style={[tw`mt-2 text-sm text-[#1a1a1a]`, {fontFamily: fontNames.dmSans + 'Regular'}]}>{subheadline}</Text>
                    </View>
                    <View style={tw`flex-wrap`}>
                        <TouchableOpacity
                            style={tw`bg-[#1a1a1a] rounded-full h-[40px] w-[40px] mt-3 items-center justify-center `}
                            onPress={() => handleClick(cta)}
                            activeOpacity={1}
                        >
                            <AntDesign name='arrowright' color={colors.white} size={20} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={tw`flex-1 max-h-[150px] bg-[#ddd] rounded overflow-hidden`}>
                    <Image
                        source={{uri: image_href}}
                        style={tw`w-full h-full`}
                        resizeMode="cover"
                    />
                </View>
            </View>
            {/* <View style={tw`flex-1`} /> */}
        </View>
  );
}
