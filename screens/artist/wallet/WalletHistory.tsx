import { View, Text, useWindowDimensions, FlatList, RefreshControl } from 'react-native';
import React, { useMemo, useState } from 'react';
import * as Sentry from '@sentry/react-native';
import tw from 'twrnc';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import YearDropdown from '../orders/YearDropdown';
import { WalletContainer } from './WalletScreen';
import { fetchArtistTransactions } from 'services/wallet/fetchArtistTransactions';
import Loader from 'components/general/Loader';
import { useInfiniteQuery } from '@tanstack/react-query';

const BASE_TXNS_QK = ['wallet', 'artist', 'txns'] as const;
const txnsKey = (year: number) => [...BASE_TXNS_QK, { status: 'all', year }] as const;

const PAGE_SIZE = 10; // assuming API default is 10

const WalletHistory = ({ navigation }: any) => {
  const { height } = useWindowDimensions();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    useInfiniteQuery({
      queryKey: txnsKey(selectedYear),
      queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
        Sentry.addBreadcrumb({
          category: 'network',
          message: `fetchArtistTransactions - start (page ${pageParam}, year ${selectedYear})`,
          level: 'info',
        });

        try {
          const res = await fetchArtistTransactions({
            page: Number(pageParam),
            status: 'all',
            year: String(selectedYear),
          });

          if (!res?.isOk) {
            Sentry.setContext('fetchArtistTransactionsResponse', {
              page: pageParam,
              year: selectedYear,
              responseMessage: res?.message ?? null,
            });
            Sentry.captureMessage(
              `fetchArtistTransactions returned non-ok for year ${selectedYear}, page ${pageParam}`,
              'error',
            );
            throw new Error(res?.message || 'Failed to fetch transactions');
          }

          Sentry.addBreadcrumb({
            category: 'network',
            message: `fetchArtistTransactions - success (page ${pageParam})`,
            level: 'info',
          });

          const items = Array.isArray(res.data) ? res.data : [];
          return {
            items,
            nextPage: items.length === PAGE_SIZE ? Number(pageParam) + 1 : undefined,
          };
        } catch (err: any) {
          Sentry.addBreadcrumb({
            category: 'exception',
            message: `fetchArtistTransactions - exception (page ${pageParam})`,
            level: 'error',
          });
          Sentry.captureException(err);
          throw err;
        }
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage: { nextPage?: number }) => lastPage.nextPage,
      staleTime: 30_000,
      gcTime: 10 * 60_000,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    });

  const transactions = useMemo(() => (data?.pages ?? []).flatMap((p) => p.items), [data]);

  const showEmpty = !isLoading && transactions.length === 0;

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title="Transaction History" />

      <View style={tw`mt-[20px] flex-row items-center mr-[20px]`}>
        <View style={tw`flex-1`} />
        <YearDropdown
          selectedYear={selectedYear}
          setSelectedYear={(y: number) => {
            Sentry.addBreadcrumb({
              category: 'ui',
              message: `YearDropdown changed to ${y}`,
              level: 'info',
            });
            setSelectedYear(y);
          }}
        />
      </View>

      {/* List */}
      {transactions.length > 0 && (
        <FlatList
          data={transactions}
          keyExtractor={(item, index) => `${item.trans_id ?? item.id ?? 'txn'}-${index}`}
          renderItem={({ item }) => (
            <WalletContainer
              status={item.trans_status}
              amount={item.trans_amount}
              dateTime={item.createdAt}
              onPress={() => {
                Sentry.addBreadcrumb({
                  category: 'navigation',
                  message: `TransactionDetails opened for ${item.trans_id ?? item.id}`,
                  level: 'info',
                });
                navigation.navigate('TransactionDetailsScreen', { transaction: item });
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`gap-[8px] pb-[100px]`}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              Sentry.addBreadcrumb({
                category: 'ui',
                message: 'WalletHistory end reached - fetchNextPage',
                level: 'info',
              });
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.6}
          ListFooterComponent={isFetchingNextPage ? <Loader size={200} height={100} /> : null}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isFetchingNextPage}
              onRefresh={() => {
                Sentry.addBreadcrumb({
                  category: 'ui',
                  message: 'WalletHistory pull-to-refresh',
                  level: 'info',
                });
                return refetch();
              }}
              tintColor="#000"
              colors={['#000']}
            />
          }
        />
      )}

      {/* Empty state */}
      {showEmpty && (
        <View
          style={tw.style(`justify-center items-center`, {
            marginTop: height / 4,
          })}
        >
          <Text style={tw`text-[18px] text-[#1A1A1A] font-medium`}>No transactions found</Text>
        </View>
      )}

      {/* Initial loader */}
      {isLoading && transactions.length === 0 && (
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
