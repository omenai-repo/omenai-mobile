import React from "react";
import { PayWithFlutterwave } from "flutterwave-react-native";
import FlutterwavePayButton from "#components/payment/FlutterwavePayButton";

export type FlutterwaveRedirectParams = {
  status: "successful" | "cancelled";
  transaction_id?: string;
  tx_ref: string;
};

type FlutterwaveCheckoutButtonProps = {
  txRef: string;
  amount: number;
  authorization: string | undefined;
  customer: {
    email: string;
    name: string;
    phonenumber: string;
  };
  meta: Record<string, string | number>;
  disabled?: boolean;
  onRedirect: (params: FlutterwaveRedirectParams) => void;
};

type CustomBtnProps = {
  readonly onPress: () => void;
  readonly disabled?: boolean;
};

const CustomPayButton = ({ onPress, disabled }: CustomBtnProps) => (
  <FlutterwavePayButton onPress={onPress} disabled={disabled} />
);

export default function FlutterwaveCheckoutButton({
  txRef,
  amount,
  authorization,
  customer,
  meta,
  disabled,
  onRedirect,
}: Readonly<FlutterwaveCheckoutButtonProps>) {
  if (!authorization) {
    return <FlutterwavePayButton onPress={() => {}} disabled />;
  }

  return (
    <PayWithFlutterwave
      onRedirect={onRedirect}
      options={{
        tx_ref: txRef,
        amount,
        currency: "USD",
        authorization,
        customer,
        payment_options: "card",
        meta,
      }}
      customButton={(props) => (
        <CustomPayButton onPress={props.onPress} disabled={disabled} />
      )}
    />
  );
}
