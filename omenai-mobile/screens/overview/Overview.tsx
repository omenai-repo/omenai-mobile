import { ScrollView, StyleSheet, Text, SafeAreaView, RefreshControl, View } from 'react-native'
import React, { useState } from 'react'
import WithModal from 'components/modal/WithModal'
import Header from 'components/header/Header'
import SalesOverview from './components/SalesOverview';
import RecentOrders from './components/RecentOrders';
import { HighlightCard } from './components/HighlightCard';

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
                    <View style={styles.container}>
                        <Text style={{fontSize: 18, fontWeight: '500'}}>Overview</Text>
                        <View style={styles.contentsContainer}>
                            <HighlightCard refreshCount={refreshCount} name='Total artworks' type="artworks" />
                            <HighlightCard refreshCount={refreshCount} name='Sold artworks' type="sales" />
                        </View>
                    </View>
                    <SalesOverview refreshCount={refreshCount}/>
                    <RecentOrders />
                </ScrollView>
            </SafeAreaView>
        </WithModal>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 40
    },
    contentsContainer: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 20
    },
})