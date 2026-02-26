import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import LongBlackButton from "#components/buttons/LongBlackButton";
import tw from "twrnc";
import { useModalStore } from "#store/modal/modalStore";
import { sendOtpCode } from "#services/wallet/sendOtpCode";
import { verifyOtpCode } from "#services/wallet/verifyOtpCode";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import LottieView from "lottie-react-native";
import loaderAnimation from "../../../assets/other/loader-animation.json";
import { OtpInput } from "#components/inputs/OtpInput";

export const ForgotPinScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const walletId: string = route?.params?.walletId ?? "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadOtp, setLoadOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { updateModal } = useModalStore();
  const otpInputRef = useRef<any>(null);

  const animation = useRef(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    const autoSendOtp = async () => {
      setLoadOtp(true);
      try {
        const response = await sendOtpCode();
        if (!response?.isOk) {
          updateModal({
            message: response?.message || "Failed to send OTP",
            showModal: true,
            modalType: "error",
          });
        } else {
          setCountdown(60);
          // Focus the OTP input when OTP is sent
          setTimeout(() => otpInputRef.current?.focus(), 500);
        }
      } catch {
        updateModal({
          message: "An error occurred while sending OTP",
          showModal: true,
          modalType: "error",
        });
      } finally {
        setLoadOtp(false);
      }
    };

    autoSendOtp();
  }, []);

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      updateModal({
        message: "Please enter the complete 4-digit OTP",
        showModal: true,
        modalType: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOtpCode(otp);
      if (response?.isOk) {
        navigation.navigate("ResetPinScreen", { walletId });
      } else {
        updateModal({
          message: response?.message || "Invalid OTP",
          showModal: true,
          modalType: "error",
        });
        // Clear OTP on error
        otpInputRef.current?.clear();
      }
    } catch {
      updateModal({
        message: "An error occurred while verifying OTP",
        showModal: true,
        modalType: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const resendText = (() => {
    if (loadOtp) return "Sending...";
    if (countdown > 0) return `Resend code in ${countdown}s`;
    return "Didn't receive code? Resend";
  })();

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setLoadOtp(true);
    try {
      const response = await sendOtpCode();
      if (!response?.isOk) {
        updateModal({
          message: response?.message || "Failed to resend OTP",
          showModal: true,
          modalType: "error",
        });
      } else {
        setCountdown(60);
        updateModal({
          message: "New OTP sent successfully",
          showModal: true,
          modalType: "success",
        });
        otpInputRef.current?.clear();
      }
    } catch {
      updateModal({
        message: "Error resending OTP",
        showModal: true,
        modalType: "error",
      });
    } finally {
      setLoadOtp(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title="Verify OTP" />

      <View style={tw`px-[25px] pt-[40px]`}>
        <Text style={tw`mb-6 text-base text-gray-600 text-center`}>
          An OTP has been sent to your registered email. Please enter the
          4-digit code below:
        </Text>

        <View style={tw`my-4 mb-8`}>
          <OtpInput
            ref={otpInputRef}
            numberOfDigits={4}
            onTextChange={setOtp}
            onFilled={(text) => setOtp(text)}
            type="numeric"
            secureTextEntry={true}
            secureTextEntryDelay={1000}
            focusColor="#000000"
            theme={{
              pinCodeContainerStyle: tw`w-14 h-14 border border-gray-400 rounded-md bg-white`,
              pinCodeTextStyle: tw`text-xl text-center`,
              focusedPinCodeContainerStyle: tw`border-black border-2`,
            }}
            disabled={loading}
          />
        </View>

        <LongBlackButton
          value="Verify OTP"
          onClick={handleVerifyOtp}
          isLoading={loading}
          isDisabled={loading || otp.length !== 4}
        />

        <Pressable
          onPress={handleResendOtp}
          style={tw`mt-4`}
          disabled={loadOtp || countdown > 0}
        >
          <Text
            style={[
              tw`text-[#1A1A1A] text-center`,
              countdown > 0 ? tw`text-gray-400` : {},
            ]}
          >
            {resendText}
          </Text>
        </Pressable>
      </View>

      <Modal visible={loadOtp} transparent animationType="fade">
        <View style={tw`flex-1 justify-center items-center bg-white`}>
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
