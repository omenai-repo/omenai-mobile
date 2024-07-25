import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react';
import { colors } from 'config/colors.config';
import { formatPrice } from 'utils/priceFormatter';
import { getImageFileView } from 'lib/storage/getImageFileView';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import DropDownButton from './DropDownButton';
import { useModalStore } from 'store/modal/modalStore';
import StatusPill from './StatusPill';

type OrderCardProps = {
    artworkName: string,
    artworkPrice: number,
    dateOrdered: string,
    url: string,
    orderId: string,
    status: string,
    state: "pending" | "history",
    payment_information?: PaymentStatusTypes;
    tracking_information?: TrackingInformationTypes;
    shipping_quote?: ShippingQuoteTypes;
    order_accepted: OrderAcceptedStatusTypes;
    delivery_confirmed: boolean;
}

export default function OrderCard({artworkName, dateOrdered, status, state, artworkPrice, url, orderId, payment_information, tracking_information, shipping_quote, order_accepted, delivery_confirmed}: OrderCardProps) {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const [showTrackingInfo, setShowTrackingInfo] = useState<boolean>(false);
    const { updateModal } = useModalStore();

    async function  openTrackingLink() {
        const url = tracking_information?.tracking_link || ''

        const validUrl = await Linking.canOpenURL(url);
        if(validUrl){
            Linking.openURL(url)
        }else{
            updateModal({message: 'Invalid tracking link', modalType: 'error', showModal: true})
        }
    }

    let image_href = getImageFileView(url, 300);

    return (
        <View style={{paddingVertical: 10, gap: 15}}>
            <View style={styles.listItem}>
                <Image source={{uri: image_href}} style={{width: 100, backgroundColor: '#f5f5f5', borderRadius: 3}} />
                <View style={styles.listItemDetails}>
                    <Text style={styles.orderItemTitle}>{artworkName}</Text>
                    
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 7}}>
                        <Text style={{fontSize: 16, fontWeight: 500, flex: 1}}>{formatPrice(artworkPrice)}</Text>
                        <Text style={{fontSize: 14}}>Order ID: #{orderId}</Text>
                        {/* <Text style={styles.orderItemDetails}>Ordered: {dateOrdered}</Text> */}
                    </View>
                    <View style={{flexWrap: 'wrap', marginTop: 15}}>
                        <StatusPill 
                            status={status}
                            payment_status={payment_information?.status}
                            tracking_status={tracking_information?.tracking_link}
                            order_accepted={order_accepted.status}
                            delivery_confirmed={delivery_confirmed}
                        />
                    </View>
                    <View style={{flexWrap: 'wrap', marginTop: 15}}>
                    {state === "pending" ? (
                        (payment_information!.status === "completed") ? (tracking_information?.tracking_id.length > 0 ?
                            <DropDownButton label='View tracking information' onPress={setShowTrackingInfo} value={showTrackingInfo} />
                            :
                            // <Text style={{fontSize: 12, color: colors.primary_black, opacity: 0.6}}>Pending upload tracking info</Text>
                            null
                        ) : (
                            <View>
                            {shipping_quote?.shipping_fees !== "" && (
                                <FittedBlackButton height={40} value='Pay now' onClick={() => navigation.navigate(screenName.payment, {id: orderId})} isDisabled={false} />
                            )}
                            </View>
                        )
                        ) : null}
                    </View>
                </View>
            </View>
            {showTrackingInfo && (
                <View style={{gap: 10}}>
                    <View style={{flexDirection: 'row', gap: 10}}>
                        <Text style={{fontSize: 14, color: colors.primary_black}}>Tracking ID:</Text>
                        <Text style={{flex: 1, fontSize: 14, color: colors.primary_black}}>{tracking_information?.tracking_id}</Text>
                    </View>
                    <View style={{flexDirection: 'row', gap: 10}}>
                        <Text style={{fontSize: 14, color: colors.primary_black}}>Tracking link:</Text>
                        <TouchableOpacity style={{flexWrap: 'wrap', flex: 1, overflow: 'hidden'}} onPress={openTrackingLink}>
                            <Text style={{fontSize: 14, color: '#0000ff90', flexWrap: 'wrap'}}>{tracking_information?.tracking_link}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
        gap: 15
    },
    statusPill: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        color: '#004617',
        fontSize: 12,
        borderRadius: 20,
        flexWrap: 'wrap'
    },
    listItemDetails: {
        flex: 1
    },
    orderItemTitle: {
        fontSize: 14,
        color: colors.primary_black
    },
    orderItemDetails: {
        color: '#616161',
        fontSize: 12,
        marginTop: 5
    },
})