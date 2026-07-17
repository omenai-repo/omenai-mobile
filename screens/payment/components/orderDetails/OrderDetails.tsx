import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { colors } from "config/colors.config";
import BackHeaderTitle from "components/header/BackHeaderTitle";
import LongBlackButton from "components/buttons/LongBlackButton";
import { utils_formatPrice } from "utils/utils_priceFormatter";
import { utils_calculatePurchaseGrandTotalNumber } from "utils/utils_calculatePurchaseGrandTotal";
import { Feather } from "@expo/vector-icons";
import { useAppStore } from "store/app/appStore";
import { createOrderLock } from "services/orders/createOrderLock";
import { useModalStore } from "store/modal/modalStore";
import { useStripe } from "@stripe/stripe-react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";
import { createPaymentIntent } from "services/stripe/createPaymentIntent";
import Loader from "components/general/Loader";
import ScrollWrapper from "components/general/ScrollWrapper";
import { PayWithFlutterwave } from "flutterwave-react-native";
import FlutterwavePayButton from "components/payment/FlutterwavePayButton";
import { useQueryClient } from "@tanstack/react-query";
import VerifyTransactionModal from "../success/VerifyTransactionModal";
import * as Crypto from "expo-crypto";

interface RedirectParams {
  status: "successful" | "cancelled";
  transaction_id?: string;
  tx_ref: string;
}

export default function OrderDetails({
  data,
  locked,
}: {
  readonly data: CreateOrderModelTypes & {
    readonly createdAt: string;
    readonly updatedAt: string;
  };
  readonly locked: boolean;
}) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const queryClient = useQueryClient();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [verifyState, setVerifyState] = useState<{
    visible: boolean;
    txId?: string | null;
  }>({
    visible: false,
  });

  const [loading, setLoading] = useState(false);
  const [mainPageLoader, setMainPageLoader] = useState(false);
  const { userSession } = useAppStore();
  const { updateModal } = useModalStore();

  const transactionRef = useMemo(() => `flw_tx_ref_${Crypto.randomUUID()}`, []);

  // --- prevent double init of Stripe sheet
  const initOnceRef = useRef(false);

  const feesNum = Number(
    typeof data.shipping_details.shipment_information.quote.fees === "string"
      ? JSON.parse(data.shipping_details.shipment_information.quote.fees)
      : data.shipping_details.shipment_information.quote.fees
  );
  const taxesNum = Number(
    typeof data.shipping_details.shipment_information.quote.taxes === "string"
      ? JSON.parse(data.shipping_details.shipment_information.quote.taxes)
      : data.shipping_details.shipment_information.quote.taxes
  );

  const total_price_number = utils_calculatePurchaseGrandTotalNumber(
    data.artwork_data.pricing.usd_price,
    String(feesNum),
    String(taxesNum)
  );

  const fetchPaymentSheetParams = React.useCallback(async () => {
    const { paymentIntent, publishableKey } = await createPaymentIntent(
      Math.ceil(total_price_number * 100) / 100,
      data.seller_details.id,
      {
        buyer_email: userSession.email,
        buyer_id: userSession.id,
        art_id: data.artwork_data.art_id,
        seller_email: data.seller_details.email,
        seller_name: data.seller_details.name,
        seller_id: data.seller_details.id,
        shipping_cost: feesNum,
        unit_price: data.artwork_data.pricing.usd_price,
        artwork_name: data.artwork_data.title,
        tax_fees: taxesNum,
      }
    );
    return { paymentIntent, publishableKey };
  }, [total_price_number, data, userSession, feesNum, taxesNum]);

  const initializePaymentSheet = React.useCallback(async () => {
    if (initOnceRef.current) return; // guard
    initOnceRef.current = true;

    setMainPageLoader(true);
    const { paymentIntent } = await fetchPaymentSheetParams();
    console.log("payment intent ---- ", paymentIntent);

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Omenai, Inc.",
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: { name: userSession.name },
      returnURL: "omenaimobile://stripe-redirect",
    });

    if (error) {
      initOnceRef.current = false; // allow retry if init failed
      console.log("Failed to init payment  --- ", error);
      updateModal({
        message: error.message,
        modalType: "error",
        showModal: true,
      });
      setTimeout(() => navigation.goBack(), 3500);
    } else {
      setMainPageLoader(false);
    }
  }, [
    fetchPaymentSheetParams,
    initPaymentSheet,
    navigation,
    setMainPageLoader,
    userSession.name,
    updateModal,
  ]);

  const invalidateOrdersEverywhere = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["orders", userSession.id],
    });
    await queryClient.invalidateQueries({
      queryKey: ["artwork", data.artwork_data.title],
    });
  };

  const goToSuccessAndRefreshOrders = async () => {
    await invalidateOrdersEverywhere();
    navigation.navigate(screenName.successOrderPayment);
  };

  const goToCancelAndBack = () => {
    navigation.goBack();
    navigation.navigate(screenName.cancleOrderPayment, {
      art_id: data.artwork_data.art_id,
    });
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      console.log(
        "present payment sheet error ----",
        JSON.stringify(error, null, 2)
      );
      goToCancelAndBack();
    } else {
      await goToSuccessAndRefreshOrders();
    }
    setLoading(false);
  };

  useEffect(() => {
    // Auto-init Stripe for gallery sellers (once)
    if (data.seller_designation === "gallery") {
      initializePaymentSheet();
    }
  }, [data.seller_designation, initializePaymentSheet]);

  async function handleClickPayNow() {
    try {
      setLoading(true);
      // ensure sheet is ready (idempotent)
      await initializePaymentSheet();

      const get_purchase_lock = await createOrderLock(
        data.artwork_data.art_id,
        userSession.id
      );
      if (get_purchase_lock?.isOk) {
        if (get_purchase_lock.data.lock_data.user_id === userSession.id) {
          await openPaymentSheet();
        } else {
          throwError(
            "A user is currently processing a purchase transaction on this artwork. Please check back in a few minutes for a status update"
          );
        }
      }
    } finally {
      setLoading(false);
    }
  }

  const throwError = (message: string) => {
    updateModal({ message, modalType: "error", showModal: true });
  };

  // Flutterwave handler — also refresh Orders on success
  const handleOnRedirect = async (p: RedirectParams) => {
    if (p.status === "successful") {
      setVerifyState({ visible: true, txId: p.transaction_id ?? null });
    } else {
      goToCancelAndBack();
    }
  };

  if (mainPageLoader)
    return (
      <View style={{ flex: 1 }}>
        <BackHeaderTitle title="Confirm order details" />
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
          }}
        >
          <Loader />
          <Text style={{ fontSize: 16 }}>Initializing Payment ...</Text>
        </View>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <BackHeaderTitle title="Confirm order details" />
      <ScrollWrapper style={styles.container}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>Summary</Text>

          <View style={styles.priceListing}>
            <View style={styles.priceListingItem}>
              <Text style={{ fontSize: 14, color: "#616161", flex: 1 }}>
                Price
              </Text>
              <Text
                style={{ fontSize: 14, fontWeight: "500", color: "#616161" }}
              >
                {utils_formatPrice(data.artwork_data.pricing.usd_price)}
              </Text>
            </View>
            <View style={styles.priceListingItem}>
              <Text style={{ fontSize: 14, color: "#616161", flex: 1 }}>
                Shipping
              </Text>
              <Text
                style={{ fontSize: 14, fontWeight: "500", color: "#616161" }}
              >
                {utils_formatPrice(feesNum)}
              </Text>
            </View>
            <View style={styles.priceListingItem}>
              <Text style={{ fontSize: 14, color: "#616161", flex: 1 }}>
                Taxes
              </Text>
              <Text
                style={{ fontSize: 14, fontWeight: "500", color: "#616161" }}
              >
                {utils_formatPrice(taxesNum)}
              </Text>
            </View>
          </View>

          <View style={styles.priceListingItem}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: colors.primary_black,
                flex: 1,
              }}
            >
              Subtotal
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: colors.primary_black,
              }}
            >
              {utils_formatPrice(total_price_number)}
            </Text>
          </View>

          <View style={{ marginTop: 49 }}>
            {data.seller_designation === "gallery" ? (
              <LongBlackButton
                value="Proceed to payment"
                onClick={handleClickPayNow}
                isLoading={loading}
                isDisabled={locked}
              />
            ) : (
              <PayWithFlutterwave
                onRedirect={handleOnRedirect}
                options={{
                  tx_ref: transactionRef,
                  amount: Math.ceil(total_price_number * 100) / 100,
                  currency: "USD",
                  authorization: process.env.EXPO_PUBLIC_FLW_TEST_PUBLIC_KEY,
                  customer: {
                    email: userSession.email,
                    name: userSession.name,
                    phonenumber: userSession.phone,
                  },
                  payment_options: "card",
                  meta: {
                    buyer_id: userSession.id,
                    buyer_email: userSession.email,
                    seller_email: data.seller_details.email,
                    seller_name: data.seller_details.name,
                    seller_id: data.seller_details.id,
                    artwork_name: data.artwork_data.title,
                    art_id: data.artwork_data.art_id,
                    shipping_cost: feesNum,
                    unit_price: data.artwork_data.pricing.usd_price,
                    tax_fees: taxesNum,
                  },
                }}
                customButton={FlutterwavePayButton}
              />
            )}

            {locked && (
              <View style={styles.LockContainer}>
                <Feather
                  name="lock"
                  color={"#ff000090"}
                  size={16}
                  style={{ marginTop: 7 }}
                />
                <Text style={{ fontSize: 14, color: "#ff000090", flex: 1 }}>
                  Another user has initiated a payment transaction on this
                  artwork. Please refresh your page in a few minutes to confirm
                  the availability of this artwork.
                </Text>
              </View>
            )}
            <Text
              style={{
                marginTop: 30,
                fontSize: 14,
                color: colors.grey,
                textAlign: "center",
              }}
            >
              In order to prevent multiple transaction attempts for this
              artwork, we have implemented a queueing system and lock mechanism
              which prevents other users from accessing the payment portal
            </Text>
          </View>
        </View>
      </ScrollWrapper>
      <VerifyTransactionModal
        visible={verifyState.visible}
        transactionId={verifyState.txId}
        onGoToDashboard={async () => {
          setVerifyState((s) => ({ ...s, visible: false }));
          await invalidateOrdersEverywhere();
          navigation.navigate(screenName.gallery.orders);
        }}
        onGoHome={async () => {
          setVerifyState((s) => ({ ...s, visible: false }));
          await invalidateOrdersEverywhere();
          navigation.navigate("Individual", {
            screen: "Overview",
          });
        }}
        onDismiss={() => setVerifyState((s) => ({ ...s, visible: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 15, marginTop: 15, flex: 1 },
  summaryContainer: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#FAFAFA",
  },
  summaryText: { fontSize: 16, color: colors.primary_black, fontWeight: "500" },
  priceListing: {
    marginVertical: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.grey50,
    gap: 20,
  },
  priceListingItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  LockContainer: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 7,
    flexDirection: "row",
    gap: 15,
    paddingHorizontal: 20,
    marginTop: 20,
  },
});
