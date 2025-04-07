import { View, Text, Image, Pressable, ScrollView } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { SvgXml } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

const WalletContainer = () => {
  return (
    <View
      style={tw`bg-[#FFFFFF] border flex-row items-center p-[15px] mx-[20px] border-[#00000033] rounded-[20px]`}
    >
      <View style={tw`flex-row items-center gap-[15px] flex-1`}>
        <Image
          source={require('../../../assets/images/african-artwork.jpg')}
          style={tw`w-[62px] h-[57px] rounded-[10px]`}
        />
        <View>
          <Text style={tw`text-[#000000] text-[16px] font-medium`}>The Bleeding Monarch</Text>
          <Text style={tw`text-[#00000080] text-[11px] font-medium`}>21st Feb 2024, 10:20 PM</Text>
        </View>
      </View>

      <Text style={tw`text-[15px] font-medium text-[#000000]`}>+ $35,000</Text>
    </View>
  );
};

const WalletScreen = () => {
  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <Image
        style={tw.style(`w-[130px] h-[30px] mt-[80px] ml-[20px]`)}
        resizeMode="contain"
        source={require('../../../assets/omenai-logo.png')}
      />

      <View
        style={tw`bg-[#000000] rounded-[18px] border border-[#E7E7E7] p-[25px] mx-[20px] mt-[30px]`}
      >
        <View style={tw`flex-row items-center gap-[20px]`}>
          <Text style={tw`text-[19px] text-[#FFFFFF]`}>Available Balance</Text>
          <Ionicons name="eye-outline" color={'#FFFF'} size={30} />
        </View>
        <Text style={tw`text-[30px] text-[#FFFFFF] font-bold mt-[10px]`}>$5,000</Text>

        <View style={tw`mt-[50px] flex-row items-center gap-[20px]`}>
          <View style={tw`flex-1`}>
            <View style={tw`flex-row items-center gap-[20px]`}>
              <Text style={tw`text-[14px] text-[#FFFFFF]`}>Pending Balance</Text>
              <Ionicons name="eye-outline" color={'#FFFF'} size={19} />
            </View>
            <Text style={tw`text-[18px] text-[#FFFFFF] font-bold mt-[5px]`}>$5,000</Text>
          </View>

          <Pressable
            style={tw`justify-center items-center h-[40px] border border-[#FFFFFF] rounded-[18px] px-[15px]`}
          >
            <Text style={tw`text-[14px] text-[#FFFFFF] `}>Withdraw Funds</Text>
          </Pressable>
        </View>
      </View>

      <View style={tw`flex-row gap-[30px] mx-[20px] mt-[40px]`}>
        <Pressable
          style={tw`bg-[#000000] h-[40px] flex-1 rounded-[18px] justify-center items-center px-[15px]`}
        >
          <Text style={tw`text-[14px] text-[#FFFFFF]`}>View Accounts</Text>
        </Pressable>

        <Pressable
          style={tw`border border-[#000000] h-[40px] flex-1 rounded-[18px] justify-center items-center px-[15px]`}
        >
          <Text style={tw`text-[14px] text-[#000000]`}>Add primary Account</Text>
        </Pressable>
      </View>

      <Text style={tw`text-[16px] font-medium text-[#000000] mx-[20px] mt-[40px]`}>
        Transaction History
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={tw`gap-[20px] mt-[25px] mb-[150px]`}>
          <WalletContainer />
          <WalletContainer />
          <WalletContainer />
          <WalletContainer />
          <WalletContainer />
        </View>
      </ScrollView>
    </View>
  );
};

export default WalletScreen;
