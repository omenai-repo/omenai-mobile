import { View, Text, Image, Pressable, ScrollView, RefreshControl } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import tw from 'twrnc';
import { SvgXml } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { arrowUpRightWhite } from 'utils/SvgImages';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { fetchArtistWalletData } from 'services/wallet/fetchArtistWalletData';
import { fetchArtistTransactions } from 'services/wallet/fetchArtistTransactions';
import { useModalStore } from 'store/modal/modalStore';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import { formatISODate } from 'utils/utils_formatISODate';
import { MotiView } from 'moti';
import WithModal from 'components/modal/WithModal';
import { PinCreationModal } from './PinCreationModal';

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
      style={tw`bg-[#FFFFFF] border flex-row items-center p-[15px] mx-[20px] border-[#00000033] rounded-[20px]`}
    >
      <View style={tw`flex-row items-center gap-[15px] flex-1`}>
        {/* Image placeholder */}
        <SkeletonBlock style={tw`w-[50px] h-[50px] rounded-[10px]`} />

        {/* Text placeholders */}
        <View style={tw`gap-[5px]`}>
          <SkeletonBlock style={tw`w-[150px] h-[14px]`} />
          <SkeletonBlock style={tw`w-[100px] h-[10px]`} />
        </View>
      </View>

      {/* Amount placeholder */}
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
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={tw`bg-[#FFFFFF] border flex-row items-center p-[15px] mx-[20px] border-[#00000033] rounded-[20px]`}
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
          <Text style={tw`text-[#1A1A1A]00080] text-[11px] font-medium`}>
            {formatISODate(dateTime)}
          </Text>
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
};

const BtnContainer = ({ label, onPress }: { label: string; onPress: () => void }) => {
  return (
    <Pressable
      onPress={onPress}
      style={tw`border border-[#000000] h-[40px] flex-1 rounded-[18px] justify-center items-center px-[15px]`}
    >
      <Text style={tw`text-[14px] text-[#1A1A1A]]`}>{label}</Text>
    </Pressable>
  );
};

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
        style={tw`bg-[#FFFFFF] border border-[#00000033] rounded-[20px] px-[20px] py-[15px] mb-[20px]`}
      >
        <SkeletonBlock style={tw`w-[120px] h-[16px] mb-[10px]`} />

        <View style={tw`flex-row items-center gap-[20px] mt-[10px]`}>
          <SkeletonBlock style={tw`flex-1 h-[14px]`} />
          <SkeletonBlock style={tw`w-[100px] h-[14px]`} />
        </View>

        {/* <View style={tw`flex-row items-center gap-[20px] mt-[10px]`}>
          <SkeletonBlock style={tw`flex-1 h-[14px]`} />
          <SkeletonBlock style={tw`w-[100px] h-[14px]`} />
        </View>

        <View style={tw`flex-row items-center gap-[20px] mt-[10px] mb-[20px]`}>
          <SkeletonBlock style={tw`flex-1 h-[14px]`} />
          <SkeletonBlock style={tw`w-[120px] h-[14px]`} />
        </View> */}
      </View>

      {/* <SkeletonBlock style={tw`h-[40px] rounded-[18px]`} /> */}
    </View>
  );
};

const WalletScreen = () => {
  const { updateModal } = useModalStore();

  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [walletData, setWalletData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showAvailableBalance, setShowAvailableBalance] = useState(false);
  const [showPendingBalance, setShowPendingBalance] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

  useEffect(() => {
    if (walletData && !walletData.wallet_pin) {
      setShowPinModal(true);
    }
  }, [walletData]);

  // Update the withdraw button press handler
  const handleWithdrawPress = () => {
    if (!walletData?.primary_withdrawal_account) {
      navigation.navigate('AddPrimaryAcctScreen', { walletData });
    } else {
      navigation.navigate('WithdrawScreen', { walletData });
    }
  };

  useEffect(() => {
    handleWalletData();
  }, []);

  const handleWalletData = async () => {
    try {
      setIsLoading(true);
      const [response1, response2] = await Promise.all([
        fetchArtistWalletData(),
        fetchArtistTransactions({ status: 'all' }),
      ]);
      // console.log({ response1, response2 });
      setIsLoading(false);
      if (response1?.isOk) {
        setWalletData(response1?.data);
      } else {
        updateModal({
          message: 'Error fetching wallet data',
          showModal: true,
          modalType: 'error',
        });
      }
      if (response2?.isOk) {
        setTransactions(response2?.data);
      } else {
        updateModal({
          message: 'Error fetching transactions',
          showModal: true,
          modalType: 'error',
        });
      }
    } catch (error) {
      updateModal({
        message: 'Error fetching wallet data',
        showModal: true,
        modalType: 'error',
      });
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await handleWalletData();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      handleRefresh(); // Auto refresh when screen gains focus
    }, []),
  );

  const skeletonStyle = tw`bg-[#ffffff20] rounded-[10px]`;

  return (
    <WithModal>
      <View style={tw`flex-1 bg-[#F7F7F7]`}>
        <View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          >
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
                <Pressable onPress={() => setShowAvailableBalance((prev) => !prev)}>
                  <Ionicons
                    name={showAvailableBalance ? 'eye-outline' : 'eye-off-outline'}
                    color={'#FFFFFF'}
                    size={30}
                  />
                </Pressable>
              </View>

              {isLoading ? (
                <View style={tw.style(`h-[30px] w-[150px] mt-[5px]`, skeletonStyle)} />
              ) : (
                <Text style={tw`text-[30px] text-[#FFFFFF] font-bold mt-[5px]`}>
                  {showAvailableBalance
                    ? walletData?.available_balance
                      ? utils_formatPrice(walletData?.available_balance)
                      : '$0'
                    : '****'}
                </Text>
              )}

              <View style={tw`mt-[35px] flex-row items-center gap-[20px]`}>
                <View style={tw`flex-1`}>
                  <View style={tw`flex-row items-center gap-[20px]`}>
                    <Text style={tw`text-[14px] text-[#FFFFFF]`}>Pending Balance</Text>
                    <Pressable onPress={() => setShowPendingBalance((prev) => !prev)}>
                      <Ionicons
                        name={showPendingBalance ? 'eye-outline' : 'eye-off-outline'}
                        color={'#FFFFFF'}
                        size={19}
                      />
                    </Pressable>
                  </View>

                  {isLoading ? (
                    <View style={tw.style(`h-[25px] w-[100px] mt-[5px]`, skeletonStyle)} />
                  ) : (
                    <Text style={tw`text-[18px] text-[#FFFFFF] font-bold mt-[5px]`}>
                      {showPendingBalance
                        ? walletData?.pending_balance
                          ? utils_formatPrice(walletData?.pending_balance)
                          : '$0'
                        : '****'}
                    </Text>
                  )}
                </View>

                <Pressable
                  style={tw`justify-center items-center h-[40px] border border-[#FFFFFF] rounded-[18px] px-[15px]`}
                  onPress={handleWithdrawPress}
                  disabled={isLoading}
                >
                  <Text style={tw`text-[14px] text-[#FFFFFF]`}>Withdraw Funds</Text>
                </Pressable>
              </View>
            </View>

            {isLoading ? (
              <AccountDetailsSkeleton />
            ) : !walletData?.primary_withdrawal_account ? (
              <View style={tw`mx-[20px] mt-[40px]`}>
                <BtnContainer
                  onPress={() =>
                    navigation.navigate('AddPrimaryAcctScreen', {
                      walletData,
                    })
                  }
                  label="Add primary Account"
                />
              </View>
            ) : (
              <View style={tw`mx-[20px] mt-[20px]`}>
                <View
                  style={tw`bg-[#FFFFFF] border border-[#00000033] rounded-[20px] px-[20px] pt-[15px] mb-[20px]`}
                >
                  <View style={tw`flex-row items-center gap-[20px]`}>
                    <Text style={tw`text-[14px] text-[#1A1A1A]000] flex-1`}>Account Number:</Text>
                    <Text style={tw`text-[14px] text-[#1A1A1A]000] font-bold`}>
                      {walletData?.primary_withdrawal_account?.account_number}
                    </Text>
                  </View>
                  <View style={tw`flex-row items-center gap-[20px] mt-[10px]`}>
                    <Text style={tw`text-[14px] text-[#1A1A1A]000] flex-1`}>Bank Name:</Text>
                    <Text style={tw`text-[14px] text-[#1A1A1A]000] font-bold`}>
                      {walletData?.primary_withdrawal_account?.bank_name}
                    </Text>
                  </View>
                  <View style={tw`flex-row items-center gap-[20px] mt-[10px] mb-[15px]`}>
                    <Text style={tw`text-[14px] text-[#1A1A1A]000] flex-1`}>Account Name:</Text>
                    <Text style={tw`text-[14px] text-[#1A1A1A]000] font-bold`}>
                      {walletData?.primary_withdrawal_account?.account_name}
                    </Text>
                  </View>
                </View>
                <BtnContainer
                  onPress={() =>
                    navigation.navigate('AddPrimaryAcctScreen', {
                      walletData,
                    })
                  }
                  label="Change Primary Account"
                />
              </View>
            )}
          </ScrollView>
        </View>
        <View style={tw`flex-1 bg-[#F7F7F7]`}>
          <View style={tw`mx-[20px] mt-[30px] pb-[25px] flex-row items-center`}>
            <Text style={tw`text-[15px] font-medium text-[#1A1A1A]000] flex-1`}>
              Transaction History
            </Text>
            <Pressable
              onPress={() =>
                navigation.navigate('WalletHistory', {
                  transactions,
                })
              }
              style={tw`flex-row items-center gap-[5px]`}
            >
              <Text style={tw`text-[15px] text-[#3D3D3D] font-semibold`}>Show All</Text>
              <SvgXml xml={arrowUpRightWhite} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {!isLoading ? (
              <View style={tw`gap-[8px] mb-[150px]`}>
                {transactions?.length === 0 ? (
                  <View style={tw`flex-1 justify-center items-center mt-[50px]`}>
                    <Text style={tw`text-[16px] text-[#1A1A1A]000]`}>No transactions found</Text>
                  </View>
                ) : (
                  transactions?.length > 0 &&
                  transactions?.map((item: any, index: number) => {
                    return (
                      <WalletContainer
                        key={index}
                        status={item.trans_status}
                        amount={item.trans_amount}
                        dateTime={item.createdAt}
                        onPress={() =>
                          navigation.navigate('TransactionDetailsScreen', {
                            transaction: item,
                          })
                        }
                      />
                    );
                  })
                )}
              </View>
            ) : (
              <View style={tw`mb-[150px]`}>
                {Array.from({ length: 10 }).map((_, index) => (
                  <View key={index} style={{ marginBottom: 8 }}>
                    <WalletContainerSkeleton />
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
        <PinCreationModal
          visible={showPinModal}
          setVisible={setShowPinModal}
          onClose={() => setShowPinModal(false)}
        />
      </View>
    </WithModal>
  );
};

export default WalletScreen;
