import { ScrollView, StyleSheet, Text, SafeAreaView, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import WithModal from 'components/modal/WithModal'
import Header from 'components/header/Header'
import TotalAmounts from './components/TotalAmounts';
import SalesOverview from './components/SalesOverview';
import RecentOrders from './components/RecentOrders';

export default function Overview() {
    const [refreshCount, setRefreshCount] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        // setRefreshing(true);
        setRefreshCount(prev => prev + 1)
    }, []);

    return (
        <WithModal> 
            <SafeAreaView>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <Header />
                    <TotalAmounts />
                    <SalesOverview />
                    <RecentOrders />
                </ScrollView>
            </SafeAreaView>
        </WithModal>
    )
}

const styles = StyleSheet.create({})