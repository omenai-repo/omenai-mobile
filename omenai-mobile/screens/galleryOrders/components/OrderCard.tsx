import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { colors } from 'config/colors.config';
import { orderCardStatusTypes } from 'screens/galleryOrders/components/OrdersListing';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import { Feather } from '@expo/vector-icons';

export type ordersColorsTypes = {bgColor: string, textColor: string}

type OrderItemProps = {
    artworkName: string,
    amount?: string,
    order_id: string,
    status: string,
    color?: ordersColorsTypes,
    handlePress: (e: orderCardStatusTypes) => void
}

export default function OrderCard({artworkName, amount, status, color, handlePress, order_id}: OrderItemProps) {

    let pill = <View style={[styles.statusPill, color && {backgroundColor: color.bgColor}]}><Text style={[styles.status, color && {color: color.textColor}]}>{status}</Text></View>
    if(status === 'pending'){
        pill = <View style={[styles.statusPill, color && {backgroundColor: color.bgColor}]}><Text style={[styles.status, color && {color: color.textColor}]}>Action required</Text></View>
    }else if(status === 'Pending tracking info'){
        pill = <View style={[styles.statusPill, color && {backgroundColor: color.bgColor, paddingHorizontal: 15}]}><Feather name='check-circle' /><Text style={[styles.status, color && {color: color.textColor}]}>Payment completed</Text></View>
    }

    const ViewOrder = () => {
        return(
            <TouchableOpacity onPress={() => handlePress(status)}>
                <View style={{backgroundColor: colors.white, borderWidth: 1, borderColor: colors.primary_black, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 5}}>
                    <Text style={{fontSize: 14, color: colors.black}}>View order</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return(
        <View style={styles.orderItem}>
            <View style={{flex: 1}}>
                <Text style={{fontSize: 14, marginBottom: 5}}>Order ID: {order_id}</Text>
                <Text style={{fontSize: 14, color: colors.primary_black}}>{artworkName}</Text>
                <Text style={{fontSize: 14, color: colors.primary_black, marginTop: 5, marginBottom: 10}}>{amount}</Text>
                <View style={{flexWrap: 'wrap'}}>
                    {pill}
                </View>
            </View>
            <View style={{alignItems: 'flex-end'}}>
                <ViewOrder />
            </View>
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
        height: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    status: {
        textTransform: 'capitalize',
        fontSize: 12,
        color: '#F3A218'
    },
})