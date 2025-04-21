import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import tw from 'twrnc';

export const WithdrawalSuccess = ({ route, navigation }: { route: any; navigation: any }) => {
  const { message, data } = route?.params;

  return (
    <View style={tw`flex-1 justify-center items-center p-6 bg-white`}>
      <Image source={require('../../assets/success-checkmark.png')} style={tw`w-24 h-24 mb-6`} />

      <Text style={tw`text-2xl font-bold mb-2`}>Success!</Text>
      <Text style={tw`text-lg text-center mb-6`}>{message}</Text>

      <View style={tw`bg-gray-100 p-4 rounded-lg w-full mb-6`}>
        <Text style={tw`font-semibold`}>Transaction Details:</Text>
        <Text>
          Amount: {data.amount} {data.currency}
        </Text>
        <Text>
          Fee: {data.fee} {data.debit_currency}
        </Text>
        <Text>Status: {data.status}</Text>
        <Text>Reference: {data.reference}</Text>
      </View>

      <Pressable
        style={tw`bg-blue-500 py-4 rounded-lg w-full`}
        onPress={() =>
          navigation.navigate('BottomTabNav', {
            screen: 'WalletScreen',
          })
        }
      >
        <Text style={tw`text-white text-center font-bold`}>Back to Wallet</Text>
      </Pressable>
    </View>
  );
};
