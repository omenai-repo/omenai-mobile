import React from "react";
import { View, TextInput } from "react-native";
import tw from "twrnc";

export const PinDigit = ({
  value,
  onChange,
  inputRef,
  testID,
  inputStyle,
}: {
  value: string;
  onChange: (text: string) => void;
  inputRef: (ref: TextInput | null) => void;
  testID?: string;
  inputStyle: any;
}) => (
  <TextInput
    ref={inputRef}
    style={inputStyle}
    keyboardType="numeric"
    maxLength={1}
    secureTextEntry
    value={value}
    onChangeText={onChange}
    testID={testID}
  />
);

export const PinInputRow = ({
  values,
  refs,
  onChange,
  testPrefix,
  inputStyle,
}: {
  values: string[];
  refs: React.MutableRefObject<(TextInput | null)[]>;
  onChange: (text: string, index: number) => void;
  testPrefix: string;
  inputStyle: any;
}) => (
  <View style={tw`flex-row justify-between`}>
    {values.map((digit, i) => (
      <PinDigit
        key={`${testPrefix}-${i}`}
        inputRef={(ref) => {
          refs.current[i] = ref;
        }}
        value={digit}
        onChange={(text) => onChange(text, i)}
        testID={`${testPrefix}-${i}`}
        inputStyle={inputStyle}
      />
    ))}
  </View>
);
