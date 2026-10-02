import React from "react";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { PaymentGateway } from "#types/payment";

export interface PaymentGatewayButtonProps {
  gateway: PaymentGateway;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const PaymentGatewayButton = ({
  gateway,
  onPress,
  disabled,
  isLoading,
}: PaymentGatewayButtonProps) => {
  const label =
    gateway === "stripe" ? "Proceed to payment" : "Pay with flutterwave";

  return (
    <LongBlackButton
      value={label}
      onClick={onPress}
      isDisabled={disabled}
      isLoading={isLoading}
    />
  );
};

export default PaymentGatewayButton;
