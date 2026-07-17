import React, { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import FlutterwavePayButton from "#components/payment/FlutterwavePayButton";
import { createFlwCheckoutSession } from "#services/flutterwave/createFlwCheckoutSession";
import { useModalStore } from "#store/modal/modalStore";

export type FlutterwaveRedirectParams = {
  status: "successful" | "cancelled";
  transaction_id?: string;
  tx_ref: string;
};

type FlutterwaveCheckoutButtonProps = {
  txRef: string;
  orderId: string;
  customer: {
    email: string;
    name: string;
    phonenumber: string;
  };
  meta: {
    buyer_id: string;
    buyer_email: string;
    art_id: string;
    seller_email: string;
    seller_name: string;
    seller_id: string;
    artwork_name: string;
    seller_designation: string;
  };
  disabled?: boolean;
  onRedirect: (params: FlutterwaveRedirectParams) => void;
};

const getQueryParam = (url: string, param: string) => {
  const rx = new RegExp("[?&]" + param + "=([^&#]*)", "i");
  const match = rx.exec(url);
  return match ? decodeURIComponent(match[1]) : undefined;
};

export default function FlutterwaveCheckoutButton({
  txRef,
  orderId,
  customer,
  meta,
  disabled,
  onRedirect,
}: Readonly<FlutterwaveCheckoutButtonProps>) {
  const [loading, setLoading] = useState(false);
  const { updateModal } = useModalStore();

  const handlePayPress = async () => {
    try {
      setLoading(true);
      const redirectUrl = "omenaimobile://flutterwave-redirect";
      const res = await createFlwCheckoutSession(
        customer,
        txRef,
        orderId,
        meta,
        redirectUrl,
      );

      if (!res.isOk || !res.url) {
        updateModal({
          message: res.message || "Failed to initiate Flutterwave payment",
          modalType: "error",
          showModal: true,
        });
        return;
      }

      // Open auth session in browser
      const result = await WebBrowser.openAuthSessionAsync(
        res.url,
        redirectUrl,
      );

      if (result.type === "success" && result.url) {
        const status = getQueryParam(result.url, "status") as "successful" | "cancelled" | undefined;
        const transaction_id = getQueryParam(result.url, "transaction_id");
        const tx_ref = getQueryParam(result.url, "tx_ref") || txRef;

        onRedirect({
          status: status === "successful" ? "successful" : "cancelled",
          transaction_id,
          tx_ref,
        });
      } else {
        onRedirect({
          status: "cancelled",
          tx_ref: txRef,
        });
      }
    } catch (error: any) {
      updateModal({
        message: error.message || "An error occurred during payment setup",
        modalType: "error",
        showModal: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlutterwavePayButton
      onPress={handlePayPress}
      disabled={disabled || loading}
      isLoading={loading}
    />
  );
}
