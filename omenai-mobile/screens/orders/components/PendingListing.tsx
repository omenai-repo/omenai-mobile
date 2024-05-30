import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import { Feather } from '@expo/vector-icons'
import { formatIntlDateTime } from 'utils/formatIntlDateTime'
import OrderCard from './OrderCard'

type PendingListingProps = {
    listing: any[]
}

export default function PendingListing({listing}: PendingListingProps) {

    if(listing.length > 0)
    return (
        <View style={styles.container}>
            {listing.map((order, idx) => (
                <OrderCard
                    key={idx}
                    url={order.artwork_data.url}
                    orderId={order.order_id}
                    artworkName={order.artwork_data.title}
                    artworkPrice={order.artwork_data.pricing.price}
                    dateOrdered={formatIntlDateTime(order.createdAt)}
                    state='pending'
                    status={order.status}
                    payment_information={order.payment_information}
                    tracking_information={order.tracking_information}
                    shipping_quote={order.shipping_quote}
                />
            ))}
        </View>
    )

    return(
        <View style={styles.emptyOrders}>
            <Feather name='package' size={40} color={colors.primary_black} />
            <Text style={{fontSize: 18, marginTop: 10, color: colors.primary_black}}>No orders on your account</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: colors.inputBorder,
        borderRadius: 8,
        marginTop: 30,
        paddingHorizontal: 20
    },
    emptyOrders: {
        height: 500,
        alignItems: 'center',
        justifyContent: 'center'
    }
})