import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { colors } from 'config/colors.config';
import omenai_logo from 'assets/icons/omenai_logo_cut.png';
import { daysLeft } from 'utils/utils_daysLeft';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import { utils_getCurrencySymbol } from 'utils/utils_getCurrencySymbol';
import { formatIntlDateTime } from 'utils/utils_formatIntlDateTime';
import { getFutureDate } from 'utils/utils_getFutureDate';
import Button from './Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';

type UpcomingBillingProps = {
    end_date: Date;
    payment: { value: number; currency: string };
    plan_details: {
        value: { monthly_price: string; annual_price: string };
        currency: string;
        type: string;
        interval: "monthly" | "yearly";
    };
    next_charge_params: NextChargeParams,
    sub_status: string
}

export default function UpcomingBilling({ end_date, payment, plan_details, next_charge_params, sub_status }: UpcomingBillingProps) {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const currency_symbol = utils_getCurrencySymbol(payment.currency);

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.planTitleContainer}>
                    <Text style={{fontSize: 16, color: colors.primary_black}}>Upcoming billing</Text>
                </View>
            </View>
            <View style={styles.bottomContainer}>
                {sub_status === 'canceled' ? 
                    (
                        <View>
                            <Text style={{fontSize: 12, color: '#ff0000', marginBottom: 10}}>Subscription canceled</Text>
                            <Button
                                label='Reactivate subscription' 
                                handleClick={() => navigation.navigate(screenName.gallery.billing, {plan_action: 'reactivation'})}
                            />
                        </View>
                    ) :
                    <View>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                            <View style={{flex: 1, flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                                <Image source={omenai_logo} style={styles.omenaiLogo} />
                                <View style={{gap: 5}}>
                                    <Text style={{fontSize: 16, fontWeight: 500, color: colors.primary_black}}>Omenai {next_charge_params.type}</Text>
                                </View>
                            </View>
                            <View style={{alignItems: 'flex-end', gap: 5}}>
                                <Text style={{fontSize: 16, fontWeight: 500, color: colors.primary_black}}>{utils_formatPrice(next_charge_params.value, currency_symbol)}</Text>
                                <Text style={{fontSize: 14, color: colors.primary_black, opacity: 0.8}}>{next_charge_params.interval.replace(/^./, (char) => char.toUpperCase())}</Text>
                            </View>
                        </View>
                        <Text style={{color: colors.grey, marginTop: 15}}><Text style={{fontWeight: 500, color: colors.primary_black}}>From:</Text> {formatIntlDateTime(end_date)} <Text style={{fontWeight: 500, color: colors.primary_black}}>To:</Text> {getFutureDate(end_date, next_charge_params.interval)}</Text>
                    </View>
                }
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
    },
})