import { View, Text, ScrollView, useWindowDimensions, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import YearDropdown from '../orders/YearDropdown';
import { WalletContainer } from './WalletScreen';
import { useRoute } from '@react-navigation/native';
import { fetchArtistTransactions } from 'services/wallet/fetchArtistTransactions';
import Loader from 'components/general/Loader';

const WalletHistory = ({ navigation }: any) => {
  const { height } = useWindowDimensions();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreTransactions = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const response = await fetchArtistTransactions({ page, status: 'all' });

    if (response?.isOk && response.data.length > 0) {
      setTransactions((prev) => [...prev, ...response.data]);
      setPage((prev) => prev + 1);
      setHasMore(response.data.length === 10); // API returns 10 by default
    } else {
      setHasMore(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMoreTransactions();
  }, []);

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title="Transaction History" />

      <View style={tw`mt-[20px] flex-row items-center mr-[20px]`}>
        <View style={tw`flex-1`} />
        <YearDropdown selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
      </View>

      {transactions?.length > 0 && (
        <FlatList
          data={transactions}
          keyExtractor={(item, index) => `${item.trans_id}-${index}`}
          renderItem={({ item }) => (
            <WalletContainer
              status={item.trans_status}
              amount={item.trans_amount}
              dateTime={item.createdAt}
              onPress={() => navigation.navigate('TransactionDetailsScreen', { transaction: item })}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`gap-[8px] pb-[100px]`}
          onEndReached={fetchMoreTransactions}
          onEndReachedThreshold={0.6}
          ListFooterComponent={loading ? <Loader size={200} height={100} /> : null}
        />
      )}

      {transactions?.length === 0 && !loading && (
        <View
          style={tw.style(`justify-center items-center`, {
            marginTop: height / 4,
          })}
        >
          <Text style={tw`text-[18px] text-[#1A1A1A]000] font-medium`}>No transactions found</Text>
        </View>
      )}

      {loading && transactions?.length === 0 && (
        <View
          style={tw.style(`justify-center items-center`, {
            marginTop: height / 4,
          })}
        >
          <Loader size={200} height={100} />
        </View>
      )}
    </View>
  );
};

export default WalletHistory;
