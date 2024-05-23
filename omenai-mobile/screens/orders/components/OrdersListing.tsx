import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'

type OrdersListingProps = {
    listing: any[]
}

export default function OrdersListing({listing}: OrdersListingProps) {

    const ListItem = () => {
        return(
            <View style={styles.listItem}>
                <View style={styles.listItemDetails}>
                    <Text style={styles.orderItemTitle}>Name of artwork</Text>
                    <Text style={styles.orderItemDetails}>To be delivered: 12-02-2024</Text>
                </View>
                <Text style={styles.statusPill}>Delivered</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ListItem />
            <ListItem />
            <ListItem />
            <ListItem />
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
    }
})