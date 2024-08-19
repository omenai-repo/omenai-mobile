import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { galleryOrderModalStore, galleryOrderModalTypes } from 'store/modal/galleryModalStore';
import OrderCard from './OrderCard';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import Divider from 'components/general/Divider';
import { utils_getColors } from 'utils/utils_sortFunctions';

export type OrdersListingProps = {
    data: any[],
    handleOpenModal: (modalType: galleryOrderModalTypes, order_id: string) => void
}

export default function PendingOrders({data, handleOpenModal}: OrdersListingProps) {
    const { setArtworkDetails} = galleryOrderModalStore();

    return (
        <FlatList
            data={data}
            renderItem={({item}) => (
                <OrderCard
                    amount={utils_formatPrice(item.artwork_data.pricing.usd_price)}
                    status={"pending"}
                    artworkName={item.artwork_data.title}
                    color={utils_getColors('')}
                    order_id={item.order_id}
                    handlePress={() => {
                        handleOpenModal('details', item.order_id)
                        setArtworkDetails({
                            url: item.artwork_data.url,
                            type: 'pending',
                            details:[
                                {label: 'Artwork title', value: item.artwork_data.title},
                                {label: 'Artist name', value: item.artwork_data.artist},
                                {label: 'Price', value: utils_formatPrice(item.artwork_data.pricing.usd_price)},
                                {label: 'Buyer name', value: item.buyer.name},
                                {label: 'Address', value: `${item.shipping_address.address_line}, ${item.shipping_address.city}, ${item.shipping_address.country}, ${item.shipping_address.zip}`},
                        ]})
                    }}
                />
            )}
            keyExtractor={(_, index) => JSON.stringify(index)}
            scrollEnabled={false}
            style={{marginTop: 20}}
            ItemSeparatorComponent={() => <View style={{paddingVertical: 15}}><Divider /></View>}
        />
    )
}

const styles = StyleSheet.create({})