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

    const history = sortOrdersDataByDate(orders);

    if(history.length > 0)
        return (
            <View style={styles.container}>
                {history.map((orderlist, idx) => (
                    <View key={idx}>
                        <Text style={{fontSize: 16, fontWeight: '500', paddingVertical: 20}}>{orderlist.date}</Text>
                        {orderlist.data.map((order, index) => {
                            if (order.status !== "completed") return null;
                            return(
                                <OrderCard
                                    key={index}
                                    url={order.artwork_data.url}
                                    orderId={order.order_id}
                                    artworkName={order.artwork_data?.title}
                                    artworkPrice={order.artwork_data?.pricing.price}
                                    dateOrdered={formatIntlDateTime(order.createdAt)}
                                    status={order.status}
                                    state="history"
                                />
                            )
                        })}
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
        paddingHorizontal: 20
    },
    emptyOrders: {
        height: 500,
        alignItems: 'center',
        justifyContent: 'center'
    }
})