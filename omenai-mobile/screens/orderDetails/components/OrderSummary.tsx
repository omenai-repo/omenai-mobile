import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import ListItem from 'screens/orders/components/ListItem'
import LongBlackButton from 'components/buttons/LongBlackButton'
import { useOrderSummaryStore } from 'store/orders/OrderSummaryStore'
import SummaryContainer from './SummaryContainer'

export default function OrderSummary() {
    return (
        <View style={styles.container}>
            <Text style={styles.titleHeader}>Order Summary</Text>
            <View style={styles.ordersContainer}>
                {[0].map(i => (
                    <ListItem
                        key={i}
                        url={''}
                        orderId={'12345678'}
                        artworkName={'Artwork Title'}
                        artworkPrice={2000}
                        dateOrdered={'12th of june'}
                        status='pending'
                    />
                ))}
            </View>
            <SummaryContainer buttonTypes="Proceed to shipping" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    titleHeader: {
        fontSize: 20,
        fontWeight: 500,
        color: colors.primary_black
    },
    ordersContainer: {
        borderWidth: 1,
        borderColor: colors.inputBorder,
        marginTop: 30,
        paddingHorizontal: 20
    },
})