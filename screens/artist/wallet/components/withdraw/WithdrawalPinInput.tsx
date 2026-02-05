import React from "react";
import { View, Text, Pressable } from "react-native";
import tw from "twrnc";
import { OtpInput } from "#components/inputs/OtpInput";
import type { OtpInputRef } from "#types/otp";

interface WithdrawalPinInputProps {
  otpRef: React.RefObject<OtpInputRef | null>;
  setWalletPin: (pin: string) => void;
  onForgotPin: () => void;
  loading: boolean;
}

export function WithdrawalPinInput({
  otpRef,
  setWalletPin,
  onForgotPin,
  loading,
}: Readonly<WithdrawalPinInputProps>) {
  return (
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
        disabled={loading}
      />
      <Pressable onPress={onForgotPin} style={tw`mt-2`} disabled={loading}>
        <Text style={tw`text-blue-500 text-center mt-[20px]`}>Forgot PIN?</Text>
      </Pressable>
    </View>
  );
}
