import { update } from 'lodash';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, Pressable, TextInput } from 'react-native';
import { updateWalletPin } from 'services/wallet/updateWalletPin';
import { useModalStore } from 'store/modal/modalStore';
import tw from 'twrnc';

export const PinCreationModal = ({
  visible,
  onClose,
  setVisible,
}: {
  visible: boolean;
  onClose: () => void;
  setVisible: (visible: boolean) => void;
}) => {
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const pinRefs = useRef<Array<TextInput | null>>([]);
  const confirmPinRefs = useRef<Array<TextInput | null>>([]);

  const { updateModal } = useModalStore();

  useEffect(() => {
    if (!visible) {
      setPin(['', '', '', '']);
      setConfirmPin(['', '', '', '']);
      setError('');
    }
  }, [visible]);

  const handlePinChange = (
    value: string,
    index: number,
    isConfirm = false,
    refs = pinRefs,
    setter = setPin,
    state = pin,
  ) => {
    setError(''); // <-- Clear error on any keypress

    const newArray = [...state];
    newArray[index] = value;
    setter(newArray);

    if (value) {
      if (index < refs.current.length - 1) {
        refs.current[index + 1]?.focus();
      }
    } else {
      if (index > 0) {
        refs.current[index - 1]?.focus();
      }
    }
  };

  const validatePin = (pinArray: string[]) => {
    const pinStr = pinArray.join('');

    // Reject if all digits are the same
    if (new Set(pinStr).size === 1) {
      return false;
    }

    // Check for ascending or descending sequence
    const isAscending = pinStr
      .split('')
      .every((digit, i, arr) => i === 0 || parseInt(digit) === parseInt(arr[i - 1]) + 1);

    const isDescending = pinStr
      .split('')
      .every((digit, i, arr) => i === 0 || parseInt(digit) === parseInt(arr[i - 1]) - 1);

    if (isAscending || isDescending) {
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    const pinStr = pin.join('');
    const confirmPinStr = confirmPin.join('');

    if (pinStr.length !== 4 || confirmPinStr.length !== 4) {
      setError('Please complete the PIN');
      return;
    }

    if (pinStr !== confirmPinStr) {
      setError('PINs do not match');
      return;
    }

    if (!validatePin(pin)) {
      setError('PIN cannot be consecutive or repeating numbers');
      return;
    }

    setLoading(true);
    try {
      const response = await updateWalletPin(pinStr);
      if (response?.isOk) {
        onClose();
        updateModal({
          message: 'PIN set successfully',
          showModal: true,
          modalType: 'success',
        });
      } else {
        setError(response?.message || 'Failed to set PIN');
      }
    } catch {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable
        onPressOut={() => setVisible(false)}
        style={tw`flex-1 justify-center items-center bg-black/50`}
      >
        <Pressable onPress={(e) => e.stopPropagation()} style={tw`bg-white rounded-2xl p-6 w-4/5`}>
          <Text style={tw`text-xl font-bold mb-4`}>Create Wallet PIN</Text>

          <Text style={tw`mb-2`}>Enter new wallet PIN:</Text>
          <View style={tw`flex-row justify-between mb-[40px]`}>
            {pin.map((digit, i) => (
              <TextInput
                key={`pin-${i}`}
                ref={(ref) => (pinRefs.current[i] = ref)}
                style={tw`w-12 h-12 border border-gray-400 rounded-[15px] bg-[#fff] text-center text-xl`}
                keyboardType="numeric"
                maxLength={1}
                secureTextEntry
                value={digit}
                onChangeText={(text) => handlePinChange(text, i, false, pinRefs, setPin, pin)}
              />
            ))}
          </View>

          <Text style={tw`mb-2`}>Confirm wallet PIN:</Text>
          <View style={tw`flex-row justify-between mb-[30px]`}>
            {confirmPin.map((digit, i) => (
              <TextInput
                key={`confirm-${i}`}
                ref={(ref) => (confirmPinRefs.current[i] = ref)}
                style={tw`w-12 h-12 border border-gray-400 rounded-[15px] bg-[#fff] text-center text-xl`}
                keyboardType="numeric"
                maxLength={1}
                secureTextEntry
                value={digit}
                onChangeText={(text) =>
                  handlePinChange(text, i, true, confirmPinRefs, setConfirmPin, confirmPin)
                }
              />
            ))}
          </View>

          {error ? <Text style={tw`text-red-500 mb-4`}>{error}</Text> : null}

          <Pressable
            style={tw`bg-[#000] py-4 rounded-lg ${loading ? 'opacity-50' : ''}`}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={tw`text-white text-center text-[16px]`}>
              {loading ? 'Processing...' : 'Submit'}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
