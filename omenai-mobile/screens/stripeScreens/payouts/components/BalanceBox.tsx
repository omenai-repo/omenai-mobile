import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from 'config/colors.config'
import LongBlackButton from 'components/buttons/LongBlackButton'

export default function BalanceBox() {
    const [loading, setLoading] = useState<boolean>(false)

    async function generateLoginLink() {
        setLoading(true)
    }

    return (
        <View style={styles.container}>
            <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
                <Text style={{fontSize: 14, color: colors.primary_black}}>Paystack Balance</Text>
            </View>
            <View style={styles.mainContainer}>
                <Text>$200.00</Text>
                <View style={{flexDirection: 'row', gap: 15, marginTop: 20}}>
                    <View style={{flex: 1}}>
                        <LongBlackButton
                            value='View Stripe Dashboard'
                            onClick={generateLoginLink}
                            isLoading={loading}
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