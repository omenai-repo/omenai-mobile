import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import { Feather } from '@expo/vector-icons'
import { formatIntlDateTime } from 'utils/formatIntlDateTime'
import ListItem from './ListItem'

type PendingListingProps = {
    listing: any[]
}

export default function PendingListing({listing}: PendingListingProps) {

    if(listing.length > 0)
    return (
        <View style={styles.container}>
            {listing.map((order, idx) => (
                <ListItem
                    key={idx}
                    artworkName={order.artwork_data.title}
                    artworkPrice={order.artwork_data.pricing.price}
                    dateOrdered={formatIntlDateTime(order.createdAt)}
                    status='pending'
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