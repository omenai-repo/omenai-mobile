import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { colors } from 'config/colors.config';

type ListItemProps = {
    artworkName: string,
    artworkPrice: string,
    dateOrdered: string,
    status: string
}

export default function ListItem({artworkName, dateOrdered, status, artworkPrice}: ListItemProps) {
        return (
            <View style={styles.listItem}>
                <View style={styles.listItemDetails}>
                    <Text style={styles.orderItemTitle}>{artworkName}     ${parseFloat(artworkPrice).toLocaleString()}</Text>
                    <Text style={styles.orderItemDetails}>Ordered: {dateOrdered}</Text>
                </View>
                <Text style={styles.statusPill}>{status}</Text>
            </View>
        )
}

const styles = StyleSheet.create({
    listItem: {
        borderBottomWidth: 1,
        borderBottomColor: colors.inputBorder,
        paddingVertical: 25,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    statusPill: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: '#E7F6EC',
        color: '#004617',
        fontSize: 12,
        borderRadius: 20
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