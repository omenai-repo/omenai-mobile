import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import { useAppStore } from 'store/app/appStore'

export default function BillingInfo() {
    const { userSession } = useAppStore();

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.planTitleContainer}>
                    <Text style={{fontSize: 16, color: colors.primary_black}}>Billing info</Text>
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <Text>Gallery name: <Text style={{fontWeight: 500}}>{userSession.name}</Text></Text>
                <Text>Email address: <Text style={{fontWeight: 500}}>{userSession.email}</Text></Text>
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
        borderTopColor: colors.grey50,
        gap: 12
    },
})