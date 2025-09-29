import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BackScreenButton from 'components/buttons/BackScreenButton';
import { screenName } from 'constants/screenNames.constants';
import React from 'react';
import { View, Text, TouchableOpacity, Linking, useWindowDimensions } from 'react-native';
import tw from 'twrnc';

export default function NoSubscriptionBlock() {
  const { height } = useWindowDimensions();
  const navigation = useNavigation<any>();

  return (
    <View style={tw`flex-1 bg-[#fff] pt-[60px] android:pt-[80px] px-[25px]`}>
      <BackScreenButton handleClick={() => navigation.goBack()} />
      <View
        style={tw.style(
          `items-center justify-center bg-neutral-900 mt-10 rounded-2xl px-4 py-[40px]`,
          {
            marginTop: height / 5,
          },
        )}
      >
        <View style={tw`flex items-center gap-4`}>
          <Ionicons name="shield" size={35} color="white" />
          <View style={tw`mb-3`}>
            <Text style={tw`text-white text-center`}>
              You need to have an active subscription to use this feature.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Gallery', {
                screen: 'Sub',
              })
            }
            style={tw`bg-white rounded-full h-10 px-6 w-full items-center justify-center`}
          >
            <Text style={tw`text-black text-sm font-medium`}>Activate Subscription</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
