import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import tw from 'twrnc';

type OTPInputProps = {
  length?: number;
  onChange: (otp: string) => void;
};

export const OTPInput = forwardRef(({ length = 6, onChange }: OTPInputProps, ref) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputs = useRef<TextInput[]>([]);

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputs.current[0]) {
        inputs.current[0].focus();
      }
    },
    clear: () => {
      setOtp(Array(length).fill(''));
      onChange('');
      if (inputs.current[0]) {
        inputs.current[0].focus();
      }
    },
  }));

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Combine all OTP digits
    const combinedOtp = newOtp.join('');
    onChange(combinedOtp);

    // Auto focus next input if there's a value
    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    // Auto focus previous input on backspace/delete
    if (!text && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent: { key } }: any, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={tw`flex-row justify-between mb-4`}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(el) => (inputs.current[index] = el as TextInput)}
          style={[
            tw`w-14 h-14 border border-gray-400 rounded-[15px] text-center text-xl bg-[#fff]`,
          ]}
          keyboardType="numeric"
          maxLength={1}
          value={otp[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          selectTextOnFocus
        />
      ))}
    </View>
  );
});
