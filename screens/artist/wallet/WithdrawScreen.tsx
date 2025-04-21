import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import tw from 'twrnc';
import { useModalStore } from 'store/modal/modalStore';
import { createTransfer } from 'services/wallet/createTransfer';
import { getTransferRate } from 'services/wallet/getTransferRate';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import { getArtistCurrencySymbol } from 'utils/utils_getArtistCurrencySymbol';

export const WithdrawScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { walletData } = route.params;
  const [amount, setAmount] = useState('');
  const [walletPin, setWalletPin] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [rate, setRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const { updateModal } = useModalStore();

  useEffect(() => {
    if (amount) {
      fetchTransferRate();
    }
  }, [amount]);

  const fetchTransferRate = async () => {
    try {
      const response = await getTransferRate({
        source: walletData.base_currency,
        destination: walletData.wallet_currency,
        amount: parseFloat(amount),
      });
      console.log(response);
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
    if (!amount || !walletPin) {
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
        wallet_pin: walletPin,
      };

      const response = await createTransfer(payload);
      console.log(response);
      if (response.isOk) {
        // navigation.navigate('WithdrawalSuccess', {
        //   message: response.message,
        //   data: response.data,
        // });
        updateModal({
          message: 'Withdrawal successful! Funds will be transferred to your account shortly.',
          showModal: true,
          modalType: 'success',
        });
        setTimeout(() => {
          navigation.goBack('WalletScreen');
        }, 2000);
      } else {
        updateModal({
          message: response.message || 'Withdrawal failed',
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
      <View style={tw`p-[25px]`}>
        <View style={tw`mb-6`}>
          <Text style={tw`mb-2`}>Primary Account Details:</Text>
          <View style={tw`bg-[#FFFFFF] border border-[#00000033] p-4 rounded-[15px] gap-[8px]`}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-[14px] text-[#000000] flex-1`}>Account Number:</Text>
              <Text style={tw`text-[14px] text-[#000000] font-bold`}>
                {walletData?.primary_withdrawal_account?.account_number}
              </Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-[14px] text-[#000000] flex-1`}>Bank Name:</Text>
              <Text style={tw`text-[14px] text-[#000000] font-bold`}>
                {walletData?.primary_withdrawal_account?.bank_name}
              </Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-[14px] text-[#000000] flex-1`}>Account Name:</Text>
              <Text style={tw`text-[14px] text-[#000000] font-bold`}>
                {walletData?.primary_withdrawal_account?.account_name}
              </Text>
            </View>
          </View>
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`mb-2`}>{`Amount (${getArtistCurrencySymbol(
            walletData.wallet_currency,
          )}):`}</Text>
          <TextInput
            style={tw`border p-3 rounded-lg`}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
          />
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`mb-2`}>{`You Get (${getArtistCurrencySymbol(
            walletData.base_currency,
          )}):`}</Text>
          <Text style={tw`text-lg font-bold`}>
            {convertedAmount
              ? `${getArtistCurrencySymbol(
                  walletData.base_currency,
                )} ${convertedAmount.toLocaleString()}`
              : '--'}
          </Text>
          {rate > 0 && (
            <Text style={tw`text-gray-500`}>{`Rate: 1 ${
              walletData.wallet_currency
            } = ${getArtistCurrencySymbol(walletData.base_currency)} ${rate.toFixed(2)}`}</Text>
          )}
        </View>

        <View style={tw`mb-6`}>
          <Text style={tw`mb-2`}>Wallet PIN:</Text>
          <TextInput
            style={tw`border p-3 rounded-lg`}
            keyboardType="numeric"
            secureTextEntry
            maxLength={4}
            value={walletPin}
            onChangeText={setWalletPin}
            placeholder="Enter 4-digit PIN"
          />
          <Pressable onPress={() => navigation.navigate('ForgotPinScreen')} style={tw`mt-2`}>
            <Text style={tw`text-[#000] text-[16px]`}>Forgot PIN?</Text>
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
    </View>
  );
};
