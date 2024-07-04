import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { galleryOrderModalStore } from 'store/modal/galleryModalStore';
import OrderCard from './OrderCard';
import { formatPrice } from 'utils/priceFormatter';
import Divider from 'components/general/Divider';
import { getColors } from 'utils/sortFunctions.utils';
import { OrdersListingProps } from './PendingOrders';
import { orderCardStatusTypes } from './OrdersListing';

export default function CompletedOrders({data, handleOpenModal}: OrdersListingProps) {
    const { setArtworkDetails} = galleryOrderModalStore();

    const getStatus = (order: any) : orderCardStatusTypes => {
        if(order.order_accepted.status === "accepted"){
            return "Order completed"
        }
        
        return "Declined by gallery"
    };

    return (
        <FlatList
            data={data}
            renderItem={({item}) => (
                <OrderCard
                    amount={formatPrice(item.artwork_data.pricing.price)}
                    order_id={item.order_id}
                    status={getStatus(item)}
                    artworkName={item.artwork_data.title}
                    color={getColors('completed', item)}
                    handlePress={() => {
                        handleOpenModal('details', item.order_id)
                        setArtworkDetails({
                            url: item.artwork_data.url,
                            type: '',
                            details:[
                                {label: 'Artwork title', value: item.artwork_data.title},
                                {label: 'Artist name', value: item.artwork_data.artist},
                                {label: 'Price', value: formatPrice(item.artwork_data.pricing.price)},
                                {label: 'Buyer name', value: item.buyer.name},
                                {label: 'Address', value: `${item.shipping_address.address_line}, ${item.shipping_address.city}, ${item.shipping_address.country}, ${item.shipping_address.zip}`},
                        ]})
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