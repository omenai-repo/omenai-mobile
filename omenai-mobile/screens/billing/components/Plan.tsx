import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import { Feather } from '@expo/vector-icons'
import LongBlackButton from 'components/buttons/LongBlackButton'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { screenName } from 'constants/screenNames.constants'
import { utils_formatPrice } from 'utils/utils_priceFormatter'
import { utils_getCurrencySymbol } from 'utils/utils_getCurrencySymbol'
import { utils_determinePlanChange } from 'utils/utils_determinePlanChange'


export default function Plan({
    name,
    pricing,
    benefits,
    tab,
    currency,
    plan_id,
    sub_data,
    id,
}: PlanProps & { 
    tab: "monthly" | "yearly",
    id: string,
    sub_data: SubscriptionModelSchemaTypes | null;
}) {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const currency_symbol = utils_getCurrencySymbol(currency);

    let plan_change_params: { action: string; shouldCharge: boolean } = {
        action: "",
        shouldCharge: false,
    };

    if (sub_data !== null) {
        const { action, shouldCharge } = utils_determinePlanChange(
          sub_data.plan_details.type.toLowerCase(),
          sub_data.plan_details.interval.toLowerCase() as "yearly" | "monthly",
          tab === "yearly" ? +pricing.annual_price : +pricing.monthly_price,
          tab
        );
        plan_change_params = { action, shouldCharge };
    };

    const handleNavigate = () => {
        const action = sub_data === null ? null : plan_change_params.action

        navigation.navigate(screenName.checkout, {plan_id, tab, id: id, action, shouldCharge: plan_change_params.shouldCharge})
    }

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
                value={sub_data !== null
                    ? sub_data.plan_details.type !== name ||
                      (sub_data.plan_details.type === name &&
                        sub_data.plan_details.interval !== tab)
                      ? "Migrate to " + name
                      : "Subscribed"
                    : "Get started with " + name
                }
                onClick={handleNavigate}
                isDisabled={
                    sub_data !== null &&
                    sub_data.plan_details.type === name &&
                    sub_data.plan_details.interval === tab
                }
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