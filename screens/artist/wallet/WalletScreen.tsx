import { View, RefreshControl } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import { useNavigation } from "@react-navigation/native";
import { fetchArtistWalletData } from "#services/wallet/fetchArtistWalletData";
import { fetchArtistTransactions } from "#services/wallet/fetchArtistTransactions";
import { useModalStore } from "#store/modal/modalStore";

import { PinCreationModal } from "./PinCreationModal";
import { useIsFetching, useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BlurStatusBar from "#components/general/BlurStatusBar";
import { useScrollY } from "#hooks/useScrollY";
import ScrollWrapper from "#components/general/ScrollWrapper";
import FittedBlackButton from "#components/buttons/FittedBlackButton";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { WalletBalanceItem } from "./components/WalletBalanceItem";
import { PrimaryAccountDetails } from "./components/PrimaryAccountDetails";
import { WalletTransactionSection } from "./components/WalletTransactionSection";
import { AccountDetailsSkeleton } from "./components/WalletSkeletons";

// ---------- Query Keys
const WALLET_QK = ["wallet", "artist"] as const;
const TXNS_QK = ["wallet", "artist", "txns", { status: "all" }] as const;

const WalletScreen = () => {
  const { updateModal } = useModalStore();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { scrollY, onScroll } = useScrollY();

  const [showBalance, setShowBalance] = useState(false);
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
      const res = await fetchArtistTransactions({
        status: "all",
        wallet_id: walletIdentifier,
      });
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
    enabled: !!walletData,
    staleTime: 30_000, // 30s
    gcTime: 10 * 60_000, // 10m
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const walletIdentifier = walletData?.wallet_id || walletData?.walletId;

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
  }, [navigation, walletData, updateModal]);

  const isLoading = walletLoading || txnsLoading;

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
          <View style={tw`px-5`}>
            {/* Balances card */}
            <View
              style={[
                tw`rounded-md border p-5`,
                { backgroundColor: colors.black, borderColor: "#E7E7E7" },
              ]}
            >
              <WalletBalanceItem
                label="Available Balance"
                balance={walletData?.available_balance}
                showBalance={showBalance}
                onToggleVisibility={() => setShowBalance((p: boolean) => !p)}
                isLoading={isLoading}
                isMain
              />

              <View style={tw`mt-[35px] flex-row items-center gap-5`}>
                <WalletBalanceItem
                  label="Pending Balance"
                  balance={walletData?.pending_balance}
                  showBalance={showBalance}
                  isLoading={isLoading}
                  containerStyle={tw`flex-1`}
                />

                <FittedBlackButton
                  value={
                    walletData?.wallet_pin
                      ? "Withdraw Funds"
                      : "Create wallet pin"
                  }
                  onClick={
                    walletData?.wallet_pin
                      ? handleWithdrawPress
                      : () => setShowPinModal(true)
                  }
                  isDisabled={isLoading}
                  style={tw`bg-white px-3`}
                  textStyle={[
                    tw`text-sm tracking-wide`,
                    { color: colors.black },
                  ]}
                />
              </View>
            </View>

            {isLoading ? (
              <AccountDetailsSkeleton />
            ) : !walletData?.primary_withdrawal_account ? (
              <View style={tw`mt-10`}>
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
            ) : (
              <PrimaryAccountDetails
                accountNumber={
                  walletData?.primary_withdrawal_account?.type === "eu"
                    ? walletData?.primary_withdrawal_account?.iban
                    : walletData?.primary_withdrawal_account?.account_number
                }
                accountType={walletData?.primary_withdrawal_account?.type}
                bankName={walletData?.primary_withdrawal_account?.bank_name}
                accountName={
                  walletData?.primary_withdrawal_account?.account_name
                }
                onPressChange={() =>
                  navigation.navigate("AddPrimaryAcctScreen", {
                    walletData,
                  })
                }
              />
            )}
          </View>

          {/* Transactions */}
          <WalletTransactionSection
            transactions={transactions || []}
            isLoading={isLoading}
            onPressShowAll={() =>
              navigation.navigate("WalletHistory", {
                transactions,
                walletId: walletIdentifier,
              })
            }
            onPressTransaction={(item) =>
              navigation.navigate("TransactionDetailsScreen", {
                transaction: item,
              })
            }
          />

          <PinCreationModal
            visible={showPinModal}
            setVisible={setShowPinModal}
            onClose={() => setShowPinModal(false)}
            walletId={walletIdentifier}
          />
        </ScrollWrapper>
      </View>
    </>
  );
};

export default WalletScreen;
