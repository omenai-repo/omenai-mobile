import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import tw from 'twrnc';
import { useModalStore } from 'store/modal/modalStore';
import { sendOtpCode } from 'services/wallet/sendOtpCode';
import { verifyOtpCode } from 'services/wallet/verifyOtpCode';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import { Modal } from 'react-native';
import LottieView from 'lottie-react-native';
import loaderAnimation from '../../../assets/other/loader-animation.json';

export const ForgotPinScreen = ({ navigation }: { navigation: any }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadOtp, setLoadOtp] = useState(false);
  const { updateModal } = useModalStore();

  const animation = useRef(null);

  useEffect(() => {
    const autoSendOtp = async () => {
      setLoadOtp(true);
      try {
        const response = await sendOtpCode();
        if (!response?.isOk) {
          updateModal({
            message: response?.message || 'Failed to send OTP',
            showModal: true,
            modalType: 'error',
          });
        }
      } catch {
        updateModal({
          message: 'An error occurred while sending OTP',
          showModal: true,
          modalType: 'error',
        });
      } finally {
        setLoadOtp(false);
      }
    };

    autoSendOtp();
  }, []);

  const handleVerifyOtp = async () => {
    if (!otp) {
      updateModal({
        message: 'Please enter the OTP',
        showModal: true,
        modalType: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOtpCode(otp);
      if (response?.isOk) {
        navigation.navigate('ResetPinScreen');
      } else {
        updateModal({
          message: response?.message || 'Invalid OTP',
          showModal: true,
          modalType: 'error',
        });
      }
    } catch {
      updateModal({
        message: 'An error occurred while verifying OTP',
        showModal: true,
        modalType: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title="Verify OTP" />

      <View style={tw`px-[25px] pt-[40px]`}>
        <Text style={tw`mb-4`}>
          An OTP has been sent to your registered email. Please enter it below:
        </Text>
        <TextInput
          style={tw`border p-3 rounded-lg mb-4`}
          placeholder="Enter OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
        />
        <Pressable
          style={tw`bg-[#000] py-4 rounded-lg ${loading ? 'opacity-50' : ''}`}
          onPress={handleVerifyOtp}
          disabled={loading}
        >
          <Text style={tw`text-white text-center font-bold`}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Text>
        </Pressable>
      </View>
      <Modal visible={loadOtp} transparent animationType="fade">
        <View style={tw.style('flex-1 justify-center items-center bg-black bg-opacity-50')}>
          <LottieView
            autoPlay
            ref={animation}
            style={{
              width: 250,
              height: 250,
            }}
            source={loaderAnimation}
          />
        </View>
      </Modal>
    </View>
  );
};
