import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons';
import { colors } from 'config/colors.config';
import Divider from 'components/general/Divider';

type OrderItemProps = {
    artworkName: string,
    status: "pending" | "delivered"
}

export default function RecentOrders() {

    const OrderItem = ({artworkName, status}: OrderItemProps) => {
        return(
            <View style={styles.orderItem}>
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 14, color: colors.primary_black}}>{artworkName}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 10}}>
                        <Text style={{fontSize: 12, color: '#858585'}}>30/05/2024</Text>
                        <View style={{height: 4, width: 4, borderRadius: 10, backgroundColor: '#858585'}} />
                        <Text style={{fontSize: 12, color: '#858585'}}>12:50AM</Text>
                    </View>
                    <Text style={{fontSize: 14, color: colors.primary_black}}>View details</Text>
                </View>
                <View style={{flexWrap: 'wrap'}}>
                    {status === "pending" && <View style={[styles.statusPill]}><Text style={[styles.status]}>{status}</Text></View>}
                    {status === "delivered" && <View style={[styles.statusPill, {backgroundColor: '#E7F6EC'}]}><Text style={[styles.status, {color: '#004617'}]}>{status}</Text></View>}
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: 18, fontWeight: '500', flex: 1}}>Recent orders</Text>
                <Feather name='chevron-right' size={20} style={{opacity: 0.5}} />
            </View>
            <View style={styles.mainContainer}>
                <OrderItem artworkName='Stary Nights' status='pending' />
                <Divider />
                <OrderItem artworkName='Jason Monalisa' status='pending' />
                <Divider />
                <OrderItem artworkName='The thousand year war' status='delivered' />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 40
    },
    mainContainer: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 5,
        padding: 15,
        gap: 20
    },
    orderItem: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
    statusPill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#FEF7EC',
        height: 'auto'
    },
    status: {
        textTransform: 'capitalize',
        fontSize: 12,
        color: '#F3A218'
    }
})