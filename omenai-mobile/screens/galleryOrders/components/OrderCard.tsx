import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { colors } from 'config/colors.config';
import { orderCardStatusTypes } from 'screens/galleryOrders/components/OrdersListing';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import { Feather, MaterialIcons } from '@expo/vector-icons';

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

    const statusPills = {
        'pending': (
            <View style={[styles.statusPill, color && {backgroundColor: color.bgColor}]}>
                <MaterialIcons name='info' />
                <Text style={[styles.status, color && {color: color.textColor}]}>Action required</Text>
            </View>
        ),
        'Pending tracking info': (
            <View style={[styles.statusPill, color && {backgroundColor: color.bgColor}]}>
                <MaterialIcons name='check-circle' size={14} />
                <Text style={[styles.status, color && {color: color.textColor}]}>Payment completed</Text>
            </View>
        ),
        'Declined by gallery': (
            <View style={[styles.statusPill, color && {backgroundColor: color.bgColor}]}>
                <Feather name='x-circle' size={14} color={color?.textColor} />
                <Text style={[styles.status, color && {color: color.textColor}]}>{status}</Text>
            </View>
        ),
        'Order completed': (
            <View style={[styles.statusPill, color && {backgroundColor: color.bgColor}]}>
                <MaterialIcons name='check-circle' size={14} />
                <Text style={[styles.status, color && {color: color.textColor}]}>{status}</Text>
            </View>
        ),
    };

    const defaultPill = (
        <View style={[styles.statusPill, color && {backgroundColor: color.bgColor}]}>
          <MaterialIcons name='info' />
          <Text style={[styles.status, color && {color: color.textColor}]}>{status}</Text>
        </View>
    );

    const ViewOrder = () => {
        let text = 'View order details';

        if(status === 'Pending tracking info'){
            text = 'Upload tracking info'
        }


        return(
            <TouchableOpacity onPress={() => handlePress(status)}>
                <View style={{backgroundColor: colors.primary_black, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 5}}>
                    <Text style={{fontSize: 14, color: colors.white}}>{text}</Text>
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
                    {statusPills[status] || defaultPill}
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
        paddingHorizontal: 15,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: '#FEF7EC',
        height: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    status: {
        textTransform: 'capitalize',
        fontSize: 12,
        color: '#F3A218'
    },
})