import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from 'config/colors.config'
import omenai_logo from 'assets/icons/omenai_logo_cut.png';
import { utils_formatPrice } from 'utils/utils_priceFormatter'
import { utils_getCurrencySymbol } from 'utils/utils_getCurrencySymbol'
import Button from './Button'
import { formatIntlDateTime } from 'utils/utils_formatIntlDateTime'
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import { daysLeft } from 'utils/utils_daysLeft';
import { useModalStore } from 'store/modal/modalStore';

type PlanDetailsProps = {
    sub_status: string;
    end_date: Date;
    payment: { value: number; currency: string };
    plan_details: {
        value: { monthly_price: string; annual_price: string };
        currency: string;
        type: string;
        interval: string;
    };
}

export default function PlanDetails({ sub_status, end_date, payment, plan_details }: PlanDetailsProps) {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const { setRetainModal } = useModalStore();

    const currency_symbol = utils_getCurrencySymbol(payment.currency);

    return (
        <View>
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <View style={styles.planTitleContainer}>
                        <Text style={{fontSize: 16, color: colors.primary_black}}>Subscription Info</Text>
                    </View>
                </View>
                <View style={styles.bottomContainer}>
                    <View style={{flexDirection: 'row', gap: 10}}>
                        <Image source={omenai_logo} style={styles.omenaiLogo} />
                        <View style={{gap: 7}}>
                            <Text style={{fontSize: 16, fontWeight: 500, color: colors.primary_black}}>Omenai {plan_details.type}</Text>
                            <Text style={{opacity: 0.7}}>{daysLeft(end_date)} day(s) left</Text>
                            <View style={styles.amountContainer}>
                                <Text style={{fontSize: 16, fontWeight: 500, color: colors.primary_black}}>{utils_formatPrice(payment.value, currency_symbol)}</Text>
                                <Text style={{fontSize: 14, color: colors.primary_black, opacity: 0.8}}>/ {plan_details.interval.replace(/^./, (char) => char.toUpperCase())}</Text>
                            </View>
                            <Text style={{fontSize: 14, color: colors.primary_black, opacity: 0.8}}>Next billing date: {formatIntlDateTime(end_date)}</Text>
                            <View style={{flexWrap: 'wrap'}}><View style={styles.activePill}><Text style={{fontSize: 12, fontWeight: 500, color: '#00800080'}}>{sub_status.toUpperCase()}</Text></View></View>
                        </View>
                    </View>
                    {sub_status === 'canceled' ? (
                        <View style={styles.buttonContainer}>
                            <Button 
                                label='Reactivate subscription' 
                                handleClick={() => navigation.navigate(screenName.gallery.billing, {plan_action: 'reactivation'})}
                            />
                        </View>
                    ) :
                        <View style={styles.buttonContainer}>
                            <Button 
                                label='Upgrade/Downgrade plan' 
                                handleClick={() => navigation.navigate(screenName.gallery.billing, {plan_action: null})}
                            />
                            <Button 
                                label='Cancel subscription' 
                                remove 
                                handleClick={() => setRetainModal({retainModal: 'cancleSubscription', showModal: true, message: end_date})}
                            />
                        </View>
                    }
                </View>
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
    amountContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 4
    },
    activePill: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 30,
        backgroundColor: '#00800015'
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
    buttonContainer: {
        gap: 15,
        marginTop: 30,
    },
})