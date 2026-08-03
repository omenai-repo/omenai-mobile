import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import FittedBlackButton from "#components/buttons/FittedBlackButton";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { screenName } from "#constants/screenNames.constants";

interface OrderPaymentActionProps {
  availability: boolean;
  payment_information: string;
  order_accepted: string;
  remainingTime: number;
  showBlocker: boolean;
  areFlagsLoading: boolean;
  orderId: string;
}

export const OrderPaymentAction = ({
  availability,
  payment_information,
  order_accepted,
  remainingTime,
  showBlocker,
  areFlagsLoading,
  orderId,
}: Readonly<OrderPaymentActionProps>) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  if (
    !availability ||
    payment_information !== "pending" ||
    order_accepted !== "accepted" ||
    remainingTime <= 0
  ) {
    return null;
  }

  const renderPayButton = () => {
    if (showBlocker) {
      return (
        <FittedBlackButton
          value="Pay now — under maintenance"
          isDisabled
          onClick={() => {}}
          style={{ height: 40 }}
        />
      );
    }

    if (areFlagsLoading) {
      return (
        <View
          style={{
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.black,
            borderRadius: 8,
          }}
        >
          <ActivityIndicator size="small" color="#fff" />
        </View>
      );
    }

    return (
      <FittedBlackButton
        value="Pay now"
        onClick={() =>
          navigation.navigate(screenName.payment, {
            id: orderId,
          })
        }
        style={{ height: 40 }}
      />
    );
  };

  return (
    <>
      {renderPayButton()}
      {showBlocker && (
        <Text style={tw`text-[12px] text-[#666]`}>
          We’re fine-tuning our payment system to resolve a minor issue and
          ensure every transaction remains flawlessly seamless.
        </Text>
      )}
    </>
  );
};
