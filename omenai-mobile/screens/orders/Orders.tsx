import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import HeaderWithTitle from 'components/header/HeaderWithTitle'
import OrdersListing from './components/PendingListing'
import { getOrdersForUser } from 'services/orders/getOrdersForUser'
import { useOrderStore } from 'store/orders/Orders'
import HistoryListing from './components/HistoryListing'

type TabItemProps = {
    name: OrderTabsTypes,
    isSelected: boolean
}

export type OrderTabsTypes = 'Pending' | 'Order history'

export default function Orders() {
    const {selectedTab, setSelectedTab, isLoading, setIsLoading, data, setData} = useOrderStore();


    useEffect(() => {
        handleFetchOrders()
    }, [selectedTab]);

    const handleFetchOrders = async  () => {
        setIsLoading(true)

        const results = await getOrdersForUser(selectedTab);

        if(results.isOk){
            setData(results.data)
        }else{
            console.log(results.message)
        }

        setIsLoading(false)
    }

    const TabItem = ({name, isSelected}: TabItemProps) => {
        return(
            <TouchableOpacity style={[styles.tabItem, isSelected && {backgroundColor: colors.primary_black}]} onPress={() => setSelectedTab(name)}>
                <Text style={[styles.tabItemText, isSelected && {color: colors.white}]}>{name}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <HeaderWithTitle pageTitle='Orders' />
            <ScrollView style={styles.mainContainer}>
                <View style={styles.tabContainer}>
                    <TabItem name='Pending'  isSelected={selectedTab === 'Pending'} />
                    <TabItem name='Order history' isSelected={selectedTab === 'Order history'} />
                </View>
                {isLoading ? 
                    <View style={styles.loadingContainer}>
                        <Text>Loading...</Text>
                    </View>
                : 
                    <View>
                    {selectedTab === 'Pending' ?
                        <OrdersListing listing={data} />
                    :
                        <HistoryListing orders={data} />
                    }
                    </View>
                }
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
    },
    loadingContainer: {
        height: 500,
        alignItems: 'center',
        justifyContent: 'center'
    }
})