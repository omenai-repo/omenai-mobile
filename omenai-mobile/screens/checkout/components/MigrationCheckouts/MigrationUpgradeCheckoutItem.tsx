import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { daysElapsedSince } from 'utils/daysElapsedSince';
import {
    differenceInDays,
    startOfYear,
    endOfYear,
    endOfMonth,
    getDaysInMonth,
} from "date-fns";
import { getDaysLeft } from 'utils/getDaysLeft';
import { getCurrencySymbol } from 'utils/getCurrencySymbol';
import MigrationDetailsCard from '../MigrationDetailsCard';
import CheckoutBillingCard from '../CheckoutBillingCard';

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

    const days_used = daysElapsedSince(sub_data.start_date);
    const startDate = new Date(sub_data.start_date);

    const daysInYear = differenceInDays(
        endOfYear(startDate),
        startOfYear(startDate)
    );

    const daysInMonth = getDaysInMonth(startDate);

    const days_left = getDaysLeft(startDate, sub_data.plan_details.interval);

    const dailyRate =
    +sub_data.payment.value /
    (sub_data.plan_details.interval === "yearly" ? daysInYear : daysInMonth);

    const proratedPrice = days_left * dailyRate;

    const prorated_cost = days_used > 0 ? proratedPrice : 0;

    const upgrade_cost =
        interval === "monthly"
        ? +plan.pricing.monthly_price
        : +plan.pricing.annual_price;

    const currency = getCurrencySymbol(plan.currency);

    const is_effected_end_of_billing_cycle =
        sub_data.plan_details.interval === "yearly" && interval === "monthly";
    
    const total = upgrade_cost - prorated_cost;
    const grand_total = Math.round((total + Number.EPSILON) * 100) / 100;

    return (
        <View style={styles.container}>
            <MigrationDetailsCard
                
            />
            <CheckoutBillingCard
                sub_data={sub_data}
                interval={interval}
                plan={plan}
                amount={grand_total}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})