import React from "react";
import { Text, TextInput, View } from "react-native";
import tw from "twrnc";
import { colors } from "config/colors.config";
import { MAX_MESSAGE_LENGTH } from "constants/deleteAccount.constants";
import DeleteAccountCard from "./DeleteAccountCard";

type OtherMessageInputProps = Readonly<{
  message: string;
  onMessageChange: (text: string) => void;
}>;

export default function OtherMessageInput({
  message,
  onMessageChange,
}: OtherMessageInputProps) {
  return (
    <DeleteAccountCard>
      <Text
        style={tw`text-[15px] font-semibold mb-3 text-[${colors.primary_black}]`}
      >
        Why are you leaving?
      </Text>
      <TextInput
        style={[
          tw`rounded-xl p-4 text-[15px] min-h-[100px] bg-[#FAFAFA]`,
          {
            borderWidth: 1,
            borderColor: message ? colors.primary_black : colors.inputBorder,
          },
        ]}
        placeholder="Write a message here..."
        placeholderTextColor="#858585"
        multiline
        maxLength={MAX_MESSAGE_LENGTH}
        value={message}
        onChangeText={onMessageChange}
        textAlignVertical="top"
      />
      <View style={tw`flex-row justify-between items-center mt-2`}>
        <View style={tw`flex-1`} />
        <Text style={tw`text-[12px] text-[${colors.inputLabel}]`}>
          {message.length}/{MAX_MESSAGE_LENGTH}
        </Text>
      </View>
    </DeleteAccountCard>
  );
}
