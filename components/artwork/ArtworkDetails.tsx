import React from 'react';
import { Text, View } from 'react-native';
import tw from 'twrnc';
import { fontNames } from 'constants/fontNames.constants';
import { utils_formatPrice } from 'utils/utils_priceFormatter';

interface ArtworkDetailsProps {
  title: string;
  artist: string;
  availability: boolean;
  showPrice: boolean;
  price: number;
}

export default function ArtworkDetails({
  title,
  artist,
  availability,
  showPrice,
  price,
}: ArtworkDetailsProps) {
  return (
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
        <Text
          style={[
            tw`text-base font-bold text-[#1A1A1A]/90`,
            { fontFamily: fontNames.dmSans + 'Bold' },
          ]}
        >
          Sold
        </Text>
      )}
    </View>
  );
}
