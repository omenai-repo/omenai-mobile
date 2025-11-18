import React from "react";
import { View } from "react-native";
import FittedBlackButton from "components/buttons/FittedBlackButton";
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
        <FittedBlackButton
          value="Cancel"
          onClick={onCancel}
          style={[
            tw`bg-white border items-center justify-center h-[55px] border-[${colors.inputBorder}] mr-3`,
            { flexGrow: 1, marginRight: 12 },
          ]}
          textStyle={tw`font-semibold text-[${colors.primary_black}]`}
        />
        <FittedBlackButton
          value="Continue to delete"
          onClick={onContinue}
          isDisabled={isContinueDisabled}
          style={[
            tw`${
              isContinueDisabled ? `bg-[${colors.grey50}]` : "bg-[#DC2626]"
            } items-center justify-center h-[55px]`,
            { flexGrow: 1 },
          ]}
          textStyle={tw`font-semibold ${
            isContinueDisabled
              ? `text-[${colors.inputLabel}]`
              : `text-[${colors.white}]`
          }`}
        />
      </View>
    </View>
  );
}
