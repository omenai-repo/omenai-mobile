import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import BackHeaderTitle from 'components/header/BackHeaderTitle'
import LongBlackButton from 'components/buttons/LongBlackButton'
import { formatPrice } from 'utils/priceFormatter'
import { calculatePurchaseGrandTotalNumber } from 'utils/calculatePurchaseGrandTotal'
import { Feather } from '@expo/vector-icons'
import { useAppStore } from 'store/app/appStore'
import { createOrderLock } from 'services/orders/createOrderLock'
import { useModalStore } from 'store/modal/modalStore'
import { getAppDeepLink } from 'config/getAppDeepLink.config'
import { useStripe } from '@stripe/stripe-react-native';
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { screenName } from 'constants/screenNames.constants'

export default function OrderDetails({data, locked}:{data: any, locked: boolean}) {
    const navigation = useNavigation<StackNavigationProp<any>>();
    // const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const [loading, setLoading] = useState<boolean>(false)
    const { userSession } = useAppStore();
    const { updateModal } = useModalStore()

    const total_price_number = calculatePurchaseGrandTotalNumber(
        data.artwork_data.pricing.price,
        data.shipping_quote.shipping_fees,
        data.shipping_quote.taxes
    );

    async function handleClickPayNow(){
        setLoading(true);
        
        const deepLink = getAppDeepLink()

        const get_purchase_lock = await createOrderLock(data.artwork_data.art_id, userSession.id);
        if (get_purchase_lock?.isOk) {
            if (get_purchase_lock.data.lock_data.user_id === userSession.id) {

                //pay with stripe SDK
                navigation.goBack()
                navigation.navigate(screenName.cancleOrderPayment, {art_id: data.artwork_data.art_id})

            }else{
                throwError("A user is currently processing a purchase transaction on this artwork. Please check back in a few minutes for a status update")
            }
        }

        setLoading(false)
    }

    const throwError = (message: string) => {
        updateModal({message, modalType: 'error', showModal: true})
    }

    return (
        <View style={{flex: 1}}>
            <BackHeaderTitle title='Confirm order details' />
            <ScrollView style={styles.container}>
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryText}>Summary</Text>
                    <View style={styles.priceListing}>
                        <View style={styles.priceListingItem}>
                            <Text style={{fontSize: 14, color: '#616161', flex: 1}}>Price</Text>
                            <Text style={{fontSize: 14, fontWeight: '500', color: '#616161'}}>{formatPrice(data.artwork_data.pricing.price)}</Text>
                        </View>
                        <View style={styles.priceListingItem}>
                            <Text style={{fontSize: 14, color: '#616161', flex: 1}}>Shipping</Text>
                            <Text style={{fontSize: 14, fontWeight: '500', color: '#616161'}}>{formatPrice(data.shipping_quote.shipping_fees)}</Text>
                        </View>
                        <View style={styles.priceListingItem}>
                            <Text style={{fontSize: 14, color: '#616161', flex: 1}}>Taxes</Text>
                            <Text style={{fontSize: 14, fontWeight: '500', color: '#616161'}}>{formatPrice(data.shipping_quote.taxes)}</Text>
                        </View>
                    </View>
                    <View style={styles.priceListingItem}>
                        <Text style={{fontSize: 16, fontWeight: '500', color: colors.primary_black, flex: 1}}>Subtotal</Text>
                        <Text style={{fontSize: 16, fontWeight: '500', color: colors.primary_black}}>{formatPrice(total_price_number)}</Text>
                    </View>
                    <View style={{marginTop: 49}}>
                        <LongBlackButton 
                            value='Proceed to payment' 
                            onClick={handleClickPayNow} 
                            isLoading={loading}
                            isDisabled={locked} 
                        />
                        {locked &&
                            <View style={styles.LockContainer}>
                                <Feather name='lock' color={'#ff000090'} size={16} style={{marginTop: 7}} />
                                <Text style={{fontSize: 14, color: '#ff000090', flex: 1}}>Another user has initiated a payment transaction on this artwork. Please refresh your page in a few minutes to confirm the availability of this artwork.</Text>
                            </View>
                        }
                        <Text style={{marginTop: 30, fontSize: 14, color: colors.grey, textAlign: 'center'}}>In order to prevent multiple transaction attempts for this artwork, we have implemented a queueing system and lock mechanism which prevents other users from accessing the payment portal</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 15,
        marginTop: 15,
        flex: 1
    },
    summaryContainer: {
        borderWidth: 1,
        borderColor: colors.inputBorder,
        paddingHorizontal: 20,
        paddingVertical: 30,
        backgroundColor: '#FAFAFA'
    },
    summaryText: {
        fontSize: 16,
        color: colors.primary_black,
        fontWeight: 500
    },
    priceListing: {
        marginVertical: 20,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.grey50,
        gap: 20
    },
    priceListingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    LockContainer: {
        padding: 10,
        backgroundColor: '#eee',
        borderRadius: 7,
        flexDirection: 'row',
        gap: 15,
        paddingHorizontal: 20,
        marginTop: 20
    }
})