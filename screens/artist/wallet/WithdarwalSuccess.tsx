import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import tw from 'twrnc';

export const WithdrawalSuccess = ({ route, navigation }: { route: any; navigation: any }) => {
  // const { message, data } = route?.params;

  return (
    <View style={tw`flex-1 justify-center items-center p-6 bg-white`}>
      <Ionicons name="checkmark-circle" size={60} color={'#2196F3'} />

      <Text style={tw`text-[20px] font-semibold mb-[15px] mt-[20px]`}>
        Transfer initiated successfully
      </Text>
      <Text style={tw`text-[14px] text-center mb-6`}>
        Your transfer has been successfully initiated. The funds will be deposited into your bank
        account shortly.
      </Text>

      <Pressable style={tw`bg-[#000] py-4 rounded-lg w-full`} onPress={() => navigation.pop(2)}>
        <Text style={tw`text-white text-center font-bold`}>Back to Wallet</Text>
      </Pressable>
    </View>
  );
};
