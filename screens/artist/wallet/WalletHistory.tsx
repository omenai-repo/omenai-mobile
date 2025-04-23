import { View, Text, ScrollView, useWindowDimensions } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import YearDropdown from '../orders/YearDropdown';
import { WalletContainer } from './WalletScreen';
import { useRoute } from '@react-navigation/native';

const WalletHistory = () => {
  const { height } = useWindowDimensions();
  const { transactions } = useRoute<any>().params;
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
        <View style={tw`gap-[20px] mt-[25px] mb-[150px]`}>
          {transactions?.length > 0 ? (
            transactions?.map((item: any, index: number) => {
              return (
                <WalletContainer
                  key={index}
                  status={item.trans_status}
                  amount={item.trans_amount}
                  dateTime={item.createdAt}
                />
              );
            })
          ) : (
            <View
              style={tw.style(`flex-1 justify-center items-center`, {
                marginTop: height / 5,
              })}
            >
              <Text style={tw`text-[18px] text-[#1A1A1A]000] font-medium`}>
                No transactions found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default WalletHistory;
