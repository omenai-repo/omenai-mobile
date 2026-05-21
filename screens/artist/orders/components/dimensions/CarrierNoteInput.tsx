import { Text, TextInput, View } from "react-native";
import React from "react";
import tw from "twrnc";
import { colors } from "#config/colors.config";

const MAX_LENGTH = 80;

type CarrierNoteInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function CarrierNoteInput({
  value,
  onChange,
}: Readonly<CarrierNoteInputProps>) {
  return (
    <View style={tw`mt-6 mx-5`}>
      <TextInput
        value={value}
        onChangeText={onChange}
        maxLength={MAX_LENGTH}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        placeholder="Notes for the courier (Max 80 characters)"
        placeholderTextColor={tw.color("gray-500")}
        style={[
          tw`border border-gray-200 rounded-sm p-3 min-h-[100px] text-sm bg-white`,
          { color: colors.black },
        ]}
      />
      <Text style={tw`text-right text-[10px] text-gray-400 mt-1`}>
        {value.length} / {MAX_LENGTH}
      </Text>
    </View>
  );
}
