import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Feather } from '@expo/vector-icons';
import { colors } from 'config/colors.config';
import Divider from 'components/general/Divider';
import { getOverviewOrders } from 'services/orders/getOverviewOrders';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { formatPrice } from 'utils/priceFormatter';
import Loader from 'components/general/Loader';

type OrderItemProps = {
    artworkName: string,
    artist: string,
    url: string,
    amount?: number
}

export default function RecentOrders({refreshCount}: {refreshCount: number}) {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        async function handleFetchRecentOrders(){
            const results = await getOverviewOrders();

            setData(results.data)

            setIsLoading(false)
        };

        handleFetchRecentOrders();
    }, [refreshCount])

    const OrderItem = ({artworkName, artist, url, amount}: OrderItemProps) => {
        let image_href = getImageFileView(url, 300);

        return(
            <View style={styles.orderItem}>
                <Image source={{uri: image_href}} alt='' style={{height: 100, width: 100}} />
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 14, color: colors.primary_black}}>{artworkName}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 10}}>
                        <Text style={{fontSize: 12, color: '#858585'}}>{artist}</Text>
                    </View>
                    <Text style={{fontSize: 14, color: colors.primary_black}}>{amount}</Text>
                </View>
                {/* <View style={{flexWrap: 'wrap'}}>
                    {status === "pending" && <View style={[styles.statusPill]}><Text style={[styles.status]}>{status}</Text></View>}
                    {status === "delivered" && <View style={[styles.statusPill, {backgroundColor: '#E7F6EC'}]}><Text style={[styles.status, {color: '#004617'}]}>{status}</Text></View>}
                </View> */}
            </View>
        )
    };

    if(isLoading)return(
        <View style={styles.container}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: 18, fontWeight: '500', flex: 1}}>Recent orders</Text>
                <Feather name='chevron-right' size={20} style={{opacity: 0.5}} />
            </View>
            <Loader />
        </View>
    )

    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: 18, fontWeight: '500', flex: 1}}>Recent orders</Text>
                <Feather name='chevron-right' size={20} style={{opacity: 0.5}} />
            </View>
            <View style={styles.mainContainer}>
                {data.map((order, index) => (
                    <>
                    <OrderItem 
                        artworkName={order.artwork_data.title}
                        artist={order.artwork_data.artist}
                        url={order.artwork_data.url}
                        amount={order.artwork_data.pricing.shouldShowPrice && formatPrice(order.artwork_data.pricing.price)}
                        key={index}
                    />
                    {(index + 1) !== data.length && <Divider />}
                    </>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 40
    },
    mainContainer: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 5,
        padding: 15,
        gap: 20
    },
    orderItem: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
    statusPill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#FEF7EC',
        height: 'auto'
    },
    status: {
        textTransform: 'capitalize',
        fontSize: 12,
        color: '#F3A218'
    }
})