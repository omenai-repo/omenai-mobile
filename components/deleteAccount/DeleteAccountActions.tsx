import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { colors } from "config/colors.config";

type DeleteAccountActionsProps = Readonly<{
  onCancel: () => void;
  onContinue: () => void;
  isContinueDisabled: boolean;
}>;

export default function DeleteAccountActions({
  onCancel,
  onContinue,
  isContinueDisabled,
}: DeleteAccountActionsProps) {
  return (
    <View
      style={[
        tw`px-5 pb-8 pt-5 bg-white`,
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 5,
        },
      ]}
    >
      <View style={tw`flex-row gap-3 items-center`}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onCancel}
          style={tw`flex-1 h-[55px] rounded-[95px] items-center justify-center bg-white border border-[${colors.inputBorder}]`}
        >
          <Text
            style={tw`text-[15px] font-semibold text-[${colors.primary_black}]`}
          >
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onContinue}
          disabled={isContinueDisabled}
          style={tw`flex-1 h-[55px] rounded-[95px] items-center justify-center ${
            isContinueDisabled ? `bg-[${colors.grey50}]` : "bg-[#DC2626]"
          }`}
        >
          <Text
            style={tw`text-[15px] font-semibold ${
              isContinueDisabled
                ? `text-[${colors.inputLabel}]`
                : `text-[${colors.white}]`
            }`}
          >
            Continue to delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
