import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import tw from 'twrnc';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import { formatISODate } from 'utils/utils_formatISODate';

const statusColors = {
  FAILED: 'text-[#FF0000]',
  PENDING: 'text-[#007AFF]',
  SUCCESSFUL: 'text-[#008000]',
};

export const TransactionDetailsScreen = ({ route }: { route: any }) => {
  const { transaction } = route.params;

  const status = transaction?.trans_status as keyof typeof statusColors;
  const statusColor = statusColors[status] || 'text-gray-700';

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title="Transaction Details" />

      <ScrollView contentContainerStyle={tw`px-5 pt-6 pb-10`}>
        <View style={tw`bg-white p-5 rounded-2xl shadow-sm border border-gray-200`}>
          <Text style={tw`text-lg font-bold mb-4 text-black`}>Transaction Info</Text>

          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-500 text-sm`}>Transaction ID</Text>
            <Text style={tw`text-base font-semibold text-black`}>{transaction?.trans_id}</Text>
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-500 text-sm`}>Transaction Reference</Text>
            <Text style={tw`text-base font-medium text-black`}>
              {transaction?.trans_flw_ref_id}
            </Text>
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-500 text-sm`}>Amount</Text>
            <Text style={tw`text-base font-semibold text-black`}>
              ${transaction?.trans_amount?.toLocaleString()}
            </Text>
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-500 text-sm`}>Date</Text>
            <Text style={tw`text-base font-medium text-black`}>
              {/* {transaction?.trans_date?.day}/{transaction?.trans_date?.month}/
              {transaction?.trans_date?.year} */}
              {formatISODate(transaction?.createdAt)}
            </Text>
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-500 text-sm`}>Status</Text>
            <Text style={tw`${statusColor} text-base font-bold`}>{status}</Text>
          </View>

          <View>
            <Text style={tw`text-gray-500 text-sm`}>Message</Text>
            <Text style={tw`text-base font-medium text-black`}>
              {status === 'SUCCESSFUL'
                ? 'Your funds have been successfully deposited into your bank account.'
                : status === 'FAILED'
                ? 'The funds transfer was unsuccessful. Please check your bank details or contact support for assistance.'
                : status === 'PENDING' &&
                  'Your funds are on their way to your bank account. This may take a little time—thank you for your patience.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
