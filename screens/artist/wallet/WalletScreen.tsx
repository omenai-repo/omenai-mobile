import { View, Text, Pressable, RefreshControl } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import { SvgXml } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { arrowUpRightWhite } from "#utils/SvgImages";
import { useNavigation } from "@react-navigation/native";
import { fetchArtistWalletData } from "#services/wallet/fetchArtistWalletData";
import { fetchArtistTransactions } from "#services/wallet/fetchArtistTransactions";
import { useModalStore } from "#store/modal/modalStore";
import { utils_formatPrice } from "#utils/utils_priceFormatter";
import { formatISODate } from "#utils/utils_formatISODate";
import { MotiView } from "moti";

import { PinCreationModal } from "./PinCreationModal";
import { useIsFetching, useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BlurStatusBar from "#components/general/BlurStatusBar";
import { useScrollY } from "#hooks/useScrollY";
import ScrollWrapper from "#components/general/ScrollWrapper";
import FittedBlackButton from "#components/buttons/FittedBlackButton";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { TransactionSkeletonCard } from "#components/skeleton/TransactionSkeletonCard";

export const WalletContainerSkeleton = () => {
  const SkeletonBlock = ({ style }: { style: any }) => (
    <MotiView
      from={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      transition={{ loop: true, type: "timing", duration: 800 }}
      style={[tw`bg-[#E7E7E7] rounded-sm`, style]}
    />
  );
  return (
    <View
      style={tw`bg-white border flex-row items-center p-[15px] mx-[20px] border-[#00000033] rounded-sm`}
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
  isLast,
}: {
  status: "FAILED" | "PENDING" | "SUCCESSFUL";
  dateTime: string;
  amount: number;
  onPress: () => void;
  isLast?: boolean;
}) => {
  const statusConfig = {
    FAILED: {
      color: "#991b1b",
      bgColor: "#fee2e2",
      icon: "close-circle-outline" as const,
      label: "Withdrawal failed",
    },
    PENDING: {
      color: "#92400e",
      bgColor: "#fef3c7",
      icon: "time-outline" as const,
      label: "Withdrawal processing",
    },
    SUCCESSFUL: {
      color: "#065f46",
      bgColor: "#d1fae5",
      icon: "checkmark-circle-outline" as const,
      label: "Withdrawal successful",
    },
  };
  const config = statusConfig[status] ?? statusConfig.SUCCESSFUL;

  return (
    <Pressable
      onPress={onPress}
      style={[
        tw`flex-row items-center px-4 py-3.5`,
        !isLast && tw`border-b border-gray-100`,
      ]}
    >
      {/* Status icon circle */}
      <View
        style={[
          tw`w-[40px] h-[40px] rounded-full items-center justify-center mr-3`,
          { backgroundColor: config.bgColor },
        ]}
      >
        <Ionicons name={config.icon} size={20} color={config.color} />
      </View>

      {/* Label + date */}
      <View style={tw`flex-1`}>
        <Text style={tw`text-[13px] font-semibold text-[#1A1A1A]`}>
          {config.label}
        </Text>
        <Text style={tw`text-[11px] text-gray-400 mt-[2px]`}>
          {formatISODate(dateTime)}
        </Text>
      </View>

      {/* Amount + badge */}
      <View style={tw`items-end`}>
        <Text style={tw`text-sm font-bold text-[#1A1A1A]`}>
          {utils_formatPrice(amount)}
        </Text>
        <View
          style={[
            tw`mt-1 rounded-full px-2 py-[2px]`,
            { backgroundColor: config.bgColor },
          ]}
        >
          <Text
            style={[
              tw`text-[8px] font-semibold uppercase tracking-wide`,
              { color: config.color },
            ]}
          >
            {config.label.replace("Withdrawal ", "")}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const AccountDetailsSkeleton = () => {
  const SkeletonBlock = ({ style }: { style: any }) => (
    <MotiView
      from={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      transition={{ loop: true, type: "timing", duration: 1000 }}
      style={[tw`bg-[#E7E7E7] rounded-sm`, style]}
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
const WALLET_QK = ["wallet", "artist"] as const;
const TXNS_QK = ["wallet", "artist", "txns", { status: "all" }] as const;

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
        updateModal({
          message: "Error fetching wallet data",
          showModal: true,
          modalType: "error",
        });
        throw new Error("wallet fetch failed");
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
      const res = await fetchArtistTransactions({ status: "all" });
      if (!res?.isOk) {
        updateModal({
          message: "Error fetching transactions",
          showModal: true,
          modalType: "error",
        });
        throw new Error("txns fetch failed");
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
      updateModal({
        message: "Please add a primary bank account to make withdrawals",
        showModal: true,
        modalType: "error",
      });
    } else {
      navigation.navigate("WithdrawScreen", { walletData });
    }
  }, [navigation, walletData]);

  const isLoading = walletLoading || txnsLoading;
  const skeletonStyle = tw`bg-[#ffffff20] rounded-[10px]`;

  return (
    <>
      <BlurStatusBar scrollY={scrollY} intensity={80} tint="light" />
      <View style={tw`flex-1 bg-[#F7F7F7]`}>
        <ScrollWrapper
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#000"
              colors={["#000"]}
            />
          }
          onScroll={onScroll}
          style={{ paddingTop: insets.top + 16 }}
        >
          <View>
            {/* Balances card */}
            <View
              style={[
                tw`rounded-sm border p-[25px] mx-[20px] mt-[30px]`,
                { backgroundColor: colors.black, borderColor: "#E7E7E7" },
              ]}
            >
              <View style={tw`gap-[0px]`}>
                <View style={tw`flex-row items-center gap-[20px]`}>
                  <Text style={tw`text-[19px] text-white`}>
                    Available Balance
                  </Text>
                  <Pressable onPress={() => setShowAvailableBalance((p) => !p)}>
                    <Ionicons
                      name={
                        showAvailableBalance ? "eye-outline" : "eye-off-outline"
                      }
                      color={"#fff"}
                      size={25}
                    />
                  </Pressable>
                </View>
                <Text style={tw`text-[10px] text-[#E0E0E0]`}>
                  Funds available for payout
                </Text>
              </View>

              {isLoading ? (
                <View
                  style={tw.style(`h-[30px] w-[150px] mt-[5px]`, skeletonStyle)}
                />
              ) : (
                <Text style={tw`text-[20px] text-white font-bold mt-[5px]`}>
                  {showAvailableBalance
                    ? walletData?.available_balance
                      ? utils_formatPrice(walletData?.available_balance)
                      : "$0"
                    : "****"}
                </Text>
              )}

              <View style={tw`mt-[35px] flex-row items-center gap-[20px]`}>
                <View style={tw`flex-1`}>
                  <View style={tw`flex-row items-center gap-[15px]`}>
                    <Text style={tw`text-[14px] text-white`}>
                      Pending Balance
                    </Text>
                    <Pressable onPress={() => setShowPendingBalance((p) => !p)}>
                      <Ionicons
                        name={
                          showPendingBalance ? "eye-outline" : "eye-off-outline"
                        }
                        color={"#fff"}
                        size={19}
                      />
                    </Pressable>
                  </View>
                  <Text style={tw`text-[10px] text-[#E0E0E0]`}>
                    Funds pending clearance
                  </Text>

                  {isLoading ? (
                    <View
                      style={tw.style(
                        `h-[25px] w-[100px] mt-[5px]`,
                        skeletonStyle,
                      )}
                    />
                  ) : (
                    <Text style={tw`text-[18px] text-white font-bold mt-[5px]`}>
                      {showPendingBalance
                        ? walletData?.pending_balance
                          ? utils_formatPrice(walletData?.pending_balance)
                          : "$0"
                        : "****"}
                    </Text>
                  )}
                </View>

                <FittedBlackButton
                  value="Withdraw Funds"
                  onClick={handleWithdrawPress}
                  isDisabled={isLoading}
                  style={{
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: "white",
                    height: 40,
                    paddingHorizontal: 15,
                  }}
                  textStyle={{ color: "white", fontSize: 12 }}
                />
              </View>
            </View>

            {(() => {
              if (isLoading) {
                return <AccountDetailsSkeleton />;
              }
              if (!walletData?.primary_withdrawal_account) {
                return (
                  <View style={tw`mx-[20px] mt-[40px]`}>
                    <LongBlackButton
                      onClick={() =>
                        navigation.navigate("AddPrimaryAcctScreen", {
                          walletData,
                        })
                      }
                      value="Add primary Account"
                      outline
                    />
                  </View>
                );
              }
              return (
                <View style={tw`mx-[20px] mt-[20px]`}>
                  <View
                    style={tw`bg-white border border-[#00000033] rounded-sm px-[20px] py-[15px] mb-[20px]`}
                  >
                    <View style={tw`flex-row items-center gap-[20px]`}>
                      <Text style={tw`text-[14px] flex-1`}>
                        Account Number:
                      </Text>
                      <Text style={tw`text-[14px] font-bold`}>
                        {walletData?.primary_withdrawal_account?.account_number}
                      </Text>
                    </View>
                    <View
                      style={tw`flex-row items-center gap-[20px] mt-[10px]`}
                    >
                      <Text style={tw`text-[14px] flex-1`}>Bank Name:</Text>
                      <Text style={tw`text-[14px] font-bold`}>
                        {walletData?.primary_withdrawal_account?.bank_name}
                      </Text>
                    </View>
                    <View
                      style={tw`flex-row items-center gap-[20px] mt-[10px] mb-[15px]`}
                    >
                      <Text style={tw`text-[14px] flex-1`}>Account Name:</Text>
                      <Text style={tw`text-[14px] font-bold`}>
                        {walletData?.primary_withdrawal_account?.account_name}
                      </Text>
                    </View>
                  </View>
                  <LongBlackButton
                    onClick={() =>
                      navigation.navigate("AddPrimaryAcctScreen", {
                        walletData,
                      })
                    }
                    value="Change Primary Account"
                    outline
                  />
                </View>
              );
            })()}
          </View>

          {/* Transactions */}
          <View style={tw`flex-1 bg-[#F7F7F7]`}>
            <View
              style={tw`mx-[20px] mt-[30px] pb-[25px] flex-row items-center`}
            >
              <Text style={tw`text-[15px] font-medium flex-1`}>
                Transaction History
              </Text>
              <Pressable
                onPress={() =>
                  navigation.navigate("WalletHistory", { transactions })
                }
                style={tw`flex-row items-center gap-[5px]`}
              >
                <Text style={tw`text-[15px] text-[#3D3D3D] font-semibold`}>
                  Show All
                </Text>
                <SvgXml xml={arrowUpRightWhite} />
              </Pressable>
            </View>

            <View style={tw`flex-1`}>
              {!isLoading ? (
                <View style={tw`gap-[8px] mb-[150px]`}>
                  {(transactions?.length ?? 0) === 0 ? (
                    <View
                      style={tw`flex-1 justify-center items-center mt-[50px]`}
                    >
                      <Text style={tw`text-[16px]`}>No transactions found</Text>
                    </View>
                  ) : (
                    <View
                      style={tw`mx-5 bg-white rounded-md border border-gray-200 overflow-hidden mb-[150px]`}
                    >
                      {transactions
                        ?.sort(
                          (a: any, b: any) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime(),
                        )
                        .slice(0, 5)
                        .map((item: any, index: number, arr: any[]) => (
                          <WalletContainer
                            key={index}
                            status={item.trans_status}
                            amount={item.trans_amount}
                            dateTime={item.createdAt}
                            isLast={index === arr.length - 1}
                            onPress={() =>
                              navigation.navigate("TransactionDetailsScreen", {
                                transaction: item,
                              })
                            }
                          />
                        ))}
                    </View>
                  )}
                </View>
              ) : (
                <TransactionSkeletonCard
                  count={5}
                  style={tw`mx-5 mb-[150px]`}
                />
              )}
            </View>
          </View>

          <PinCreationModal
            visible={showPinModal}
            setVisible={setShowPinModal}
            onClose={() => setShowPinModal(false)}
            walletId={walletData?.wallet_id}
          />
        </ScrollWrapper>
      </View>
    </>
  );
};

export default WalletScreen;
