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
      <Text style={tw`mb-3 text-[13px] font-light text-slate-700`}>
        Security PIN
      </Text>

      <View style={tw`bg-[#f8fafc] rounded-sm p-3 border border-[#e2e8f0]`}>
        <Text style={tw`text-center text-[13px] text-slate-600 mb-4 mt-2`}>
          Enter your 4-digit wallet PIN
        </Text>

        <View style={tw`items-center justify-center`}>
          <OtpInput
            ref={otpRef}
            numberOfDigits={4}
            onTextChange={setWalletPin}
            onFilled={(text) => setWalletPin(text)}
            type="numeric"
            secureTextEntry={true}
            secureTextEntryDelay={1000}
            focusColor="#1e293b" // slate-800 focus equivalent
            theme={{
              containerStyle: tw`gap-3 justify-center`,
              pinCodeContainerStyle: tw`w-12 h-12 border border-[#94a3b8] rounded-sm bg-white`,
              pinCodeTextStyle: tw`text-base font-semibold text-center`,
              focusedPinCodeContainerStyle: tw`border-[#1e293b] border-2`,
            }}
            disabled={loading}
          />
        </View>

        <Pressable
          onPress={onForgotPin}
          style={tw`mt-4 mb-2`}
          disabled={loading}
        >
          <Text style={tw`text-red-600 text-[13px] text-center underline`}>
            Forgot your PIN?
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
