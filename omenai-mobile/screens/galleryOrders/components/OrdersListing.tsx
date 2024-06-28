import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import OrderCard, { ordersColorsTypes } from 'components/gallery/OrderCard';
import Divider from 'components/general/Divider';
import { formatPrice } from 'utils/priceFormatter';
import { galleryOrdersStore } from 'store/gallery/galleryOrdersStore';

export type orderCardStatusTypes = 'Pending' | 'Pending customer payment' | 'Pending tracking info' | 'Declined'

export default function OrdersListing({data}: {data: any[]}) {
    console.log(data[0]);

    const { selectedTab } = galleryOrdersStore();

    const getStatus = (order: any) :orderCardStatusTypes => {
        //for pending status
        if (selectedTab === 'pending' && order.order_accepted.status === "") {
          return 'Pending';
        }

        //processing orders that has 
        if (selectedTab === 'processing' && order.payment_information.status === "pending") {
            return 'Pending customer payment';
        }

        if(selectedTab === 'processing' && order.tracking_information.tracking_id === ""){
            return "Pending tracking info"
        }
        
        return 'Declined';
    };

    const getColors = (): ordersColorsTypes => {
        if(selectedTab === 'processing'){
            return {bgColor: '#007BFF26', textColor: '#007BFF'}
        }

        if(selectedTab === 'completed'){
            return {bgColor: '#ff000026', textColor: '#ff0000'}
        }

        return {bgColor: '#FEF7EC', textColor: '#F3A218'}
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
                    color={getColors()}
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