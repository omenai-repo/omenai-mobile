import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import tw from "twrnc";
import { useModalStore } from "store/modal/modalStore";
import { createTransfer } from "services/wallet/createTransfer";
import { getTransferRate } from "services/wallet/getTransferRate";
import BackHeaderTitle from "components/header/BackHeaderTitle";
import { getArtistCurrencySymbol } from "utils/utils_getArtistCurrencySymbol";
import FittedBlackButton from "components/buttons/FittedBlackButton";
import { useQueryClient } from "@tanstack/react-query";
import type { OtpInputRef } from "types/otp";
import { useHighRiskFeatureFlag } from "hooks/useFeatureFlag";
import WithdrawalBlocker from "components/blockers/payments/WithdrawalBlocker";
import { OtpInput } from "components/inputs/OtpInput";
import { AccountRow } from "components/general/AccountRow";

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
  const { width } = useWindowDimensions();
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [rate, setRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadAmount, setLoadAmount] = useState(false);
  const { updateModal } = useModalStore();

  const queryClient = useQueryClient();

  const [walletPin, setWalletPin] = useState("");
  const otpRef = useRef<OtpInputRef>(null);

  const { value: isWalletWithdrawalEnabled } = useHighRiskFeatureFlag(
    "wallet_withdrawal_enabled"
  );

  useEffect(() => {
    if (!amount) {
      setConvertedAmount(0);
      setRate(0);
    }
  }, [amount]);

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

  const handleWithdraw = async () => {
    if (!amount || !walletPin) {
      updateModal({
        message: "Please fill all fields",
        showModal: true,
        modalType: "error",
      });
      return;
    }
    if (walletPin.length !== 4) {
      updateModal({
        message: "PIN must be 4 digits",
        showModal: true,
        modalType: "error",
      });
      return;
    }

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
          message: response.data?.message || "Withdrawal failed",
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

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title="Withdraw Funds" />
      {isWalletWithdrawalEnabled ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={tw`flex-1`}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={tw`flex-1`}
            keyboardShouldPersistTaps="handled"
          >
            <View style={tw`p-[25px]`}>
              <View style={tw`mb-6`}>
                <Text style={tw`mb-2 font-medium`}>
                  Primary Account Details
                </Text>
                <View
                  style={tw`bg-[#FFFFFF] border border-[#00000033] p-4 rounded-[15px] gap-[8px]`}
                >
                  <AccountRow
                    label="Account Number:"
                    value={
                      walletData?.primary_withdrawal_account?.account_number
                    }
                  />
                  <AccountRow
                    label="Bank Name:"
                    value={walletData?.primary_withdrawal_account?.bank_name}
                  />
                  <AccountRow
                    label="Account Name:"
                    value={walletData?.primary_withdrawal_account?.account_name}
                  />
                </View>
              </View>

              <View style={tw`mb-6`}>
                <Text style={tw`mb-2 font-medium`}>Enter Amount</Text>

                {/* You Send */}
                <View
                  style={tw`bg-white border border-[#00000020] rounded-xl p-4`}
                >
                  <Text style={tw`text-sm mb-1 text-gray-600`}>You Send</Text>
                  <TextInput
                    style={tw`py-3 text-base font-bold text-[#1A1A1A]`}
                    keyboardType="decimal-pad"
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0.00"
                  />
                </View>

                {/* Convert Button Centered */}
                <View style={[tw`mt-4`, { marginHorizontal: width / 3.5 }]}>
                  <FittedBlackButton
                    value="Convert"
                    isLoading={loadAmount}
                    isDisabled={!amount ? true : false}
                    onClick={() => amount && fetchTransferRate()}
                    textStyle={{ fontWeight: "600" }}
                  />
                </View>

                {/* You Get */}
                <View
                  style={tw`bg-white border border-[#00000020] rounded-xl p-4 mt-4`}
                >
                  <Text style={tw`text-sm mb-1 text-gray-600`}>You Get</Text>
                  <Text style={tw`text-base font-bold text-[#1A1A1A]`}>
                    {convertedAmount
                      ? `${getArtistCurrencySymbol(
                          walletData.base_currency
                        )} ${convertedAmount.toLocaleString()}`
                      : "--"}
                  </Text>
                </View>

                {rate > 0 && (
                  <Text style={tw`text-xs mt-2 text-gray-500`}>
                    {`Rate: 1 ${
                      walletData.wallet_currency
                    } = ${getArtistCurrencySymbol(
                      walletData.base_currency
                    )} ${rate.toFixed(2)}`}
                  </Text>
                )}
              </View>

              <View style={tw`mb-[50px]`}>
                <Text style={tw`mb-2 font-medium`}>Enter wallet pin</Text>
                <OtpInput
                  ref={otpRef}
                  numberOfDigits={4}
                  onTextChange={setWalletPin}
                  onFilled={(text) => setWalletPin(text)}
                  type="numeric"
                  secureTextEntry={true}
                  secureTextEntryDelay={1000}
                  focusColor="#000000"
                  theme={{
                    pinCodeContainerStyle: tw`w-14 h-14 border border-gray-400 rounded-[15px] bg-white`,
                    pinCodeTextStyle: tw`text-lg text-center`,
                    focusedPinCodeContainerStyle: tw`border-black border-2`,
                  }}
                />
                <Pressable
                  onPress={() => navigation.navigate("ForgotPinScreen")}
                  style={tw`mt-2`}
                >
                  <Text style={tw`text-blue-500 text-center mt-[20px]`}>
                    Forgot PIN?
                  </Text>
                </Pressable>
              </View>
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
      ) : (
        <WithdrawalBlocker
          message="We're working on a brief fix to our wallet system. Withdrawals are temporarily unavailable, but your funds are safe and access will be restored soon."
          onClose={() => navigation.goBack()}
        />
      )}
    </View>
  );
};
