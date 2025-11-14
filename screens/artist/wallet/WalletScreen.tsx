import { View, Text, Image, Pressable, ScrollView, RefreshControl } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import tw from 'twrnc';
import { SvgXml } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { arrowUpRightWhite } from 'utils/SvgImages';
import { useNavigation } from '@react-navigation/native';
import { fetchArtistWalletData } from 'services/wallet/fetchArtistWalletData';
import { fetchArtistTransactions } from 'services/wallet/fetchArtistTransactions';
import { useModalStore } from 'store/modal/modalStore';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import { formatISODate } from 'utils/utils_formatISODate';
import { MotiView } from 'moti';
import WithModal from 'components/modal/WithModal';
import { PinCreationModal } from './PinCreationModal';
import { useIsFetching, useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BlurStatusBar from 'components/general/BlurStatusBar';
import { useScrollY } from 'hooks/useScrollY';
import ScrollWrapper from 'components/general/ScrollWrapper';

export const WalletContainerSkeleton = () => {
  const SkeletonBlock = ({ style }: { style: any }) => (
    <MotiView
      from={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      transition={{ loop: true, type: 'timing', duration: 800 }}
      style={[tw`bg-[#E7E7E7] rounded-md`, style]}
    />
  );
  return (
    <View
      style={tw`bg-white border flex-row items-center p-[15px] mx-[20px] border-[#00000033] rounded-[20px]`}
    >
      <View style={tw`flex-row items-center gap-[15px] flex-1`}>
        <SkeletonBlock style={tw`w-[50px] h-[50px] rounded-[10px]`} />
        <View style={tw`gap-[5px]`}>
          <SkeletonBlock style={tw`w-[150px] h-[14px]`} />
          <SkeletonBlock style={tw`w-[100px] h-[10px]`} />
        </View>
      </View>
      <SkeletonBlock style={tw`w-[80px] h-[15px]`} />
    </View>
  );
};

export const WalletContainer = ({
  status,
  dateTime,
  amount,
  onPress,
}: {
  status: 'FAILED' | 'PENDING' | 'SUCCESSFUL';
  dateTime: string;
  amount: number;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={tw`bg-white border flex-row items-center p-[15px] mx-[20px] border-[#00000033] rounded-[20px]`}
  >
    <View style={tw`flex-row items-center gap-[15px] flex-1`}>
      <Image
        source={require('../../../assets/images/african-artwork.jpg')}
        style={tw`w-[50px] h-[50px] rounded-[10px]`}
      />
      <View>
        <Text
          style={tw.style(
            `text-[16px] font-medium`,
            status === 'FAILED'
              ? `text-[#FF0000]`
              : status === 'PENDING'
              ? `text-[#007AFF]`
              : `text-[#008000]`,
          )}
        >{`Withdrawal ${status === 'PENDING' ? 'processing' : status.toLowerCase()}`}</Text>
        <Text style={tw`text-[11px] font-medium text-[#1A1A1A]`}>{formatISODate(dateTime)}</Text>
      </View>
    </View>

    <Text
      style={tw.style(
        `text-[15px] font-medium`,
        status === 'FAILED'
          ? `text-[#FF0000]`
          : status === 'PENDING'
          ? `text-[#007AFF]`
          : `text-[#008000]`,
      )}
    >
      {utils_formatPrice(amount)}
    </Text>
  </Pressable>
);

const BtnContainer = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    style={tw`border border-[#000] h-[40px] flex-1 rounded-[18px] justify-center items-center px-[15px]`}
  >
    <Text style={tw`text-[14px] text-[#1A1A1A]`}>{label}</Text>
  </Pressable>
);

const AccountDetailsSkeleton = () => {
  const SkeletonBlock = ({ style }: { style: any }) => (
    <MotiView
      from={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      transition={{ loop: true, type: 'timing', duration: 1000 }}
      style={[tw`bg-[#E7E7E7] rounded-md`, style]}
    />
  );
  return (
    <View style={tw`mx-[20px] mt-[20px]`}>
      <View
        style={tw`bg-white border border-[#00000033] rounded-[20px] px-[20px] py-[15px] mb-[20px]`}
      >
        <SkeletonBlock style={tw`w-[120px] h-[16px] mb-[10px]`} />
        <View style={tw`flex-row items-center gap-[20px] mt-[10px]`}>
          <SkeletonBlock style={tw`flex-1 h-[14px]`} />
          <SkeletonBlock style={tw`w-[100px] h-[14px]`} />
        </View>
      </View>
    </View>
  );
};

// ---------- Query Keys
const WALLET_QK = ['wallet', 'artist'] as const;
const TXNS_QK = ['wallet', 'artist', 'txns', { status: 'all' }] as const;

const WalletScreen = () => {
  const { updateModal } = useModalStore();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { scrollY, onScroll } = useScrollY();

  const [showAvailableBalance, setShowAvailableBalance] = useState(false);
  const [showPendingBalance, setShowPendingBalance] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

  // ---- Wallet
  const {
    data: walletData,
    isLoading: walletLoading,
    refetch: refetchWallet,
  } = useQuery({
    queryKey: WALLET_QK,
    queryFn: async () => {
      const res = await fetchArtistWalletData();
      if (!res?.isOk) {
        updateModal({ message: 'Error fetching wallet data', showModal: true, modalType: 'error' });
        throw new Error('wallet fetch failed');
      }
      return res.data;
    },
    // Keep it fresh but DO respect staleness rules
    staleTime: 15_000, // 15s
    gcTime: 10 * 60_000, // 10m
    refetchOnMount: true, // only if stale
    refetchOnWindowFocus: true, // only if stale
    refetchOnReconnect: true, // only if stale
  });

  const {
    data: transactions,
    isLoading: txnsLoading,
    refetch: refetchTxns,
  } = useQuery({
    queryKey: TXNS_QK,
    queryFn: async () => {
      const res = await fetchArtistTransactions({ status: 'all' });
      if (!res?.isOk) {
        updateModal({
          message: 'Error fetching transactions',
          showModal: true,
          modalType: 'error',
        });
        throw new Error('txns fetch failed');
      }
      return res.data;
    },
    staleTime: 30_000, // 30s
    gcTime: 10 * 60_000, // 10m
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Spinner should reflect only these two queries being (re)fetched

  const isFetchingWallet = useIsFetching({ queryKey: WALLET_QK }) > 0;
  const isFetchingTxns = useIsFetching({ queryKey: TXNS_QK }) > 0;

  const isRefreshing = isFetchingWallet || isFetchingTxns;

  // Pull-to-refresh
  const onRefresh = useCallback(
    () => Promise.all([refetchWallet(), refetchTxns()]),
    [refetchWallet, refetchTxns],
  );

  // show PIN modal when wallet data loads and pin is missing
  useEffect(() => {
    if (walletData && !walletData.wallet_pin) setShowPinModal(true);
  }, [walletData]);

  const handleWithdrawPress = useCallback(() => {
    if (!walletData?.primary_withdrawal_account) {
      navigation.navigate('AddPrimaryAcctScreen', { walletData });
    } else {
      navigation.navigate('WithdrawScreen', { walletData });
    }
  }, [navigation, walletData]);

  const isLoading = walletLoading || txnsLoading;
  const skeletonStyle = tw`bg-[#ffffff20] rounded-[10px]`;

  return (
    <WithModal>
      <BlurStatusBar scrollY={scrollY} intensity={80} tint="light" />
      <View style={tw`flex-1 bg-[#F7F7F7]`}>
        <ScrollWrapper
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#000"
              colors={['#000']}
            />
          }
          onScroll={onScroll}
          style={{ paddingTop: insets.top + 16 }}
        >
          <View>
            {/* <Image
              style={tw.style(`w-[130px] h-[30px] mt-[80px] android:mt-[40px] ml-[20px]`)}
              resizeMode="contain"
              source={require('../../../assets/omenai-logo.png')}
            /> */}

            {/* Balances card */}
            <View
              style={tw`bg-black rounded-[18px] border border-[#E7E7E7] p-[25px] mx-[20px] mt-[30px]`}
            >
              <View style={tw`flex-row items-center gap-[20px]`}>
                <Text style={tw`text-[19px] text-white`}>Available Balance</Text>
                <Pressable onPress={() => setShowAvailableBalance((p) => !p)}>
                  <Ionicons
                    name={showAvailableBalance ? 'eye-outline' : 'eye-off-outline'}
                    color={'#fff'}
                    size={25}
                  />
                </Pressable>
              </View>

              {isLoading ? (
                <View style={tw.style(`h-[30px] w-[150px] mt-[5px]`, skeletonStyle)} />
              ) : (
                <Text style={tw`text-[20px] text-white font-bold mt-[5px]`}>
                  {showAvailableBalance
                    ? walletData?.available_balance
                      ? utils_formatPrice(walletData?.available_balance)
                      : '$0'
                    : '****'}
                </Text>
              )}

              <View style={tw`mt-[35px] flex-row items-center gap-[20px]`}>
                <View style={tw`flex-1`}>
                  <View style={tw`flex-row items-center gap-[15px]`}>
                    <Text style={tw`text-[14px] text-white`}>Pending Balance</Text>
                    <Pressable onPress={() => setShowPendingBalance((p) => !p)}>
                      <Ionicons
                        name={showPendingBalance ? 'eye-outline' : 'eye-off-outline'}
                        color={'#fff'}
                        size={19}
                      />
                    </Pressable>
                  </View>

                  {isLoading ? (
                    <View style={tw.style(`h-[25px] w-[100px] mt-[5px]`, skeletonStyle)} />
                  ) : (
                    <Text style={tw`text-[18px] text-white font-bold mt-[5px]`}>
                      {showPendingBalance
                        ? walletData?.pending_balance
                          ? utils_formatPrice(walletData?.pending_balance)
                          : '$0'
                        : '****'}
                    </Text>
                  )}
                </View>

                <Pressable
                  style={tw`justify-center items-center h-[40px] border border-white rounded-[18px] px-[10px]`}
                  onPress={handleWithdrawPress}
                  disabled={isLoading}
                >
                  <Text style={tw`text-[12px] text-white`}>Withdraw Funds</Text>
                </Pressable>
              </View>
            </View>

            {/* Account card */}
            {isLoading ? (
              <AccountDetailsSkeleton />
            ) : !walletData?.primary_withdrawal_account ? (
              <View style={tw`mx-[20px] mt-[40px]`}>
                <BtnContainer
                  onPress={() => navigation.navigate('AddPrimaryAcctScreen', { walletData })}
                  label="Add primary Account"
                />
              </View>
            ) : (
              <View style={tw`mx-[20px] mt-[20px]`}>
                <View
                  style={tw`bg-white border border-[#00000033] rounded-[20px] px-[20px] pt-[15px] mb-[20px]`}
                >
                  <View style={tw`flex-row items-center gap-[20px]`}>
                    <Text style={tw`text-[14px] flex-1`}>Account Number:</Text>
                    <Text style={tw`text-[14px] font-bold`}>
                      {walletData?.primary_withdrawal_account?.account_number}
                    </Text>
                  </View>
                  <View style={tw`flex-row items-center gap-[20px] mt-[10px]`}>
                    <Text style={tw`text-[14px] flex-1`}>Bank Name:</Text>
                    <Text style={tw`text-[14px] font-bold`}>
                      {walletData?.primary_withdrawal_account?.bank_name}
                    </Text>
                  </View>
                  <View style={tw`flex-row items-center gap-[20px] mt-[10px] mb-[15px]`}>
                    <Text style={tw`text-[14px] flex-1`}>Account Name:</Text>
                    <Text style={tw`text-[14px] font-bold`}>
                      {walletData?.primary_withdrawal_account?.account_name}
                    </Text>
                  </View>
                </View>
                <BtnContainer
                  onPress={() => navigation.navigate('AddPrimaryAcctScreen', { walletData })}
                  label="Change Primary Account"
                />
              </View>
            )}
          </View>

          {/* Transactions */}
          <View style={tw`flex-1 bg-[#F7F7F7]`}>
            <View style={tw`mx-[20px] mt-[30px] pb-[25px] flex-row items-center`}>
              <Text style={tw`text-[15px] font-medium flex-1`}>Transaction History</Text>
              <Pressable
                onPress={() => navigation.navigate('WalletHistory', { transactions })}
                style={tw`flex-row items-center gap-[5px]`}
              >
                <Text style={tw`text-[15px] text-[#3D3D3D] font-semibold`}>Show All</Text>
                <SvgXml xml={arrowUpRightWhite} />
              </Pressable>
            </View>

            <View style={tw`max-h-[400px]`}>
              <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
                {!isLoading ? (
                  <View style={tw`gap-[8px] mb-[150px]`}>
                    {(transactions?.length ?? 0) === 0 ? (
                      <View style={tw`flex-1 justify-center items-center mt-[50px]`}>
                        <Text style={tw`text-[16px]`}>No transactions found</Text>
                      </View>
                    ) : (
                      transactions?.map((item: any, index: number) => (
                        <WalletContainer
                          key={index}
                          status={item.trans_status}
                          amount={item.trans_amount}
                          dateTime={item.createdAt}
                          onPress={() =>
                            navigation.navigate('TransactionDetailsScreen', { transaction: item })
                          }
                        />
                      ))
                    )}
                  </View>
                ) : (
                  <View style={tw`mb-[150px]`}>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <View key={i} style={{ marginBottom: 8 }}>
                        <WalletContainerSkeleton />
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
            </View>
          </View>

          <PinCreationModal
            visible={showPinModal}
            setVisible={setShowPinModal}
            onClose={() => setShowPinModal(false)}
          />
        </ScrollWrapper>
      </View>
    </WithModal>
  );
};

export default WalletScreen;
