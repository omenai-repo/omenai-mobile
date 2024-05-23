import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import HeaderWithTitle from 'components/header/HeaderWithTitle'
import OrdersListing from './components/OrdersListing'

type TabItemProps = {
    name: OrderTabsTypes,
    isSelected: boolean
}

export type OrderTabsTypes = 'Orders' | 'Order history'

export default function Orders() {
    const [selectedTabs, setSelectedTabs] = useState<OrderTabsTypes>('Orders')

    useEffect(() => {

    }, []);

    const handleFetchOrders = async  () => {
        
    }

    const TabItem = ({name, isSelected}: TabItemProps) => {
        return(
            <TouchableOpacity style={[styles.tabItem, isSelected && {backgroundColor: colors.primary_black}]} onPress={() => setSelectedTabs(name)}>
                <Text style={[styles.tabItemText, isSelected && {color: colors.white}]}>{name}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <HeaderWithTitle pageTitle='Orders' />
            <ScrollView style={styles.mainContainer}>
                <View style={styles.tabContainer}>
                    <TabItem name='Orders'  isSelected={selectedTabs === 'Orders'} />
                    <TabItem name='Order history' isSelected={selectedTabs === 'Order history'} />
                </View>
                <OrdersListing listing={[]} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    mainContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        flex: 1
    },
    tabContainer: {
        flexDirection:'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.inputBorder,
        borderRadius: 8,
        padding: 15,
        gap: 15
    },
    tabItem: {
        height: 44,
        flex: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    tabItemText: {
        color: '#858585',
        fontSize: 14
    }
})