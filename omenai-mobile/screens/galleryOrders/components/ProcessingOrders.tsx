import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { galleryOrderModalStore, galleryOrderModalTypes } from 'store/modal/galleryModalStore';
import OrderCard from 'components/gallery/OrderCard';
import { formatPrice } from 'utils/priceFormatter';
import Divider from 'components/general/Divider';
import { getColors } from 'utils/sortFunctions.utils';
import { OrdersListingProps } from './PendingOrders';
import { orderCardStatusTypes } from './OrdersListing';

export default function ProcessingOrders({data, handleOpenModal}: OrdersListingProps) {
    const { setArtworkDetails} = galleryOrderModalStore();

    const getStatus = (order: any) : orderCardStatusTypes => {
        if (order.payment_information.status === "pending") {
            return 'Pending customer payment';
        }
        
        return "Pending tracking info"
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
                    color={getColors('processing')}
                    handlePress={e => {
                        if(e === "Pending tracking info"){
                            handleOpenModal("provideTrackingInfo", item.order_id)
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