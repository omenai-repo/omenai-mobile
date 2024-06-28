import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { colors } from 'config/colors.config';

export type ordersColorsTypes = {bgColor: string, textColor: string}

type OrderItemProps = {
    artworkName: string,
    artist: string,
    url: string,
    amount?: string,
    status: string,
    color?: ordersColorsTypes
}

export default function OrderCard({artworkName, artist, url, amount, status, color}: OrderItemProps) {
    let image_href = getImageFileView(url, 300);

    return(
        <View style={styles.orderItem}>
            <Image source={{uri: image_href}} alt='' style={{height: 100, width: 100}} />
            <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Text style={{fontSize: 14, color: colors.primary_black}}>{artworkName}</Text>
                <Text style={{fontSize: 14, color: colors.primary_black, marginTop: 5, marginBottom: 10}}>{amount}</Text>
                <View style={[styles.statusPill, color && {backgroundColor: color.bgColor}]}><Text style={[styles.status, color && {color: color.textColor}]}>{status}</Text></View>
            </View>
            {/* <View style={{flexWrap: 'wrap'}}>
                {status === "pending" && <View style={[styles.statusPill]}><Text style={[styles.status]}>{status}</Text></View>}
                {status === "delivered" && <View style={[styles.statusPill, {backgroundColor: '#E7F6EC'}]}><Text style={[styles.status, {color: '#004617'}]}>{status}</Text></View>}
            </View> */}
        </View>
    )
}

const styles = StyleSheet.create({
    orderItem: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
    statusPill: {
        paddingHorizontal: 20,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: '#FEF7EC',
        height: 'auto'
    },
    status: {
        textTransform: 'capitalize',
        fontSize: 12,
        color: '#F3A218'
    },
})