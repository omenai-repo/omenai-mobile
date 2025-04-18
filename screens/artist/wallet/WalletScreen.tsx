import { View, Text, Image, Pressable, ScrollView, RefreshControl } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import tw from 'twrnc';
import { SvgXml } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { arrowUpRightWhite } from 'utils/SvgImages';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Skeleton } from 'moti/skeleton';
import { fetchArtistWalletData } from 'services/wallet/fetchArtistWalletData';
import { set } from 'lodash';
import { fetchArtistTransactions } from 'services/wallet/fetchArtistTransactions';
import { useModalStore } from 'store/modal/modalStore';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import { formatIntlDateTime } from 'utils/utils_formatIntlDateTime';
import { formatISODate } from 'utils/utils_formatISODate';
import { MotiView } from 'moti';
import WithModal from 'components/modal/WithModal';

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
}: {
  status: 'FAILED' | 'PENDING' | 'SUCCESSFUL';
  dateTime: string;
  amount: number;
}) => {
  return (
    <View
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
                ? `text-[#0000FF]`
                : `text-[#008000]`,
            )}
          >{`Withdrawal ${status.toLowerCase()}`}</Text>
          <Text style={tw`text-[#00000080] text-[11px] font-medium`}>
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
            ? `text-[#0000FF]`
            : `text-[#008000]`,
        )}
      >
        {utils_formatPrice(amount)}
      </Text>
    </View>
  );
};

const BtnContainer = ({ label, onPress }: { label: string; onPress: () => void }) => {
  return (
    <Pressable
      onPress={onPress}
      style={tw`border border-[#000000] h-[40px] flex-1 rounded-[18px] justify-center items-center px-[15px]`}
    >
      <Text style={tw`text-[14px] text-[#000000]`}>{label}</Text>
    </Pressable>
  );
};

const WalletScreen = () => {
  const { updateModal } = useModalStore();

  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [walletData, setWalletData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
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

            {isLoading ? (
              <View style={tw.style(`h-[30px] w-[150px] mt-[10px]`, skeletonStyle)} />
            ) : (
              <Text style={tw`text-[30px] text-[#FFFFFF] font-bold mt-[10px]`}>
                {walletData?.available_balance
                  ? utils_formatPrice(walletData?.available_balance)
                  : '$0'}
              </Text>
            )}

            <View style={tw`mt-[50px] flex-row items-center gap-[20px]`}>
              <View style={tw`flex-1`}>
                <View style={tw`flex-row items-center gap-[20px]`}>
                  <Text style={tw`text-[14px] text-[#FFFFFF]`}>Pending Balance</Text>
                  <Ionicons name="eye-outline" color={'#FFFF'} size={19} />
                </View>

                {isLoading ? (
                  <View style={tw.style(`h-[25px] w-[100px] mt-[5px]`, skeletonStyle)} />
                ) : (
                  <Text style={tw`text-[18px] text-[#FFFFFF] font-bold mt-[5px]`}>
                    {walletData?.pending_balance
                      ? utils_formatPrice(walletData?.pending_balance)
                      : '$0'}
                  </Text>
                )}
              </View>

              <Pressable
                style={tw`justify-center items-center h-[40px] border border-[#FFFFFF] rounded-[18px] px-[15px]`}
                disabled={isLoading}
              >
                <Text style={tw`text-[14px] text-[#FFFFFF]`}>Withdraw Funds</Text>
              </Pressable>
            </View>
          </View>

          <View style={tw`flex-row gap-[30px] mx-[20px] mt-[40px]`}>
            {/* <Pressable
          style={tw`bg-[#000000] h-[40px] flex-1 rounded-[18px] justify-center items-center px-[15px]`}
        >
          <Text style={tw`text-[14px] text-[#FFFFFF]`}>View Accounts</Text>
        </Pressable> */}

            {!walletData?.primary_withdrawal_accounts ? (
              <BtnContainer
                onPress={() =>
                  navigation.navigate('AddPrimaryAcctScreen', {
                    walletData,
                  })
                }
                label="Add primary Account"
              />
            ) : (
              <View style={tw`mt-[10px] mx-[20px]`}>
                <Text style={tw`text-[14px] text-[#000000]`}>Account Details</Text>
                <View style={tw`flex-row items-center gap-[20px] mt-[10px]`}>
                  <Text style={tw`text-[14px] text-[#000000]`}>Account Number:</Text>
                  <Text style={tw`text-[14px] text-[#000000] font-bold`}>
                    {walletData?.primary_withdrawal_accounts?.account_number}
                  </Text>
                </View>
                <View style={tw`flex-row items-center gap-[20px] mt-[10px]`}>
                  <Text style={tw`text-[14px] text-[#000000]`}>Bank Name:</Text>
                  <Text style={tw`text-[14px] text-[#000000] font-bold`}>
                    {walletData?.primary_withdrawal_accounts?.bank_name}
                  </Text>
                </View>
                <View style={tw`flex-row items-center gap-[20px] mt-[10px] mb-[20px]`}>
                  <Text style={tw`text-[14px] text-[#000000]`}>Account Name:</Text>
                  <Text style={tw`text-[14px] text-[#000000] font-bold`}>
                    {walletData?.primary_withdrawal_accounts?.account_name}
                  </Text>
                </View>

                <BtnContainer
                  onPress={() => navigation.navigate('AddPrimaryAcctScreen')}
                  label="Edit Account Details"
                />
              </View>
            )}
          </View>

          <View style={tw`mx-[20px] mt-[40px] flex-row items-center`}>
            <Text style={tw`text-[15px] font-medium text-[#000000] flex-1`}>
              Transaction History
            </Text>
            <Pressable
              onPress={() => navigation.navigate('WalletHistory')}
              style={tw`flex-row items-center gap-[5px]`}
            >
              <Text style={tw`text-[15px] text-[#3D3D3D] font-semibold`}>Show All</Text>
              <SvgXml xml={arrowUpRightWhite} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {!isLoading ? (
              <View style={tw`gap-[20px] mt-[25px] mb-[150px]`}>
                {transactions?.length === 0 && (
                  <View style={tw`flex-1 justify-center items-center mt-[50px]`}>
                    <Text style={tw`text-[16px] text-[#000000]`}>No transactions found</Text>
                  </View>
                )}
                {transactions?.length > 0 &&
                  transactions?.map((item: any, index: number) => {
                    return (
                      <WalletContainer
                        key={index}
                        status={item.trans_status}
                        amount={item.trans_amount}
                        dateTime={item.createdAt}
                      />
                    );
                  })}
              </View>
            ) : (
              <View style={tw`mt-[25px] mb-[150px]`}>
                {Array.from({ length: 10 }).map((_, index) => (
                  <View key={index} style={{ marginBottom: 15 }}>
                    <WalletContainerSkeleton />
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </WithModal>
  );
};

export default WalletScreen;
