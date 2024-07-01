import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { galleryOrderModalStore, galleryOrderModalTypes } from 'store/modal/galleryModalStore';
import OrderCard from 'components/gallery/OrderCard';
import { formatPrice } from 'utils/priceFormatter';
import Divider from 'components/general/Divider';
import { getColors } from 'utils/sortFunctions.utils';

type OrdersListingProps = {
    data: any[],
    handleOpenModal: (modalType: galleryOrderModalTypes, order_id: string) => void
}

export default function PendingOrders({data, handleOpenModal}: OrdersListingProps) {
    const { setArtworkDetails, setCurrentId} = galleryOrderModalStore();

    return (
        <FlatList
            data={data}
            renderItem={({item}) => (
                <OrderCard
                    url={item.artwork_data.url}
                    artist={item.artwork_data.artist}
                    amount={formatPrice(item.artwork_data.pricing.price)}
                    status={"Pending"}
                    artworkName={item.artwork_data.title}
                    color={getColors('')}
                    handlePress={() => {
                        handleOpenModal('pending', item.order_id)
                        setArtworkDetails([
                            {label: 'Artwork title', value: item.artwork_data.title},
                            {label: 'Artist name', value: item.artwork_data.artist},
                            {label: 'Price', value: formatPrice(item.artwork_data.pricing.price)},
                            {label: 'Buyer name', value: item.buyer.name},
                            {label: 'Address', value: `${item.shipping_address.address_line}, ${item.shipping_address.city}, ${item.shipping_address.country}, ${item.shipping_address.zip}`},
                        ])
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