import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { galleryOrderModalStore, galleryOrderModalTypes } from 'store/modal/galleryModalStore';
import OrderCard from './OrderCard';
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
                    amount={formatPrice(item.artwork_data.pricing.price)}
                    status={getStatus(item)}
                    artworkName={item.artwork_data.title}
                    order_id={item.order_id}
                    color={getColors('processing', item)}
                    handlePress={e => {

                        let detials = [
                            {label: 'Artwork title', value: item.artwork_data.title},
                            {label: 'Artist name', value: item.artwork_data.artist},
                            {label: 'Price', value: formatPrice(item.artwork_data.pricing.price)},
                            {label: 'Buyer name', value: item.buyer.name},
                            {label: 'Address', value: `${item.shipping_address.address_line}, ${item.shipping_address.city}, ${item.shipping_address.country}, ${item.shipping_address.zip}`},
                        ];
                        handleOpenModal("details", item.order_id);

                        if(e === "Pending tracking info"){
                            setArtworkDetails({
                                url: item.artwork_data.url,
                                type: 'trackingInfo',
                                details:detials
                            })
                        }else{
                            setArtworkDetails({
                                url: item.artwork_data.url,
                                type: '',
                                details: detials
                            })
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