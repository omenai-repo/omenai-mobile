import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import LongBlackButton from 'components/buttons/LongBlackButton'
import { useOrderSummaryStore } from 'store/orders/OrderSummaryStore'
import SummaryContainer from './SummaryContainer'
import OrderCard from 'screens/orders/components/OrderCard'
import { getImageFileView } from 'lib/storage/getImageFileView'
import { utils_formatPrice } from 'utils/utils_priceFormatter'

export default function OrderSummary({data: {
    title,
    url,
    artist,
    art_id,
    gallery_id,
    pricing
}}: {data: artworkOrderDataTypes}) {

    let image_href = getImageFileView(url, 300);

    return (
        <View style={styles.container}>
            <Text style={styles.titleHeader}>Order Summary</Text>
            <View style={styles.ordersContainer}>
                <View style={styles.listItem}>
                    <Image source={{uri: image_href}} style={{height: 100, width: 100, backgroundColor: '#f5f5f5', borderRadius: 3}} />
                    <View style={styles.listItemDetails}>
                        <Text style={[styles.orderItemTitle, {fontSize: 16, marginBottom: 5}]}>{title}</Text>
                        <Text style={styles.orderItemTitle}>{artist}</Text>
                        {pricing.shouldShowPrice === "Yes" ? <Text style={{fontSize: 18, fontWeight: '500', marginTop: 15}}>{utils_formatPrice(pricing.usd_price)}</Text> : <Text>Request Price</Text>}
                    </View>
                </View>
            </View>
            <SummaryContainer buttonTypes="Proceed to shipping" price={pricing.shouldShowPrice === "Yes" ? pricing.usd_price : 0} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        paddingTop: 0
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
    listItem: {
        paddingVertical: 25,
        flexDirection: 'row',
        gap: 15
    },
    statusPill: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        color: '#004617',
        fontSize: 12,
        borderRadius: 20,
        flexWrap: 'wrap'
    },
    listItemDetails: {
        flex: 1
    },
    orderItemTitle: {
        fontSize: 14,
        color: colors.primary_black
    },
    orderItemDetails: {
        color: '#616161',
        fontSize: 12,
        marginTop: 5
    },
})