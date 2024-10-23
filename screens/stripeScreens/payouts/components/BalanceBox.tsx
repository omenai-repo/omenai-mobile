import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import LongBlackButton from 'components/buttons/LongBlackButton'
import { retrieveBalance } from 'services/stripe/retrieveBalance';
import { useModalStore } from 'store/modal/modalStore';
import { utils_getCurrencySymbol } from 'utils/utils_getCurrencySymbol';
import { generateStripeLoginLink } from 'services/stripe/generateStripeLoginLink';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import { AntDesign, Feather } from '@expo/vector-icons';

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

    if(balance){
        const currency = utils_getCurrencySymbol(balance.available[0].currency);

        return(
            <View style={styles.container}>
                <Text style={{textAlign: 'center', fontSize: 14, color: colors.primary_black, marginTop: 10}}>Stripe Pending Balance</Text>
                <Text style={{fontSize: 22, fontWeight: 600, textAlign: 'center', marginTop: 10, color: colors.primary_black}}>
                    {utils_formatPrice(balance.pending[0].amount / 100, currency)}
                </Text>
                <View style={{gap: 10, marginTop: 15, paddingTop: 15, borderTopColor: colors.grey50, borderTopWidth: 1}}>
                    <View style={styles.disclaimer}>
                        <AntDesign size={16} name='warning' color={'#ff0000'} />
                        <Text style={{fontSize: 12, color: '#ff0000', flex: 1}}>The balance is yet to be settled, once settled, you’ll receive payout to your bank account</Text>
                    </View>
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
    disclaimer: {
        backgroundColor: '#FFBF0015',
        borderRadius: 10,
        padding: 15,
        paddingHorizontal: 15,
        flexDirection: 'row',
        gap: 10
    }
})