import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import HeaderTabs from './components/HeaderTabs'
import { getOverviewOrders } from 'services/orders/getOverviewOrders'
import { organizeOrders } from 'utils/utils_splitArray'
import { galleryOrdersStore } from 'store/gallery/galleryOrdersStore'
import WithGalleryModal from 'components/modal/WithGalleryModal'
import { galleryOrderModalStore, galleryOrderModalTypes } from 'store/modal/galleryModalStore'
import PendingOrders from './components/PendingOrders'
import ProcessingOrders from './components/ProcessingOrders'
import CompletedOrders from './components/CompletedOrders'
import EmptyOrdersListing from './components/EmptyOrdersListing'
import OrderslistingLoader from './components/OrderslistingLoader'

export default function GalleryOrdersListing() {
    const [refreshing, setRefreshing] = useState(false);

    const [isloading, setIsloading] = useState(false);

    const {data, setData, selectedTab} = galleryOrdersStore();
    const { setIsVisible, setModalType, setCurrentId} = galleryOrderModalStore();

    useEffect(() => {
        handleFetchOrders()
    }, [refreshing]);

    const handleFetchOrders = async () => {
        setIsloading(true)
        const results = await getOverviewOrders();
        let data = results.data

        const parsedOrders = organizeOrders(data)

        setData({
            pending: parsedOrders.pending,
            processing: parsedOrders.processing,
            completed: parsedOrders.completed
        })

        setRefreshing(false);
        setIsloading(false)
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
                {(selectedTab === "pending" && !isloading) &&
                    <PendingOrders 
                        data={data[selectedTab]} 
                        handleOpenModal={handleOpenModal}
                    />
                }
                {(selectedTab === "processing" && !isloading) &&
                    <ProcessingOrders 
                        data={data[selectedTab]} 
                        handleOpenModal={handleOpenModal}
                    />
                }
                {(selectedTab === "completed" && !isloading) &&
                    <CompletedOrders 
                        data={data[selectedTab]}
                        handleOpenModal={handleOpenModal}
                    />
                }
                {(data[selectedTab].length === 0 && !isloading) && (
                    <EmptyOrdersListing status={selectedTab} />
                )}
                {isloading && (
                    <OrderslistingLoader />
                )}
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