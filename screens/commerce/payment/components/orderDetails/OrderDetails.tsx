import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { colors } from "#config/colors.config";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { utils_formatPrice } from "#utils/commerce/utils_priceFormatter";
import { utils_calculatePurchaseGrandTotalNumber } from "#utils/commerce/utils_calculatePurchaseGrandTotal";
import { Feather } from "@expo/vector-icons";
import { useAppStore } from "#store/app/appStore";
import { useModalStore } from "#store/account/modal/modalStore";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";
import Loader from "#components/general/Loader";
import ScrollWrapper from "#components/general/ScrollWrapper";
import { useQueryClient } from "@tanstack/react-query";
import VerifyTransactionModal from "../success/VerifyTransactionModal";
import * as Crypto from "expo-crypto";
import { navigateToCollectorOrders } from "#lib/navigation/navigateToCollectorOrders";
import PaymentGatewayButton from "#components/payment/PaymentGatewayButton";
import { usePaymentAdapter } from "#hooks/usePaymentAdapter";

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
  const [verifyState, setVerifyState] = useState<{
    visible: boolean;
    txId?: string | null;
  }>({
    visible: false,
  });

  const { userSession } = useAppStore();
  const { updateModal } = useModalStore();

  const transactionRef = useMemo(() => `flw_tx_ref_${Crypto.randomUUID()}`, []);

  const feesNum = Number(
    typeof data.shipping_details.shipment_information.quote.fees === "string"
      ? JSON.parse(data.shipping_details.shipment_information.quote.fees)
      : data.shipping_details.shipment_information.quote.fees,
  );
  const taxesNum = Number(
    typeof data.shipping_details.shipment_information.quote.taxes === "string"
      ? JSON.parse(data.shipping_details.shipment_information.quote.taxes)
      : data.shipping_details.shipment_information.quote.taxes,
  );

  const total_price_number = utils_calculatePurchaseGrandTotalNumber(
    data.artwork_data.pricing.usd_price,
    String(feesNum),
    String(taxesNum),
  );

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

  const throwError = (message: string) => {
    updateModal({ message, modalType: "error", showModal: true });
  };

  const gateway = data.seller_designation === "gallery" ? "stripe" : "flutterwave";

  const { initializeGateway, processPayment, loading, initLoader } = usePaymentAdapter({
    gateway,
    orderId: data.order_id,
    artworkId: data.artwork_data.art_id,
    userId: userSession.id,
    totalPriceNumber: total_price_number,
    sellerDetails: {
      id: data.seller_details.id,
      email: data.seller_details.email,
      name: data.seller_details.name,
    },
    artworkData: {
      title: data.artwork_data.title,
      price: data.artwork_data.pricing.usd_price,
      shippingFee: feesNum,
      taxFee: taxesNum,
    },
    customer: {
      email: userSession.email,
      name: userSession.name,
      phone: userSession.phone,
    },
    onSuccess: async (details) => {
      if (gateway === "flutterwave" && details?.transactionId) {
        setVerifyState({ visible: true, txId: details.transactionId });
      } else {
        await goToSuccessAndRefreshOrders();
      }
    },
    onCancel: () => {
      goToCancelAndBack();
    },
    onError: (msg) => {
      throwError(msg);
    },
  });

  useEffect(() => {
    if (gateway === "stripe") {
      initializeGateway();
    }
  }, [gateway, initializeGateway]);

  async function handleClickPayNow() {
    if (gateway === "stripe") {
      await processPayment();
    } else {
      await processPayment(transactionRef, "omenaimobile://flutterwave-redirect");
    }
  }

  if (initLoader)
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
            <PaymentGatewayButton
              gateway={gateway}
              onPress={handleClickPayNow}
              isLoading={loading}
              disabled={locked}
            />

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
          navigateToCollectorOrders();
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
