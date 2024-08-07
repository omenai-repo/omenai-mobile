import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import Divider from 'components/general/Divider'

export default function CheckoutSummary() {
    return (
        <View style={styles.container}>
            <Text style={{fontSize: 14, color: colors.primary_black, opacity: 0.8}}>Checkout Summary</Text>
            <Text style={{fontSize: 16, color: colors.primary_black, marginTop: 10}}>Omenai Pro subscription</Text>
            <View style={styles.listingContainer}>
                <Divider />
                <View style={{flexDirection: 'row', gap: 10}}>
                    <Text style={{fontSize: 14, color: colors.grey, flex: 1}}>Due today</Text>
                    <Text style={{fontSize: 16, color: colors.primary_black}}>$250</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderWidth: 1,
        borderColor: colors.grey50,
        borderRadius: 10,
        marginTop: 40,
        marginBottom: 100,
        zIndex: 20
    },
    listingContainer: {
        marginTop: 15,
        gap: 15
    }
})