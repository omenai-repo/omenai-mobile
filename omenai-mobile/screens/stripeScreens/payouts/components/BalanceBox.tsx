import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import LongBlackButton from 'components/buttons/LongBlackButton'
import { retrieveBalance } from 'services/stripe/retrieveBalance';
import { useModalStore } from 'store/modal/modalStore';
import { utils_getCurrencySymbol } from 'utils/utils_getCurrencySymbol';
import { generateStripeLoginLink } from 'services/stripe/generateStripeLoginLink';
import { utils_formatPrice } from 'utils/utils_priceFormatter';

export default function BalanceBox({account_id, balance} : {account_id: string, balance: any}) {
    const [pendingLoginLink, setPendingLoginLink] = useState(false)


    const { updateModal } = useModalStore()

    async function generateLoginLink() {
        setPendingLoginLink(true)
        const res = await generateStripeLoginLink(account_id);

        if(res?.isOk){
            const supportedLink = await Linking.canOpenURL(res.url);
            if(supportedLink){
                setPendingLoginLink(false);
                await Linking.openURL(res.url)
            }
        }else{
            updateModal({message: 'Something went wrong, please try again or contact support', modalType: 'error', showModal: true})
        }

        setPendingLoginLink(false)

    }

    const GreyButton = ({label}: {label: string}) => {
        return(
            <TouchableOpacity style={{flex: 1}} activeOpacity={1}>
                <View style={styles.button}>
                    <Text style={{color: colors.primary_black}}>{label}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    if(balance){
        const currency = utils_getCurrencySymbol(balance.available[0].currency);

        return(
            <View style={styles.container}>
                <Text style={{textAlign: 'center', fontSize: 14, color: colors.primary_black, marginTop: 10}}>Stripe Available Balance</Text>
                <Text style={{fontSize: 20, fontWeight: 500, textAlign: 'center', marginTop: 10, color: colors.primary_black}}>
                    {utils_formatPrice(balance.available[0].amount / 100, currency)}
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10}}>
                    <Text style={{fontSize: 12, opacity: 0.9, color: colors.primary_black}}>Balance pending on Stripe:</Text>
                    <Text style={{fontSize: 16, fontWeight: 500, color: colors.primary_black}}>
                        {utils_formatPrice(balance.pending[0].amount / 100, currency)}
                    </Text>
                </View>
                <View style={{gap: 10, marginTop: 15, paddingTop: 15, borderTopColor: colors.grey50, borderTopWidth: 1}}>
                    <GreyButton label='Payout balance' />
                    <LongBlackButton
                        value='View Stripe Dashboard'
                        onClick={generateLoginLink}
                        isLoading={pendingLoginLink}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        borderColor: colors.grey50,
        borderRadius: 10,
        borderWidth: 1,
        padding: 10
    },
    mainContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: colors.grey50
    },
    button: {
        height: 50,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.grey50,
        borderRadius: 10
    },
})