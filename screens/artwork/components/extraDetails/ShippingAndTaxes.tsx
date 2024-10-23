import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'

export default function ShippingAndTaxes() {
    return (
        <View style={styles.container}>
            <View style={styles.header}><Text style={styles.title}>Shipping & taxes</Text></View>
            <View style={styles.mainContainer}>
                <View style={styles.detailItem}>
                    <Text style={[styles.detailItemText, {width: 120, fontWeight: '500'}]}>Taxes</Text>
                    <Text style={[styles.detailItemText, {flex: 1}]}>Calculated at checkout</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={[styles.detailItemText, {width: 120, fontWeight: '500'}]}>Shipping fee</Text>
                    <Text style={[styles.detailItemText, {flex: 1}]}>Calculated at checkout</Text>
                </View>
                <Text style={{textAlign: 'center', marginTop: 5, textDecorationLine: 'underline'}}>Learn more</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: colors.inputBorder,
    },
    header: {
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.primary_black
    },
    mainContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        gap: 15
    },
    detailItem: {
        flexDirection: 'row',
        gap: 20
    },
    detailItemText: {
        color: '#858585',
        fontSize: 14,
        lineHeight: 20
    }
})