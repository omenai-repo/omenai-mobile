import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

type PriceStatusNoticeProps = {
  proposedNumber: number;
  recommendedPrice: number;
  autoApproveCap: number;
  hasAutoApprovalsRemaining: boolean;
};

export default function PriceStatusNotice({
  proposedNumber,
  recommendedPrice,
  autoApproveCap,
  hasAutoApprovalsRemaining,
}: Readonly<PriceStatusNoticeProps>) {
  const isBelowMinimum = proposedNumber < recommendedPrice;
  const isWithinVariance =
    proposedNumber >= recommendedPrice && proposedNumber <= autoApproveCap;

  let statusType:
    | "belowMinimum"
    | "withinVariance"
    | "allowanceExhausted"
    | "significantChange";

  switch (true) {
    case isBelowMinimum:
      statusType = "belowMinimum";
      break;
    case isWithinVariance && hasAutoApprovalsRemaining:
      statusType = "withinVariance";
      break;
    case isWithinVariance && !hasAutoApprovalsRemaining:
      statusType = "allowanceExhausted";
      break;
    default:
      statusType = "significantChange";
      break;
  }

  const statusConfig = {
    belowMinimum: {
      iconName: "close-circle-outline",
      iconColor: "#E11D48",
      containerStyle: tw`bg-rose-50 border-rose-200`,
      textStyle: tw`text-rose-800`,
      message: `Price cannot be set lower than the algorithm's baseline recommendation of $${recommendedPrice.toLocaleString()}.`,
    },
    withinVariance: {
      iconName: "checkmark-circle-outline",
      iconColor: "#16A34A",
      containerStyle: tw`bg-green-50 border-green-200`,
      textStyle: tw`text-green-800`,
      message:
        "This price falls within your tier's acceptable variance. It will be auto-approved instantly.",
    },
    allowanceExhausted: {
      iconName: "time-outline",
      iconColor: "#D97706",
      containerStyle: tw`bg-amber-50 border-amber-200`,
      textStyle: tw`text-amber-800`,
      message:
        "You've used all your instant price approvals for this period. To help maintain platform integrity, this price adjustment will now go through a quick review by our Advisory Team.",
    },
    significantChange: {
      iconName: "warning-outline",
      iconColor: "#D97706",
      containerStyle: tw`bg-amber-50 border-amber-200`,
      textStyle: tw`text-amber-800`,
      message:
        "This is a significant change from the baseline. Our Advisory team will review before publishing.",
    },
  } as const;

  const { iconName, iconColor, containerStyle, textStyle, message } =
    statusConfig[statusType];

  return (
    <View
      style={[
        tw`mt-2 p-3 rounded-md border flex-row items-start`,
        containerStyle,
      ]}
    >
      <Ionicons
        name={iconName}
        size={16}
        color={iconColor}
        style={tw`mt-0.5 mr-2`}
      />

      <Text style={[tw`text-xs leading-5 flex-1`, textStyle]}>{message}</Text>
    </View>
  );
}
