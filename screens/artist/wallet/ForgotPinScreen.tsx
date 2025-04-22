import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import tw from 'twrnc';
import { useModalStore } from 'store/modal/modalStore';
import { sendOtpCode } from 'services/wallet/sendOtpCode';
import { verifyOtpCode } from 'services/wallet/verifyOtpCode';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import LottieView from 'lottie-react-native';
import loaderAnimation from '../../../assets/other/loader-animation.json';
import { OTPInput } from './OTPInput';

export const ForgotPinScreen = ({ navigation }: { navigation: any }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadOtp, setLoadOtp] = useState(false);
  const { updateModal } = useModalStore();
  const otpInputRef = useRef<any>(null);

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
        } else {
          // Focus the OTP input when OTP is sent
          setTimeout(() => otpInputRef.current?.focus(), 500);
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
    if (otp.length !== 6) {
      updateModal({
        message: 'Please enter the complete 6-digit OTP',
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
        // Clear OTP on error
        otpInputRef.current?.clear();
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
        <Text style={tw`mb-6 text-base text-gray-600`}>
          An OTP has been sent to your registered email. Please enter the 6-digit code below:
        </Text>

        <OTPInput ref={otpInputRef} length={4} onChange={setOtp} />

        <Pressable
          style={tw`bg-black py-4 rounded-lg ${loading ? 'opacity-50' : ''}`}
          onPress={handleVerifyOtp}
          disabled={loading || otp.length !== 6}
        >
          <Text style={tw`text-white text-center font-bold`}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Text>
        </Pressable>

        <Pressable
          onPress={async () => {
            setLoadOtp(true);
            try {
              const response = await sendOtpCode();
              if (!response?.isOk) {
                updateModal({
                  message: response?.message || 'Failed to resend OTP',
                  showModal: true,
                  modalType: 'error',
                });
              } else {
                updateModal({
                  message: 'New OTP sent successfully',
                  showModal: true,
                  modalType: 'success',
                });
                otpInputRef.current?.clear();
              }
            } catch {
              updateModal({
                message: 'Error resending OTP',
                showModal: true,
                modalType: 'error',
              });
            } finally {
              setLoadOtp(false);
            }
          }}
          style={tw`mt-4`}
          disabled={loadOtp}
        >
          <Text style={tw`text-[#000] text-center`}>
            {loadOtp ? 'Sending...' : "Didn't receive code? Resend"}
          </Text>
        </Pressable>
      </View>

      <Modal visible={loadOtp} transparent animationType="fade">
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
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
