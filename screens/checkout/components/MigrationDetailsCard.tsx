import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "config/colors.config";
import { utils_getCurrencySymbol } from "utils/utils_getCurrencySymbol";
import { utils_formatPrice } from "utils/utils_priceFormatter";
import { useRoute } from "@react-navigation/native";

type MigrationDetailsCardProps = {
  plan: SubscriptionPlanDataTypes & {
    createdAt: string;
    updatedAt: string;
    _id: string;
  };
  interval: string;
  sub_data: SubscriptionModelSchemaTypes & {
    created: string;
    updatedAt: string;
  };
  days_used: number;
  prorated_cost: number;
  grand_total: number;
  shouldCharge: boolean;
  action: string;
};

export default function MigrationDetailsCard({
  plan,
  interval,
  sub_data,
  days_used,
  prorated_cost,
  grand_total,
  shouldCharge,
  action,
}: MigrationDetailsCardProps) {
  const routes = useRoute();

  const currency = utils_getCurrencySymbol(plan.currency);

  const {} = routes.params as {};

  const upgrade_cost =
    interval === "monthly"
      ? +plan.pricing.monthly_price
      : +plan.pricing.annual_price;

  const is_effected_end_of_billing_cycle =
    sub_data.plan_details.interval === "yearly" && interval === "monthly";

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={{ fontSize: 12, color: colors.white }}>
          Subscription {action}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: colors.white,
            fontWeight: 500,
            marginTop: 10,
          }}
        >
          Omenai {plan.name} subscription
        </Text>
        <Text style={{ fontSize: 14, color: colors.white, marginTop: 10 }}>
          Billed {interval}
        </Text>
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.detailItem}>
          <Text style={{ flex: 1, fontSize: 14, color: colors.primary_black }}>
            Current plan duration
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.primary_black,
              fontWeight: 500,
            }}
          >
            {days_used} days elapsed
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={{ flex: 1, fontSize: 14, color: colors.primary_black }}>
            Plan upgrade cost
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.primary_black,
              fontWeight: 500,
            }}
          >
            {utils_formatPrice(upgrade_cost, currency)}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={{ flex: 1, fontSize: 14, color: colors.primary_black }}>
            Porated cost
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.primary_black,
              fontWeight: 500,
            }}
          >
            {!shouldCharge
              ? utils_formatPrice(0, currency)
              : `-${utils_formatPrice(prorated_cost, currency)}`}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={{ flex: 1, fontSize: 14, color: colors.primary_black }}>
            Due today
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.primary_black,
              fontWeight: 500,
            }}
          >
            {!shouldCharge
              ? utils_formatPrice(0, currency)
              : `${utils_formatPrice(grand_total, currency)}`}
          </Text>
        </View>
        {!shouldCharge && (
          <View style={styles.warning}>
            <Text style={{ fontSize: 12, color: "#ff0000" }}>
              NOTE: Your plan change will take effect at the end of your
              currentbilling cycle.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.grey50,
    borderRadius: 7,
    overflow: "hidden",
  },
  topContainer: {
    backgroundColor: colors.primary_black,
    padding: 15,
  },
  mainContainer: {
    padding: 15,
    gap: 15,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  warning: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#ff000015",
  },
});
