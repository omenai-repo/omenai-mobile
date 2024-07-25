import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { formatIntlDateTime } from 'utils/formatIntlDateTime'
import { Feather } from '@expo/vector-icons'
import { colors } from 'config/colors.config'
import { sortOrdersDataByDate } from 'utils/sortOrdersDataByDate'
import OrderCard from './OrderCard'

type OrdersListingProps = {
    orders: any
}

export default function HistoryListing({orders}: OrdersListingProps) {

    // const history = sortOrdersDataByDate(orders);

    if(orders.length > 0)
        return (
            <View style={styles.container}>
                {orders.map((order, index) => (
                    <View key={index}>
                        <OrderCard
                            url={order.artwork_data.url}
                            orderId={order.order_id}
                            artworkName={order.artwork_data.title}
                            artworkPrice={order.artwork_data.pricing.usd_price}
                            dateOrdered={formatIntlDateTime(order.createdAt)}
                            state='pending'
                            status={order.status}
                            payment_information={order.payment_information}
                            tracking_information={order.tracking_information}
                            shipping_quote={order.shipping_quote}
                            order_accepted={order.order_accepted}
                            delivery_confirmed={order.delivery_confirmed}
                        />
                    </View>
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
        paddingHorizontal: 20,
        marginBottom: 50
    },
    emptyOrders: {
        height: 500,
        alignItems: 'center',
        justifyContent: 'center'
    }
})