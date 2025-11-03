import React from "react";
import { Text, View } from "react-native";
import tw from "twrnc";
import { colors } from "config/colors.config";
import RadioButton from "components/general/RadioButton";
import { reasons, ReasonOption } from "constants/deleteAccount.constants";
import DeleteAccountCard from "./DeleteAccountCard";

type DeletionReasonSectionProps = Readonly<{
  selectedReason: string | null;
  onReasonSelect: (id: string) => void;
}>;

export default function DeletionReasonSection({
  selectedReason,
  onReasonSelect,
}: DeletionReasonSectionProps) {
  return (
    <DeleteAccountCard>
      <Text
        style={tw`text-[18px] font-bold mb-1 text-[${colors.primary_black}]`}
      >
        Why are you leaving?
      </Text>
      <Text style={tw`text-[13px] mb-5 text-[${colors.grey}]`}>
        Select any that applies
      </Text>
      <View style={tw`gap-1`}>
        {reasons.map((reason: ReasonOption, index: number) => (
          <React.Fragment key={reason.id}>
            <View
              style={[
                index === 0 && tw`pt-0 pb-2`,
                index === reasons.length - 1 && tw`pt-2 pb-0`,
                index > 0 && index < reasons.length - 1 && tw`py-2`,
              ]}
            >
              <RadioButton
                label={reason.label}
                isSelected={selectedReason === reason.id}
                onPress={() => onReasonSelect(reason.id)}
                size="small"
              />
            </View>
            {index < reasons.length - 1 && (
              <View style={tw`h-px mx-2 bg-[${colors.grey50}]`} />
            )}
          </React.Fragment>
        ))}
      </View>
    </DeleteAccountCard>
  );
}

