import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Feather } from '@expo/vector-icons';
import { colors } from 'config/colors.config';
import Divider from 'components/general/Divider';
import { getOverviewOrders } from 'services/orders/getOverviewOrders';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import Loader from 'components/general/Loader';
import OrderCard from 'components/gallery/OrderCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';

export default function RecentOrders({refreshCount}: {refreshCount: number}) {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

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
            <View style={{gap: 20, marginTop: 20}}>
                <View style={{flexDirection: 'row', gap: 20}}>
                    <View style={{height: 100, width: 100, backgroundColor: colors.grey50}} />
                    <View>
                        <View style={{height: 20, backgroundColor: colors.grey50, width: 170, marginTop: 20}} />
                        <View style={{height: 20, backgroundColor: colors.grey50, width: 100, marginTop: 10}} />
                    </View>
                </View>
                <View style={{flexDirection: 'row', gap: 20}}>
                    <View style={{height: 100, width: 100, backgroundColor: colors.grey50}} />
                    <View>
                        <View style={{height: 20, backgroundColor: colors.grey50, width: 170, marginTop: 20}} />
                        <View style={{height: 20, backgroundColor: colors.grey50, width: 100, marginTop: 10}} />
                    </View>
                </View>
            </View>
        </View>
    )

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate(screenName.gallery.orders)}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: 16, fontWeight: '400', flex: 1}}>Recent orders</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                        <Text style={{fontSize: 14, opacity: 0.6}}>All orders</Text>
                        <Feather name='chevron-right' size={20} style={{opacity: 0.5}} />
                    </View>
                </View>
            </TouchableOpacity>
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
                            amount={utils_formatPrice(order.artwork_data.pricing.usd_price)}
                            
                        />
                        {(index + 1) !== data.length && <Divider />}
                    </View>
                ))}
                <View style={{flexWrap: 'wrap', marginRight: 'auto', marginLeft: 'auto'}}>
                    {data.length > 1 ?
                        <TouchableOpacity onPress={() => navigation.navigate(screenName.gallery.orders)}>
                            <View style={styles.pendingButton}>
                                <Text>View {data.length} pending orders</Text>
                            </View>
                        </TouchableOpacity>
                        :
                        <View style={styles.pendingButton}>
                            <Text>No pending orders</Text>
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