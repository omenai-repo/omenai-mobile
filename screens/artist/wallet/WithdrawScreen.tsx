import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import tw from "twrnc";
import { useModalStore } from "#store/modal/modalStore";
import { createTransfer } from "#services/wallet/createTransfer";
import { getTransferRate } from "#services/wallet/getTransferRate";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { useQueryClient } from "@tanstack/react-query";
import type { OtpInputRef } from "#types/otp";
import { useHighRiskFeatureFlag } from "#hooks/useFeatureFlag";
import WithdrawalBlocker from "#components/blockers/payments/WithdrawalBlocker";
import { useFocusEffect } from "@react-navigation/native";
import FormSkeleton from "#components/skeleton/FormSkeleton";
import { PrimaryAccountDetails } from "./components/withdraw/PrimaryAccountDetails";
import { WithdrawalAmountInput } from "./components/withdraw/WithdrawalAmountInput";
import { WithdrawalPinInput } from "./components/withdraw/WithdrawalPinInput";
import WithModal from "#components/modal/WithModal";

const WALLET_QK = ["wallet", "artist"] as const;
const TXNS_QK = ["wallet", "artist", "txns", { status: "all" }] as const;
const BASE_TXNS_QK = ["wallet", "artist", "txns"] as const;

export const WithdrawScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const { walletData } = route.params;
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [rate, setRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadAmount, setLoadAmount] = useState(false);
  const { updateModal } = useModalStore();

  const queryClient = useQueryClient();

  const [walletPin, setWalletPin] = useState("");
  const otpRef = useRef<OtpInputRef>(null);
  const amountInputRef = useRef<TextInput>(null);

  const { value: isWalletWithdrawalEnabled, loading: isFlagLoading } =
    useHighRiskFeatureFlag("wallet_withdrawal_enabled");

  useEffect(() => {
    if (!amount) {
      setConvertedAmount(0);
      setRate(0);
    }
  }, [amount]);

  useFocusEffect(
    React.useCallback(() => {
      // Small delay to ensure screen is fully rendered
      const timer = setTimeout(() => {
        amountInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }, []),
  );

  const fetchTransferRate = async () => {
    try {
      setLoadAmount(true);
      const response = await getTransferRate({
        source: walletData.base_currency,
        destination: walletData.wallet_currency,
        amount: Number.parseFloat(amount),
      });
      if (response.isOk) {
        setConvertedAmount(response.data.source.amount);
        setRate(response.data.rate);
      } else {
        updateModal({
          message: "Failed to get exchange rate",
          showModal: true,
          modalType: "error",
        });
      }
    } catch {
      updateModal({
        message: "Error fetching exchange rate",
        showModal: true,
        modalType: "error",
      });
    } finally {
      setLoadAmount(false);
    }
  };

  const validateWithdrawal = (): boolean => {
    if (!amount || !walletPin) {
      updateModal({
        message: "Please fill all fields",
        showModal: true,
        modalType: "error",
      });
      return false;
    }
    if (walletPin.length !== 4) {
      updateModal({
        message: "PIN must be 4 digits",
        showModal: true,
        modalType: "error",
      });
      return false;
    }
    return true;
  };

  const executeWithdrawal = async () => {
    setLoading(true);
    try {
      const payload = {
        amount: Number.parseFloat(amount),
        url: "https://api.omenai.app/api/webhook/flw-transfer",
        wallet_id: walletData.wallet_id,
        wallet_pin: walletPin,
      };

      const response = await createTransfer(payload);

      if (response.isOk) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: WALLET_QK }),
          queryClient.invalidateQueries({ queryKey: TXNS_QK }),
          queryClient.invalidateQueries({ queryKey: BASE_TXNS_QK }),
        ]);
        navigation.navigate("WithdrawalSuccess");
      } else {
        updateModal({
          message:
            response.message || response.data?.message || "Withdrawal failed",
          showModal: true,
          modalType: "error",
        });
      }
    } catch {
      updateModal({
        message: "An error occurred",
        showModal: true,
        modalType: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (validateWithdrawal()) {
      await executeWithdrawal();
    }
  };

  if (isFlagLoading) {
    return (
      <View style={tw`flex-1 bg-[#F7F7F7]`}>
        <BackHeaderTitle title="Withdraw Funds" />
        <FormSkeleton />
      </View>
    );
  }

  if (isWalletWithdrawalEnabled) {
    return (
      <WithModal>
        <View style={tw`flex-1 bg-[#F7F7F7]`}>
          <BackHeaderTitle title="Withdraw Funds" />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={tw`flex-1`}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={tw`flex-1`}
              contentContainerStyle={[
                tw`flex-grow`,
                Platform.OS === "android" && tw`pb-[150px]`,
              ]}
              keyboardShouldPersistTaps="handled"
            >
              <View style={tw`p-[25px]`}>
                <PrimaryAccountDetails walletData={walletData} />

                <WithdrawalAmountInput
                  amount={amount}
                  setAmount={setAmount}
                  convertedAmount={convertedAmount}
                  rate={rate}
                  loading={loading}
                  loadAmount={loadAmount}
                  fetchTransferRate={fetchTransferRate}
                  amountInputRef={amountInputRef}
                  walletData={walletData}
                />

                <WithdrawalPinInput
                  otpRef={otpRef}
                  setWalletPin={setWalletPin}
                  onForgotPin={() => navigation.navigate("ForgotPinScreen")}
                  loading={loading}
                />

                <Pressable
                  style={tw`bg-[#000] py-4 rounded-lg mb-[100px] ${
                    loading ? "opacity-50" : ""
                  }`}
                  onPress={handleWithdraw}
                  disabled={loading}
                >
                  <Text style={tw`text-white text-center font-bold`}>
                    {loading ? "Processing..." : "Withdraw"}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </WithModal>
    );
  }

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title="Withdraw Funds" />
      <WithdrawalBlocker
        message="We're working on a brief fix to our wallet system. Withdrawals are temporarily unavailable, but your funds are safe and access will be restored soon."
        onClose={() => navigation.goBack()}
      />
    </View>
  );
};
