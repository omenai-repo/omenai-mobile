import React from 'react';
import { Text, View } from 'react-native';
import tw from 'twrnc';
import { fontNames } from 'constants/fontNames.constants';

interface ArtworkStatusProps {
  availability: boolean;
}

export default function ArtworkStatus({ availability }: ArtworkStatusProps) {
  return (
    <View style={tw`mt-3 pt-3 border-t border-gray-200`}>
      <View style={tw`flex-row items-center justify-between`}>
        <Text
          style={[tw`text-gray-600 text-xs`, { fontFamily: fontNames.dmSans + 'Regular' }]}
        >
          Status:
        </Text>
        {availability ? (
          <View style={tw`bg-green-50 px-2 py-1 rounded-full`}>
            <Text
              style={[
                tw`text-green-700 text-xs`,
                { fontFamily: fontNames.dmSans + 'Medium' },
              ]}
            >
              Available
            </Text>
          </View>
        ) : (
          <View style={tw`bg-red-50 px-2 py-1 rounded-full`}>
            <Text
              style={[
                tw`text-red-700 text-xs`,
                { fontFamily: fontNames.dmSans + 'Medium' },
              ]}
            >
              Sold
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
