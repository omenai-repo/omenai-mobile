import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import WithModal from 'components/modal/WithModal'
import HeaderTabs from './components/HeaderTabs'
import OrdersListing from './components/OrdersListing'
import { getOverviewOrders } from 'services/orders/getOverviewOrders'
import { organizeOrders } from 'utils/splitArray'
import { galleryOrdersStore } from 'store/gallery/galleryOrdersStore'
import WithGalleryModal from 'components/modal/WithGalleryModal'
import { galleryOrderModalStore, galleryOrderModalTypes } from 'store/modal/galleryModalStore'
import PendingOrders from './components/PendingOrders'

export default function GalleryOrdersListing() {
    const [refreshing, setRefreshing] = useState(false);

    const {data, setData, selectedTab} = galleryOrdersStore();
    const { setIsVisible, setModalType, setCurrentId} = galleryOrderModalStore();

    useEffect(() => {
        handleFetchOrders()
    }, [refreshing]);

    const handleFetchOrders = async () => {
        const results = await getOverviewOrders();
        let data = results.data

        const parsedOrders = organizeOrders(data)

        setData({
            pending: parsedOrders.pending,
            processing: parsedOrders.processing,
            completed: parsedOrders.completed
        })

        setRefreshing(false)
    };

    const handleOpenModal = (modal: galleryOrderModalTypes, order_id: string) => {
        setIsVisible(true)
        setModalType(modal)
        setCurrentId(order_id)
    }

    return (
        <WithGalleryModal>
            <HeaderTabs />
            <ScrollView 
                style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(true)} />
                }
            >
                {selectedTab === "pending" &&
                    <PendingOrders 
                        data={data[selectedTab]} 
                        handleOpenModal={handleOpenModal}
                    />
                }
            </ScrollView>
        </WithGalleryModal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20
    }
})