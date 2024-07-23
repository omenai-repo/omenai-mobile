import { StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import HeaderWithTitle from 'components/header/HeaderWithTitle'
import OrdersListing from './components/PendingListing'
import { getOrdersForUser } from 'services/orders/getOrdersForUser'
import { useOrderStore } from 'store/orders/Orders'
import HistoryListing from './components/HistoryListing'
import Loader from 'components/general/Loader'
import WithModal from 'components/modal/WithModal'
import OrderslistingLoader from 'screens/galleryOrders/components/OrderslistingLoader'

type TabItemProps = {
    name: OrderTabsTypes,
    isSelected: boolean
}

export type OrderTabsTypes = 'Pending' | 'Order history'

export default function Orders() {
    const {selectedTab, setSelectedTab, isLoading, setIsLoading, data, setData} = useOrderStore();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        // setRefreshing(true);
        handleFetchOrders()
    }, []);


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
        <WithModal>
            <SafeAreaView>
                <View style={{paddingHorizontal: 20}}>
                    <View style={[styles.tabContainer]}>
                        <TabItem name='Pending'  isSelected={selectedTab === 'Pending'} />
                        <TabItem name='Order history' isSelected={selectedTab === 'Order history'} />
                    </View>
                </View>
            </SafeAreaView>
            <ScrollView style={styles.mainContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                
                {isLoading ? 
                    <OrderslistingLoader />
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
        </WithModal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    mainContainer: {
        paddingHorizontal: 20,
        flex: 1
    },
    tabContainer: {
        flexDirection:'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.inputBorder,
        borderRadius: 8,
        padding: 10,
        gap: 10
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