import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { colors } from 'config/colors.config';
import omenai_logo from 'assets/icons/omenai_logo_cut.png';
import { daysLeft } from 'utils/daysLeft';
import { formatPrice } from 'utils/priceFormatter';
import { getCurrencySymbol } from 'utils/getCurrencySymbol';
import { formatIntlDateTime } from 'utils/formatIntlDateTime';
import { getFutureDate } from 'utils/getFutureDate';

type UpcomingBillingProps = {
    end_date: Date;
    payment: { value: number; currency: string };
    plan_details: {
        value: { monthly_price: string; annual_price: string };
        currency: string;
        type: string;
        interval: "monthly" | "yearly";
    };
}

export default function UpcomingBilling({ end_date, payment, plan_details }: UpcomingBillingProps) {

    const currency_symbol = getCurrencySymbol(payment.currency);

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.planTitleContainer}>
                    <Text style={{fontSize: 16, color: colors.primary_black}}>Upcoming billing</Text>
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                    <View style={{flex: 1, flexDirection: 'row', gap: 10}}>
                        <Image source={omenai_logo} style={styles.omenaiLogo} />
                        <View style={{gap: 5}}>
                            <Text style={{fontSize: 16, fontWeight: 500, color: colors.primary_black}}>Omenai {plan_details.type}</Text>
                            <Text style={{opacity: 0.7}}>{daysLeft(end_date)} day(s) left</Text>
                        </View>
                    </View>
                    <View style={{alignItems: 'flex-end', gap: 5}}>
                        <Text style={{fontSize: 16, fontWeight: 500, color: colors.primary_black}}>{formatPrice(payment.value, currency_symbol)}</Text>
                        <Text style={{fontSize: 14, color: colors.primary_black, opacity: 0.8}}>{plan_details.interval.replace(/^./, (char) => char.toUpperCase())}</Text>
                    </View>
                </View>
                <Text style={{color: colors.grey, marginTop: 15}}><Text style={{fontWeight: 500, color: colors.primary_black}}>From:</Text> {formatIntlDateTime(end_date)} <Text style={{fontWeight: 500, color: colors.primary_black}}>To:</Text> {getFutureDate(end_date, plan_details.interval)}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: colors.grey50,
        borderRadius: 10,
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15
    },
    planTitleContainer: {
        flex: 1,
        gap: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    bottomContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: colors.grey50
    },
    omenaiLogo: {
        height: 30,
        width: 30,
        marginTop: 5
    },
})