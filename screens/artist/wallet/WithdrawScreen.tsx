import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import tw from 'twrnc';
import { useModalStore } from 'store/modal/modalStore';
import { createTransfer } from 'services/wallet/createTransfer';
import { getTransferRate } from 'services/wallet/getTransferRate';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import { getArtistCurrencySymbol } from 'utils/utils_getArtistCurrencySymbol';

export const WithdrawScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { walletData } = route.params;
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [rate, setRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const { updateModal } = useModalStore();

  const [pin, setPin] = useState(['', '', '', '']);
  const pinInputs = useRef<TextInput[]>([]);

  const handlePinChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const updatedPin = [...pin];
      updatedPin[index] = value;
      setPin(updatedPin);

      if (value && index < 3) {
        pinInputs.current[index + 1].focus();
      }

      if (index === 3 && value) {
        // optionally auto-submit
      }
    }
  };

  const walletPin = pin.join('');

  // useEffect(() => {
  //   if (amount) {
  //     fetchTransferRate();
  //   }
  // }, [amount]);

  const fetchTransferRate = async () => {
    try {
      const response = await getTransferRate({
        source: walletData.base_currency,
        destination: walletData.wallet_currency,
        amount: parseFloat(amount),
      });
      if (response.isOk) {
        setConvertedAmount(response.data.source.amount);
        setRate(response.data.rate);
      } else {
        updateModal({
          message: 'Failed to get exchange rate',
          showModal: true,
          modalType: 'error',
        });
      }
    } catch (error) {
      updateModal({
        message: 'Error fetching exchange rate',
        showModal: true,
        modalType: 'error',
      });
    }
  };

  const handleWithdraw = async () => {
    if (!amount || pin.includes('')) {
      updateModal({
        message: 'Please fill all fields',
        showModal: true,
        modalType: 'error',
      });
      return;
    }

    if (walletPin.length !== 4) {
      updateModal({
        message: 'PIN must be 4 digits',
        showModal: true,
        modalType: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        account_details: walletData.primary_withdrawal_account,
        amount: parseFloat(amount),
        currency: 'NGN',
        url: 'https://api.omenai.app/api/webhook/flw-transfer',
        wallet_id: walletData.wallet_id,
        wallet_pin: pin.join(''),
      };

      const response = await createTransfer(payload);
      console.log(response);
      if (response.isOk) {
        navigation.navigate('WithdrawalSuccess');
      } else {
        updateModal({
          message: response.data.message || 'Withdrawal failed',
          showModal: true,
          modalType: 'error',
        });
      }
    } catch (error) {
      updateModal({
        message: 'An error occurred',
        showModal: true,
        modalType: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title="Withdraw Funds" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={tw`flex-1`}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={tw`flex-1`}
          keyboardShouldPersistTaps="handled"
        >
          <View style={tw`p-[25px]`}>
            <View style={tw`mb-6`}>
              <Text style={tw`mb-2 font-medium`}>Primary Account Details</Text>
              <View style={tw`bg-[#FFFFFF] border border-[#00000033] p-4 rounded-[15px] gap-[8px]`}>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-[14px] text-[#1A1A1A]000] flex-1`}>Account Number:</Text>
                  <Text style={tw`text-[14px] text-[#1A1A1A]000] font-bold`}>
                    {walletData?.primary_withdrawal_account?.account_number}
                  </Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-[14px] text-[#1A1A1A]000] flex-1`}>Bank Name:</Text>
                  <Text style={tw`text-[14px] text-[#1A1A1A]000] font-bold`}>
                    {walletData?.primary_withdrawal_account?.bank_name}
                  </Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-[14px] text-[#1A1A1A]000] flex-1`}>Account Name:</Text>
                  <Text style={tw`text-[14px] text-[#1A1A1A]000] font-bold`}>
                    {walletData?.primary_withdrawal_account?.account_name}
                  </Text>
                </View>
              </View>
            </View>

            <View style={tw`mb-6`}>
              <Text style={tw`mb-2 font-medium`}>Enter Amount</Text>

              {/* You Send */}
              <View style={tw`bg-white border border-[#00000020] rounded-xl p-4`}>
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
              <Pressable
                onPress={fetchTransferRate}
                style={tw`mt-4 self-center bg-black px-6 py-3 rounded-full`}
              >
                <Text style={tw`text-white font-semibold`}>Convert</Text>
              </Pressable>

              {/* You Get */}
              <View style={tw`bg-white border border-[#00000020] rounded-xl p-4 mt-4`}>
                <Text style={tw`text-sm mb-1 text-gray-600`}>You Get</Text>
                <Text style={tw`text-base font-bold text-[#1A1A1A]`}>
                  {convertedAmount
                    ? `${getArtistCurrencySymbol(
                        walletData.base_currency,
                      )} ${convertedAmount.toLocaleString()}`
                    : '--'}
                </Text>
              </View>

              {rate > 0 && (
                <Text style={tw`text-xs mt-2 text-gray-500`}>
                  {`Rate: 1 ${walletData.wallet_currency} = ${getArtistCurrencySymbol(
                    walletData.base_currency,
                  )} ${rate.toFixed(2)}`}
                </Text>
              )}
            </View>

            <View style={tw`mb-[50px]`}>
              <Text style={tw`mb-2 font-medium`}>Enter wallet pin</Text>
              <View style={tw`flex-row justify-between gap-2`}>
                {pin.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (pinInputs.current[index] = ref!)}
                    style={tw`w-14 h-14 border border-gray-400 rounded-[15px] text-center text-lg bg-white`}
                    keyboardType="numeric"
                    maxLength={1}
                    secureTextEntry
                    value={digit}
                    onChangeText={(val) => handlePinChange(val, index)}
                    returnKeyType="next"
                  />
                ))}
              </View>
              <Pressable onPress={() => navigation.navigate('ForgotPinScreen')} style={tw`mt-2`}>
                <Text style={tw`text-blue-500 text-center mt-[20px]`}>Forgot PIN?</Text>
              </Pressable>
            </View>

            <Pressable
              style={tw`bg-[#000] py-4 rounded-lg ${loading ? 'opacity-50' : ''}`}
              onPress={handleWithdraw}
              disabled={loading}
            >
              <Text style={tw`text-white text-center font-bold`}>
                {loading ? 'Processing...' : 'Withdraw'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
