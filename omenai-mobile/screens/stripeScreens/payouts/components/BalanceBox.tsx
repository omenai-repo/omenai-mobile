import { Linking, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import LongBlackButton from 'components/buttons/LongBlackButton'
import { retrieveBalance } from 'services/stripe/retrieveBalance';
import { useModalStore } from 'store/modal/modalStore';
import { getCurrencySymbol } from 'utils/getCurrencySymbol';
import { generateStripeLoginLink } from 'services/stripe/generateStripeLoginLink';

export default function BalanceBox({account_id} : {account_id: string}) {
    const [pendingBalance, setPendingBalance] = useState<boolean>(false);
    const [pendingLoginLink, setPendingLoginLink] = useState(false)
    const [balance, setBalance] = useState()


    const { updateModal } = useModalStore()

    useEffect(() => {
        async function handleFetchBalance(){
            setPendingBalance(true)
            const res = await retrieveBalance(account_id);

            if(res?.isOk){
                setBalance(res.data)
            }else{
                updateModal({message: 'Something went wrong, please try again or contact support', modalType: 'error', showModal: true})
            }

            setPendingBalance(false)
        }

        handleFetchBalance();
    }, [])

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

    if(pendingBalance)return(
        <View style={{height: 200, borderRadius: 20, backgroundColor: colors.grey50}} />
    )

    if(balance)
    return (
        <View style={styles.container}>
            <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
                <Text style={{fontSize: 14, color: colors.primary_black}}>Paystack Balance</Text>
            </View>
            <View style={styles.mainContainer}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                    <Text style={{fontSize: 16}}>Availiable balance:</Text>
                    <Text style={{fontSize: 20, fontWeight: 500}}>
                        {getCurrencySymbol(balance.available[0].currency)}
                        {balance?.available[0].amount}
                    </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10}}>
                    <Text style={{fontSize: 16}}>Pending balance:</Text>
                    <Text style={{fontSize: 20, fontWeight: 500}}>
                        {getCurrencySymbol(balance.pending[0].currency)}
                        {balance?.pending[0].amount}
                    </Text>
                </View>
                <View style={{flexDirection: 'row', gap: 15, marginTop: 20}}>
                    <View style={{flex: 1}}>
                        <LongBlackButton
                            value='View Stripe Dashboard'
                            onClick={generateLoginLink}
                            isLoading={pendingLoginLink}
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderColor: colors.grey50,
        borderRadius: 10,
        borderWidth: 1
    },
    mainContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: colors.grey50
    }
})