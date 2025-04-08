import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import YearDropdown from '../orders/YearDropdown';
import { WalletContainer } from './WalletScreen';

const WalletHistory = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title="Transaction History" />

      <View style={tw`mt-[20px] flex-row items-center mr-[20px]`}>
        <View style={tw`flex-1`} />
        <YearDropdown selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={tw`gap-[20px] mb-[150px]`}>
          <WalletContainer />
          <WalletContainer />
          <WalletContainer />
          <WalletContainer />
          <WalletContainer />
          <WalletContainer />
          <WalletContainer />
          <WalletContainer />
          <WalletContainer />
          <WalletContainer />
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

export default WalletHistory;
