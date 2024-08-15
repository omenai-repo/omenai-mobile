import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config';
import { getCurrencySymbol } from 'utils/getCurrencySymbol';
import { formatPrice } from 'utils/priceFormatter';

type MigrationDetailsCardProps = {
    plan:  SubscriptionPlanDataTypes & {
        createdAt: string;
        updatedAt: string;
        _id: string;
    };
    interval: string;
    sub_data: SubscriptionModelSchemaTypes & {
        created: string;
        updatedAt: string;
    };
    days_used: number,
    prorated_cost: number,
    grand_total: number
}

export default function MigrationDetailsCard({ plan, interval, sub_data , days_used, prorated_cost, grand_total}: MigrationDetailsCardProps) {

    const currency = getCurrencySymbol(plan.currency);

    const upgrade_cost =
    interval === "monthly"
      ? +plan.pricing.monthly_price
      : +plan.pricing.annual_price;

    const is_effected_end_of_billing_cycle =
    sub_data.plan_details.interval === "yearly" && interval === "monthly";

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={{fontSize: 12, color: colors.white}}>Subscription upgrade</Text>
                <Text style={{fontSize: 14, color: colors.white, fontWeight: 500, marginTop: 10}}>Omenai {plan.name} subscription</Text>
                <Text style={{fontSize: 14, color: colors.white, marginTop: 10}}>Billed yearly</Text>
            </View>
            <View style={styles.mainContainer}>
                <View style={styles.detailItem}>
                    <Text style={{flex: 1, fontSize: 14, color: colors.primary_black}}>Current plan duration</Text>
                    <Text style={{fontSize: 14, color: colors.primary_black, fontWeight: 500}}>{days_used} days elapsed</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={{flex: 1, fontSize: 14, color: colors.primary_black}}>Plan upgrade cost</Text>
                    <Text style={{fontSize: 14, color: colors.primary_black, fontWeight: 500}}>{formatPrice(upgrade_cost, currency)}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={{flex: 1, fontSize: 14, color: colors.primary_black}}>Porated cost</Text>
                    <Text style={{fontSize: 14, color: colors.primary_black, fontWeight: 500}}>
                    {is_effected_end_of_billing_cycle
                        ? formatPrice(0, currency)
                        : `-${formatPrice(prorated_cost, currency)}`}
                    </Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={{flex: 1, fontSize: 14, color: colors.primary_black}}>Due today</Text>
                    <Text style={{fontSize: 14, color: colors.primary_black, fontWeight: 500}}>
                    {is_effected_end_of_billing_cycle
                        ? formatPrice(0, currency)
                        : `${formatPrice(grand_total, currency)}`}
                    </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: colors.grey50,
        borderRadius: 7,
        overflow: 'hidden'
    },
    topContainer: {
        backgroundColor: colors.primary_black,
        padding: 15
    },
    mainContainer: {
        padding: 15,
        gap: 15
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    }
})