import { createPaymentIntent } from "#services/stripe/createPaymentIntent";
import { createFlwCheckoutSession } from "#services/flutterwave/createFlwCheckoutSession";
import { PaymentInitiateParams } from "#types/payment";

export interface PaymentInitializationResponse {
  isOk: boolean;
  message?: string;
  paymentIntent?: string; // Stripe specific client_secret
  publishableKey?: string; // Stripe specific publishableKey
  url?: string; // Flutterwave specific checkout redirect URL
}

export const initializePayment = async (
  params: PaymentInitiateParams,
  options?: {
    txRef?: string;
    redirectUrl?: string;
  },
): Promise<PaymentInitializationResponse> => {
  const { gateway, orderId, customer, metadata, sellerId } = params;

  if (gateway === "stripe") {
    if (!sellerId) {
      return {
        isOk: false,
        message: "Seller ID is required for Stripe payments",
      };
    }
    const res = await createPaymentIntent(sellerId, orderId, {
      buyer_id: metadata.buyer_id,
      buyer_email: metadata.buyer_email,
      art_id: metadata.art_id,
      seller_email: metadata.seller_email,
      seller_name: metadata.seller_name,
      seller_id: sellerId,
      artwork_name: metadata.artwork_name,
    });
    return {
      isOk: res.isOk ?? true,
      message: res.body?.message,
      paymentIntent: res.paymentIntent,
      publishableKey: res.publishableKey,
    };
  } else if (gateway === "flutterwave") {
    if (!options?.txRef || !options?.redirectUrl) {
      return {
        isOk: false,
        message:
          "Transaction reference and redirect URL are required for Flutterwave",
      };
    }
    const res = await createFlwCheckoutSession(
      { email: customer.email, name: customer.name },
      options.txRef,
      orderId,
      {
        buyer_id: metadata.buyer_id,
        buyer_email: metadata.buyer_email,
        art_id: metadata.art_id,
        seller_email: metadata.seller_email,
        seller_name: metadata.seller_name,
        seller_id: metadata.seller_id,
        artwork_name: metadata.artwork_name,
        seller_designation: metadata.seller_designation,
      },
      options.redirectUrl,
    );
    return res;
  }

  return { isOk: false, message: `Unsupported payment gateway: ${gateway}` };
};

export interface SubscriptionChargeResponse {
  isOk: boolean;
  message?: string;
  client_secret?: string;
  status?: string;
  paymentIntentId?: string;
  error?: any;
}

export const createSubscriptionCharge = async (
  gateway: "stripe",
  amount: number,
  meta: {
    name: string;
    email: string;
    gallery_id: string;
    plan_id: string;
    plan_interval: string;
  },
): Promise<SubscriptionChargeResponse> => {
  if (gateway === "stripe") {
    const { createStripeTokenizedCharge } = await import(
      "#services/stripe/createStripeTokenizedCharge"
    );
    const res = await createStripeTokenizedCharge(amount, meta);
    if (!res) {
      return { isOk: false, message: "No response from charge creation" };
    }
    return {
      isOk: res.isOk,
      message: res.message || res.body?.message,
      client_secret: res.client_secret,
      status: res.status,
      paymentIntentId: res.paymentIntentId,
      error: res.error,
    };
  }
  return {
    isOk: false,
    message: `Unsupported subscription payment gateway: ${gateway}`,
  };
};
