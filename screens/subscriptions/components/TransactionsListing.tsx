import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import { fetchSubscriptionTransactions } from 'services/transactions/fetchSubscriptionTransactions'
import { useAppStore } from 'store/app/appStore'
import Loader from 'components/general/Loader'
import omenai_logo from 'assets/icons/omenai_logo_cut.png';
import { formatIntlDateTime } from 'utils/utils_formatIntlDateTime'
import { utils_formatPrice } from 'utils/utils_priceFormatter'

export default function TransactionsListing() {
    const { userSession } = useAppStore();

    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        async function handleFetchTransaction(){
            setLoading(true)
            const res = await fetchSubscriptionTransactions(userSession.id);

            if(res?.isOk){
                setTransactions(res.data);
            }
            setLoading(false)
        };

        handleFetchTransaction()
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.planTitleContainer}>
                    <Text style={{fontSize: 16, color: colors.primary_black}}>Transaction history</Text>
                </View>
            </View>
            <View style={styles.bottomContainer}>
                {loading && <Loader height={100} />}
                {(!loading && transactions.length > 0) && (
                    <View style={{gap: 15}}>
                        {transactions.map((transaction: any, index) => (
                            <View key={index} style={styles.transaction}>
                                <View style={{flex: 1, flexDirection: 'row', gap: 10}}>
                                    <Image source={omenai_logo} style={styles.omenaiLogo} />
                                    <View style={{gap: 5}}>
                                        <Text style={{fontSize: 16, fontWeight: 500, color: colors.primary_black}}>{transaction.trans_id}</Text>
                                        <Text style={{opacity: 0.7}}>{formatIntlDateTime(transaction.date)}</Text>
                                    </View>
                                </View>
                                <Text>{transaction.amount}.00</Text>
                            </View>
                        ))}
                    </View>
                )}
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
    transaction: {
        flexDirection: 'row',
        gap: 10
    },
    omenaiLogo: {
        height: 30,
        width: 30,
        marginTop: 5
    },
})