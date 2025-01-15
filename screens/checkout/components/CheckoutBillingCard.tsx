import { Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { subscriptionStepperStore } from "store/subscriptionStepper/subscriptionStepperStore";
import { generateAlphaDigit } from "utils/utils_generateToken";
import { createTokenizedCharge } from "services/subscriptions/createTokenizedCharge";
import { useModalStore } from "store/modal/modalStore";
import { Fontisto } from "@expo/vector-icons";
import { colors } from "config/colors.config";

import mastercardLogo from "assets/icons/MastercardLogo.png";
import verve from "assets/icons/verve.png";
import visa from "assets/icons/visa.png";
import LongBlackButton from "components/buttons/LongBlackButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";
import { useAppStore } from "store/app/appStore";
import { downgradeSubscriptionPlan } from "services/subscriptions/downgradeSubscriptionPlan";

export default function CheckoutBillingCard({
  plan,
  interval,
  sub_data,
  amount,
  shouldCharge,
}: {
  plan: SubscriptionPlanDataTypes & {
    createdAt: string;
    updatedAt: string;
    _id: string;
  };
  sub_data: SubscriptionModelSchemaTypes & {
    created: string;
    updatedAt: string;
  };
  interval: string;
  amount: number;
  shouldCharge: boolean;
}) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { set_transaction_id } = subscriptionStepperStore();
  const { updateModal } = useModalStore();
  const { userSession } = useAppStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [migrationLoading, setMigrationLoading] = useState<boolean>(false);

  async function handlePayNow() {
    setLoading(true);
    const tokenized_data: SubscriptionTokenizationTypes = {
      amount,
      email: sub_data.customer.email,
      tx_ref: generateAlphaDigit(7),
      token: sub_data.card.token,
      gallery_id: sub_data.customer.gallery_id,
      plan_id: plan._id.toString(),
      plan_interval: interval,
    };

    const tokenize_card = await createTokenizedCharge(tokenized_data);

    if (!tokenize_card?.isOk) {
      //throw errow
      updateModal({
        message: "Couldn't create tokenized card charge",
        modalType: "error",
        showModal: true,
      });
    } else {
      const { data } = tokenize_card;
      set_transaction_id(data.data.id);
      //navigate to verification screen
      navigation.navigate(screenName.verifyTransaction);
    }

    setLoading(false);
  }

  async function handleMigrateToPlan() {
    setMigrationLoading(true);

    const data: NextChargeParams = {
      value:
        interval === "monthly"
          ? +plan.pricing.monthly_price
          : +plan.pricing.annual_price,
      currency: "USD",
      type: plan.name,
      interval,
      id: plan._id as string,
    };

    const migrate = await downgradeSubscriptionPlan(data, userSession.id);

    if (!migrate?.isOk) {
      updateModal({
        message: migrate?.message,
        modalType: "error",
        showModal: true,
      });
    } else {
      updateModal({
        message: "Migration successful",
        modalType: "success",
        showModal: true,
      });
      handleMigrationNavigate();
    }
    setMigrationLoading(false);
  }

  const handleMigrationNavigate = () => {
    setTimeout(() => {
      navigation.navigate(screenName.gallery.overview);
    }, 3500);
  };

  return (
    <View style={{ gap: 20 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 16, flex: 1 }}>Payment Method</Text>
        <View style={styles.secureForm}>
          <Fontisto name="locked" size={10} />
          <Text style={{ fontSize: 12, color: colors.primary_black }}>
            Secure form
          </Text>
        </View>
      </View>
      <View style={styles.cardDetailsContainer}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              color: colors.primary_black,
              fontWeight: 500,
            }}
          >
            Billing card details
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.primary_black,
              fontWeight: 500,
              marginTop: 10,
            }}
          >
            {sub_data.card.first_6digits} ** **** {sub_data.card.last_4digits}
          </Text>
          <Text
            style={{ fontSize: 14, color: colors.primary_black, marginTop: 10 }}
          >
            {sub_data.card.expiry}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Image
            source={
              sub_data.card.type.toLowerCase() === "mastercard"
                ? mastercardLogo
                : sub_data.card.type.toLowerCase() === "visa"
                ? visa
                : sub_data.card.type.toLowerCase() === "verve"
                ? verve
                : null
            }
            resizeMode="contain"
            style={{ height: 30, width: 50 }}
          />
        </View>
      </View>
      <View>
        {shouldCharge ? (
          <LongBlackButton
            value="Pay now"
            onClick={handlePayNow}
            isLoading={loading}
          />
        ) : (
          <LongBlackButton
            value="Migrate to Plan"
            onClick={handleMigrateToPlan}
            isLoading={migrationLoading}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  secureForm: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  cardDetailsContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: colors.grey50,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  billingCardTitle: {
    fontSize: 12,
  },
  iconContainer: {
    width: 50,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
});
