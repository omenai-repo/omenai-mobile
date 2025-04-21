import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import tw from 'twrnc';
import { updateWalletPin } from 'services/wallet/updateWalletPin';
import { useModalStore } from 'store/modal/modalStore';
import BackHeaderTitle from 'components/header/BackHeaderTitle';

export const ResetPinScreen = ({ navigation }: { navigation: any }) => {
  const [newPin, setNewPin] = useState<string[]>(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateModal } = useModalStore();

  const newPinRefs = useRef<Array<TextInput | null>>([]);
  const confirmPinRefs = useRef<Array<TextInput | null>>([]);

  const handlePinChange = (
    value: string,
    index: number,
    isConfirm = false,
    keyPress?: 'backspace' | 'input',
  ) => {
    const updated = isConfirm ? [...confirmPin] : [...newPin];
    updated[index] = value;
    isConfirm ? setConfirmPin(updated) : setNewPin(updated);

    const refs = isConfirm ? confirmPinRefs.current : newPinRefs.current;

    if (value && keyPress !== 'backspace' && index < refs.length - 1) {
      refs[index + 1]?.focus();
    } else if (!value && keyPress === 'backspace' && index > 0) {
      refs[index - 1]?.focus();
    }
  };

  const validatePin = (pinArray: string[]) => {
    const pinStr = pinArray.join('');
    for (let i = 0; i < pinStr.length - 1; i++) {
      if (parseInt(pinStr[i]) + 1 === parseInt(pinStr[i + 1])) return false;
    }
    return new Set(pinStr).size === pinStr.length;
  };

  const handleResetPin = async () => {
    const newPinStr = newPin.join('');
    const confirmPinStr = confirmPin.join('');

    if (newPinStr.length !== 4 || confirmPinStr.length !== 4) {
      setError('Please complete the PIN');
      return;
    }

    if (newPinStr !== confirmPinStr) {
      setError('PINs do not match');
      return;
    }

    if (!validatePin(newPin)) {
      setError('PIN cannot be consecutive or repeating numbers');
      return;
    }

    setLoading(true);
    try {
      const response = await updateWalletPin('current_wallet_id', newPinStr);
      if (response.isOk) {
        updateModal({
          message: 'PIN reset successfully',
          showModal: true,
          modalType: 'success',
        });
        navigation.navigate('Wallet');
      } else {
        setError(response.message || 'Failed to reset PIN');
      }
    } catch {
      setError('An error occurred while resetting PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title="Reset Wallet PIN" />

      <View style={tw`mx-[25px]`}>
        <Text style={tw`mb-4 mt-[40px]`}>
          Create a new 4-digit wallet PIN that doesn't contain consecutive or repeating numbers
        </Text>

        <Text style={tw`mb-2`}>Enter new wallet PIN:</Text>
        <View style={tw`flex-row justify-between mb-6`}>
          {newPin.map((digit, i) => (
            <TextInput
              key={`new-${i}`}
              ref={(ref) => (newPinRefs.current[i] = ref)}
              style={tw`w-12 h-12 border rounded text-center text-xl`}
              keyboardType="numeric"
              maxLength={1}
              secureTextEntry
              value={digit}
              onChangeText={(text) => handlePinChange(text, i)}
              onKeyPress={({ nativeEvent }) =>
                handlePinChange(
                  nativeEvent.key === 'Backspace' ? '' : newPin[i],
                  i,
                  false,
                  nativeEvent.key === 'Backspace' ? 'backspace' : 'input',
                )
              }
            />
          ))}
        </View>

        <Text style={tw`mb-2`}>Confirm new wallet PIN:</Text>
        <View style={tw`flex-row justify-between mb-6`}>
          {confirmPin.map((digit, i) => (
            <TextInput
              key={`confirm-${i}`}
              ref={(ref) => (confirmPinRefs.current[i] = ref)}
              style={tw`w-12 h-12 border rounded text-center text-xl`}
              keyboardType="numeric"
              maxLength={1}
              secureTextEntry
              value={digit}
              onChangeText={(text) => handlePinChange(text, i, true)}
              onKeyPress={({ nativeEvent }) =>
                handlePinChange(
                  nativeEvent.key === 'Backspace' ? '' : confirmPin[i],
                  i,
                  true,
                  nativeEvent.key === 'Backspace' ? 'backspace' : 'input',
                )
              }
            />
          ))}
        </View>

        {error ? <Text style={tw`text-red-500 mb-4 text-center`}>{error}</Text> : null}

        <Pressable
          style={tw`bg-[#000] py-4 rounded-lg ${loading ? 'opacity-50' : ''}`}
          onPress={handleResetPin}
          disabled={loading}
        >
          <Text style={tw`text-white text-center font-semibold text-[16px]`}>
            {loading ? 'Processing...' : 'Reset PIN'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
