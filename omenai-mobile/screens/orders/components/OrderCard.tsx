import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { colors } from 'config/colors.config';
import { formatPrice } from 'utils/priceFormatter';
import { getImageFileView } from 'lib/storage/getImageFileView';
import FittedBlackButton from 'components/buttons/FittedBlackButton';

type OrderCardProps = {
    artworkName: string,
    artworkPrice: number,
    dateOrdered: string,
    url: string,
    orderId: string,
    status: string,
    state: "pending" | "history",
    payment_information?: PaymentStatusTypes;
    tracking_information?: TrackingInformationTypes;
    shipping_quote?: ShippingQuoteTypes;
}

export default function OrderCard({artworkName, dateOrdered, status, state, artworkPrice, url, orderId, payment_information, tracking_information, shipping_quote}: OrderCardProps) {

    let image_href = getImageFileView(url, 300);

    return (
        <View style={styles.listItem}>
            <Image source={{uri: image_href}} style={{height: 100, width: 100, backgroundColor: '#f5f5f5', borderRadius: 3}} />
            <View style={styles.listItemDetails}>
                <Text style={styles.orderItemTitle}>{artworkName}</Text>
                <Text style={{fontSize: 16, fontWeight: '500', marginTop: 5}}>{formatPrice(artworkPrice)}</Text>
                <Text style={{fontSize: 16, fontWeight: '500', marginTop: 5}}>{orderId}</Text>
                <Text style={styles.orderItemDetails}>Ordered: {dateOrdered}</Text>
                <View style={{flexWrap: 'wrap', marginTop: 20}}>
                {state === "pending" ? (
                    payment_information!.status === "completed" ? (
                        <Text>
                        View tracking information
                        </Text>
                    ) : (
                        <View>
                        {shipping_quote?.shipping_fees !== "" ? (
                            <FittedBlackButton value='Pay now' onClick={() => console.log('')} isDisabled={false} />
                        ) : (
                            <>
                            <Text>
                                Awaiting gallery confirmation
                            </Text>
                            </>
                        )}
                        </View>
                    )
                    ) : null}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    listItem: {
        borderBottomWidth: 1,
        borderBottomColor: colors.inputBorder,
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