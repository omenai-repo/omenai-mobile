import { useState, useRef, useCallback } from "react";
import * as WebBrowser from "expo-web-browser";
import { useStripe } from "@stripe/stripe-react-native";
import { createOrderLock } from "#services/commerce/orders/createOrderLock";
import { initializePayment } from "#services/commerce/payment/paymentAdapterService";
import { Analytics } from "#utils/core/analytics";
import { PaymentInitiateParams } from "#types/payment";

export interface UsePaymentAdapterOptions {
  gateway: "stripe" | "flutterwave";
  orderId: string;
  artworkId: string;
  userId: string;
  totalPriceNumber: number;
  sellerDetails: {
    id: string;
    email: string;
    name: string;
  };
  artworkData: {
    title: string;
    price: number;
    shippingFee: number;
    taxFee: number;
  };
  customer: {
    email: string;
    name: string;
    phone?: string;
  };
  onSuccess: (details?: { transactionId?: string; txRef?: string }) => void;
  onCancel: () => void;
  onError: (message: string) => void;
}

const getQueryParam = (url: string, param: string) => {
  const rx = new RegExp("[?&]" + param + "=([^&#]*)", "i");
  const match = rx.exec(url);
  return match ? decodeURIComponent(match[1]) : undefined;
};

export const usePaymentAdapter = ({
  gateway,
  orderId,
  artworkId,
  userId,
  totalPriceNumber,
  sellerDetails,
  artworkData,
  customer,
  onSuccess,
  onCancel,
  onError,
}: UsePaymentAdapterOptions) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [loading, setLoading] = useState(false);
  const [initLoader, setInitLoader] = useState(false);
  const initOnceRef = useRef(false);

  // Initialize payment gateway (mainly for Stripe sheet setup)
  const initializeGateway = useCallback(async () => {
    if (gateway !== "stripe") return;
    if (initOnceRef.current) return;
    initOnceRef.current = true;

    try {
      setInitLoader(true);
      const params: PaymentInitiateParams = {
        gateway: "stripe",
        amount: totalPriceNumber,
        currency: "USD",
        orderId,
        customer,
        metadata: {
          buyer_id: userId,
          buyer_email: customer.email,
          art_id: artworkId,
          seller_email: sellerDetails.email,
          seller_name: sellerDetails.name,
          artwork_name: artworkData.title,
        },
        sellerId: sellerDetails.id,
      };

      const res = await initializePayment(params);

      if (!res.isOk || !res.paymentIntent) {
        initOnceRef.current = false;
        const msg = res.message || "Failed to initialize Stripe Payment Sheet";
        onError(msg);
        return;
      }

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Omenai, Inc.",
        paymentIntentClientSecret: res.paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: { name: customer.name },
        returnURL: "omenaimobile://stripe-redirect",
      });

      if (error) {
        initOnceRef.current = false;
        onError(error.message);
      }
    } catch (e: any) {
      initOnceRef.current = false;
      onError(e.message || "Stripe initialization failed");
    } finally {
      setInitLoader(false);
    }
  }, [
    gateway,
    orderId,
    artworkId,
    userId,
    totalPriceNumber,
    sellerDetails,
    artworkData.title,
    customer,
    initPaymentSheet,
    onError,
  ]);

  const processPayment = useCallback(
    async (txRef?: string, redirectUrl?: string) => {
      setLoading(true);
      try {
        // 1. Acquire Order Lock
        const get_purchase_lock = await createOrderLock(artworkId, userId);
        if (
          !get_purchase_lock?.isOk ||
          get_purchase_lock.data.lock_data.user_id !== userId
        ) {
          onError(
            "A user is currently processing a purchase transaction on this artwork. Please check back in a few minutes.",
          );
          setLoading(false);
          return;
        }

        // 2. Execute Payment based on Gateway
        if (gateway === "stripe") {
          // Ensure initialized
          if (!initOnceRef.current) {
            await initializeGateway();
          }

          const { error } = await presentPaymentSheet();
          if (error) {
            Analytics.track("artwork_purchase_failed", {
              order_id: orderId,
              user_id: userId,
              payment_method: "stripe",
              total_amount: totalPriceNumber,
              error,
              failure_stage: "payment_sheet",
            });
            onCancel();
          } else {
            Analytics.track("artwork_purchase_success", {
              order_id: orderId,
              user_id: userId,
              payment_method: "stripe",
              total_amount: totalPriceNumber,
              pricing_breakdown: {
                artwork_price: artworkData.price,
                shipping: artworkData.shippingFee,
                taxes: artworkData.taxFee,
                total: totalPriceNumber,
              },
            });
            onSuccess();
          }
        } else if (gateway === "flutterwave") {
          if (!txRef || !redirectUrl) {
            onError(
              "Transaction reference and redirect URL are required for Flutterwave payment processing.",
            );
            setLoading(false);
            return;
          }

          const params: PaymentInitiateParams = {
            gateway: "flutterwave",
            amount: totalPriceNumber,
            currency: "USD",
            orderId,
            customer,
            metadata: {
              buyer_id: userId,
              buyer_email: customer.email,
              art_id: artworkId,
              seller_email: sellerDetails.email,
              seller_name: sellerDetails.name,
              seller_id: sellerDetails.id,
              artwork_name: artworkData.title,
              seller_designation: "artist",
            },
          };

          const res = await initializePayment(params, { txRef, redirectUrl });

          if (!res.isOk || !res.url) {
            onError(res.message || "Failed to initiate checkout session.");
            setLoading(false);
            return;
          }

          const result = await WebBrowser.openAuthSessionAsync(
            res.url,
            redirectUrl,
          );

          if (result.type === "success" && result.url) {
            const status = getQueryParam(result.url, "status");
            const transaction_id = getQueryParam(result.url, "transaction_id");
            const transaction_ref =
              getQueryParam(result.url, "tx_ref") || txRef;

            if (status === "successful") {
              Analytics.track("artwork_purchase_success", {
                order_id: orderId,
                user_id: userId,
                payment_method: "flutterwave",
                transaction_id,
                tx_ref: transaction_ref,
                total_amount: totalPriceNumber,
                pricing_breakdown: {
                  artwork_price: artworkData.price,
                  shipping: artworkData.shippingFee,
                  taxes: artworkData.taxFee,
                  total: totalPriceNumber,
                },
              });
              onSuccess({
                transactionId: transaction_id,
                txRef: transaction_ref,
              });
            } else {
              Analytics.track("artwork_purchase_failed", {
                order_id: orderId,
                user_id: userId,
                payment_method: "flutterwave",
                tx_ref: transaction_ref,
                total_amount: totalPriceNumber,
                failure_stage: "cancelled",
              });
              onCancel();
            }
          } else {
            onCancel();
          }
        }
      } catch (e: any) {
        onError(e.message || "An unexpected error occurred during payment");
      } finally {
        setLoading(false);
      }
    },
    [
      gateway,
      orderId,
      artworkId,
      userId,
      totalPriceNumber,
      sellerDetails,
      artworkData,
      customer,
      initializeGateway,
      presentPaymentSheet,
      onSuccess,
      onCancel,
      onError,
    ],
  );

  return {
    initializeGateway,
    processPayment,
    loading,
    initLoader,
  };
};
