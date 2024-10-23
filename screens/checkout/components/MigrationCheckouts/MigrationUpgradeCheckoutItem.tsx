import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { utils_daysElapsedSince } from 'utils/utils_daysElapsedSince';
import {
    differenceInDays,
    startOfYear,
    endOfYear,
    endOfMonth,
    getDaysInMonth,
} from "date-fns";
import { getDaysLeft } from 'utils/utils_getDaysLeft';
import MigrationDetailsCard from '../MigrationDetailsCard';
import CheckoutBillingCard from '../CheckoutBillingCard';
import { useRoute } from '@react-navigation/native';

type MigrationUpgradeCheckoutItemProps = {
    plan:  SubscriptionPlanDataTypes & {
        createdAt: string;
        updatedAt: string;
        _id: string;
    };
    interval: string
    sub_data: SubscriptionModelSchemaTypes & {
        created: string;
        updatedAt: string;
      };
}

export default function MigrationUpgradeCheckoutItem({plan, interval, sub_data}: MigrationUpgradeCheckoutItemProps) {
    const route = useRoute();

    const {shouldCharge, action} = route.params as {shouldCharge: boolean, action: string};

    const days_used = utils_daysElapsedSince(sub_data.start_date);
    const startDate = new Date(sub_data.start_date);

    const daysInYear = differenceInDays(
        endOfYear(startDate),
        startOfYear(startDate)
    );

    const daysInMonth = getDaysInMonth(startDate);

    // const days_left = getDaysLeft(startDate, sub_data.plan_details.interval);

    const dailyRate =
    (sub_data.plan_details.interval === "yearly"
      ? +sub_data.plan_details.value.annual_price
      : +sub_data.plan_details.value.monthly_price) /
    (sub_data.plan_details.interval === "yearly" ? daysInYear : daysInMonth);

    const proratedPrice =
    (sub_data.plan_details.interval === "yearly"
      ? +sub_data.plan_details.value.annual_price
      : +sub_data.plan_details.value.monthly_price) -
    days_used * dailyRate;

    // const prorated_cost = days_used > 0 ? proratedPrice : 0;

    const upgrade_cost =
        interval === "monthly"
        ? +plan.pricing.monthly_price
        : +plan.pricing.annual_price;
    
    const total = upgrade_cost - proratedPrice;
    const grand_total = Math.round((total + Number.EPSILON) * 100) / 100;

    return (
        <View style={styles.container}>
            <MigrationDetailsCard
                interval={interval}
                sub_data={sub_data}
                plan={plan}
                prorated_cost={proratedPrice}
                grand_total={grand_total}
                days_used={days_used}
                shouldCharge={shouldCharge}
                action={action}
            />
            <CheckoutBillingCard
                sub_data={sub_data}
                interval={interval}
                plan={plan}
                amount={grand_total}
                shouldCharge={shouldCharge}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 30
    }
})