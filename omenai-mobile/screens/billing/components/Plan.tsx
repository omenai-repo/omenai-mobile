import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import { Feather } from '@expo/vector-icons'
import LongBlackButton from 'components/buttons/LongBlackButton'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { screenName } from 'constants/screenNames.constants'
import { formatPrice } from 'utils/priceFormatter'
import { getCurrencySymbol } from 'utils/getCurrencySymbol'


export default function Plan({
    name,
    pricing,
    benefits,
    tab,
    currency,
    plan_id
}: PlanProps & { tab: "monthly" | "yearly" }) {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const currency_symbol = getCurrencySymbol(currency);

    return (
        <View style={styles.container}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.priceContainer}>
                <Text style={styles.amount}>{currency_symbol}{tab === "monthly" ? `${pricing.monthly_price}` : `${pricing.annual_price}`}</Text>
                <Text style={styles.tabDurationText}>{tab === "monthly" ? `/mo` : `/yr`}</Text>
            </View>
            <Text style={styles.benefitsText}>
                {name === "Basic" && "All basic features included."}
                {name === "Pro" && "Best deal for you"}
                {name === "Premium" && "For those who expect more"}
            </Text>
            <View style={styles.benefitsContainer}>
                {benefits.map((benefit, index) => (
                    <View style={styles.benefitContainer} key={index}>
                        <Feather name='check' color={colors.grey} size={16} />
                        <Text style={styles.benefit}>{benefit}</Text>
                    </View>
                ))}
            </View>
            <LongBlackButton
                value={'Get started with ' + name}
                onClick={() => navigation.navigate(screenName.checkout, {plan_id, tab})}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderWidth: 1,
        borderColor: colors.grey50,
        borderRadius: 15
    },
    name: {
        fontSize: 14,
        color: colors.primary_black
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: "center",
        marginTop: 10
    },
    tabDurationText: {
        fontSize: 19,
        color: colors.grey,
        fontWeight: 600
    },
    amount: {
        fontSize: 23,
        fontWeight: 600,
        color: colors.primary_black
    },
    benefitsText: {
        fontSize: 14,
        color: colors.primary_black,
        paddingVertical: 20
    },
    benefitsContainer: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 10,
        gap: 20,
        marginBottom: 20
    },
    benefitContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    benefit: {
        fontSize: 14,
        color: colors.primary_black,
        opacity: 0.85
    }
})