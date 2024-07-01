import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import OrderCard, { ordersColorsTypes } from 'components/gallery/OrderCard';
import Divider from 'components/general/Divider';
import { formatPrice } from 'utils/priceFormatter';
import { galleryOrdersStore } from 'store/gallery/galleryOrdersStore';
import { galleryOrderModalStore, galleryOrderModalTypes } from 'store/modal/galleryModalStore';
import { getColors } from 'utils/sortFunctions.utils';

export type orderCardStatusTypes = 'Pending' | 'Pending customer payment' | 'Pending tracking info' | 'Declined'

export default function OrdersListing({data}: {data: any[]}) {
    const { selectedTab } = galleryOrdersStore();
    const { setIsVisible, setModalType, setArtworkDetails, setCurrentId} = galleryOrderModalStore();

    const getStatus = (order: any) :orderCardStatusTypes => {
        //for pending status
        if (selectedTab === 'pending' && order.order_accepted.status === "") {
          return 'Pending';
        }

        //processing orders that has the payment info status set to pending
        if (selectedTab === 'processing' && order.payment_information.status === "pending") {
            return 'Pending customer payment';
        }

        if(selectedTab === 'processing' && order.tracking_information.tracking_id === ""){
            return "Pending tracking info"
        }
        
        return 'Declined';
    };

    const handleOpenModal = (modal: galleryOrderModalTypes) => {
        setIsVisible(true)
        setModalType(modal)
    }

    return (
        <FlatList
            data={data}
            renderItem={({item}) => (
                <OrderCard
                    url={item.artwork_data.url}
                    artist={item.artwork_data.artist}
                    amount={formatPrice(item.artwork_data.pricing.price)}
                    status={getStatus(item)}
                    artworkName={item.artwork_data.title}
                    color={getColors(selectedTab)}
                    handlePress={e => {
                        setCurrentId(item.order_id)

                        if(e === 'Pending'){
                            handleOpenModal('pending')
                            setArtworkDetails([
                                {label: 'Artwork title', value: item.artwork_data.title},
                                {label: 'Artist name', value: item.artwork_data.artist},
                                {label: 'Price', value: formatPrice(item.artwork_data.pricing.price)},
                                {label: 'Buyer name', value: item.buyer.name},
                                {label: 'Address', value: `${item.shipping_address.address_line}, ${item.shipping_address.city}, ${item.shipping_address.country}, ${item.shipping_address.zip}`},
                            ])
                        }else if(e === 'Pending tracking info'){

                        }
                    }}
                />
            )}
            keyExtractor={(_, index) => JSON.stringify(index)}
            scrollEnabled={false}
            style={{marginTop: 20}}
            ItemSeparatorComponent={() => <View style={{paddingVertical: 10}}><Divider /></View>}
        />
    )
}

const styles = StyleSheet.create({})