import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Feather } from '@expo/vector-icons';
import { colors } from 'config/colors.config';
import Divider from 'components/general/Divider';
import { getOverviewOrders } from 'services/orders/getOverviewOrders';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { formatPrice } from 'utils/priceFormatter';
import Loader from 'components/general/Loader';
import OrderCard from 'components/gallery/OrderCard';

export default function RecentOrders({refreshCount}: {refreshCount: number}) {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [morePendingOrders, setMorePendingOrders] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        async function handleFetchRecentOrders(){
            const results = await getOverviewOrders();
            let data = results.data


            const arr : any[] = [];

            data.map((i: any) => {
                let stat = i.order_accepted.status === ""
                if(stat){
                    if(arr.length !== 3){
                        arr.push(i)
                    }else{
                        setMorePendingOrders(true)
                    }
                }
            })

            setData(arr)

            setIsLoading(false)
        };

        handleFetchRecentOrders();
    }, [refreshCount])

    if(isLoading)return(
        <View style={styles.container}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: 16, fontWeight: '400', flex: 1}}>Recent orders</Text>
                <Feather name='chevron-right' size={20} style={{opacity: 0.5}} />
            </View>
            <Loader />
        </View>
    )

    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: 16, fontWeight: '400', flex: 1}}>Recent orders</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                    <Text style={{fontSize: 14, opacity: 0.6}}>All orders</Text>
                    <Feather name='chevron-right' size={20} style={{opacity: 0.5}} />
                </View>
            </View>
            <View style={styles.mainContainer}>
                {data.length > 0 && data.map((order, index) => (
                    <View 
                        key={index}
                        style={{gap: 20}}
                    >
                        <OrderCard 
                            artworkName={order.artwork_data.title}
                            artist={order.artwork_data.artist}
                            url={order.artwork_data.url}
                            status={'Pending'}
                            amount={order.artwork_data.pricing.shouldShowPrice && formatPrice(order.artwork_data.pricing.price)}
                            
                        />
                        {(index + 1) !== data.length && <Divider />}
                    </View>
                ))}
                {data.length === 0 && (
                    <View style={{paddingVertical: 20, alignItems: 'center'}}>
                        <Text>No orders yet</Text>
                    </View>
                )}
                <View style={{flexWrap: 'wrap', marginRight: 'auto', marginLeft: 'auto'}}>
                    {morePendingOrders &&
                        <View style={styles.pendingButton}>
                            <Text>View all pending orders</Text>
                        </View>
                    }
                </View>
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
    pendingButton: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        backgroundColor: '#f5f5f5',
        borderRadius: 40,
        marginVertical: 20,
    }
})