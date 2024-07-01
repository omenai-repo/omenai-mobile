import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { galleryOrderModalStore, galleryOrderModalTypes } from 'store/modal/galleryModalStore';
import OrderCard from 'components/gallery/OrderCard';
import { formatPrice } from 'utils/priceFormatter';
import Divider from 'components/general/Divider';
import { getColors } from 'utils/sortFunctions.utils';
import { OrdersListingProps } from './PendingOrders';
import { orderCardStatusTypes } from './OrdersListing';

export default function CompletedOrders({data}: {data: any[]}) {
    // console.log(data[0].order_accepted.status)

    const getStatus = (order: any) : orderCardStatusTypes => {
        console.log(order.order_accepted.status)
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
                    url={item.artwork_data.url}
                    artist={item.artwork_data.artist}
                    amount={formatPrice(item.artwork_data.pricing.price)}
                    status={getStatus(item)}
                    artworkName={item.artwork_data.title}
                    color={getColors('completed')}
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