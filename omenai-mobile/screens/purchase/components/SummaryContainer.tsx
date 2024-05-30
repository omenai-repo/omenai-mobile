import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LongBlackButton from 'components/buttons/LongBlackButton'
import { colors } from 'config/colors.config'
import { useOrderSummaryStore } from 'store/orders/OrderSummaryStore';
import { formatPrice } from 'utils/priceFormatter';
import { createShippingOrder } from 'services/orders/createShippingOrder';
import { getAsyncData } from 'utils/asyncStorage.utils';

type SummaryContainerProps = {
    buttonTypes: "Proceed to shipping" | "Request price quote" | "Proceed to make payment",
    price?: number,
    disableButton?: boolean
}

export default function SummaryContainer({buttonTypes, price, disableButton}: SummaryContainerProps) {
    const { setIsLoading, address, city, country, state, zipCode, artworkOrderData, saveShippingAddress, setSelectedSectionIndex } = useOrderSummaryStore();

    const placeOrderHandler = async () => {
        setIsLoading(true);

        let userId = ''
        const userSession = await getAsyncData('userSession')
        if(userSession.value){
            userId = JSON.parse(userSession.value).id
        }
        //if there isn't a user id
        if(userId.length < 1) return

        const results = await createShippingOrder(
            userId,
            artworkOrderData.art_id,
            artworkOrderData.gallery_id,
            saveShippingAddress,
            {
                address_line: address,
                city,
                country,
                state,
                zip: zipCode,
            },
        )

        if(results?.isOk){
            console.log(results.message);
            setSelectedSectionIndex(3)
        }else{
            console.log('Error', results?.message)
        }

        setIsLoading(false)
    }

    return (
        <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>Summary</Text>
            <View style={styles.priceListing}>
                <View style={styles.priceListingItem}>
                    <Text style={{fontSize: 14, color: '#616161', flex: 1}}>Price</Text>
                    <Text style={{fontSize: 14, fontWeight: '500', color: '#616161'}}>{price ? formatPrice(price) : 'Request price'}</Text>
                </View>
                <View style={styles.priceListingItem}>
                    <Text style={{fontSize: 14, color: '#616161', flex: 1}}>Shipping</Text>
                    <Text style={{fontSize: 14, fontWeight: '500', color: '#616161'}}>To be calculated</Text>
                </View>
                <View style={styles.priceListingItem}>
                    <Text style={{fontSize: 14, color: '#616161', flex: 1}}>Taxes</Text>
                    <Text style={{fontSize: 14, fontWeight: '500', color: '#616161'}}>To be calculated</Text>
                </View>
            </View>
            <View style={styles.priceListingItem}>
                <Text style={{fontSize: 16, fontWeight: '500', color: colors.primary_black, flex: 1}}>Subtotal</Text>
                <Text style={{fontSize: 16, fontWeight: '500', color: colors.primary_black}}>Waiting for final cost</Text>
            </View>
            <View style={{marginTop: 40}}>
                <LongBlackButton value={buttonTypes} onClick={() => {
                    if(buttonTypes === "Proceed to shipping"){
                        setSelectedSectionIndex(2)
                    }else{
                        placeOrderHandler()
                    }
                }} isDisabled={disableButton} />
                {buttonTypes === "Proceed to shipping" && <Text style={{marginTop: 30, fontSize: 14, color: '#616161'}}>* Additional duties and taxes may apply at import</Text>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    summaryContainer: {
        borderWidth: 1,
        borderColor: colors.inputBorder,
        marginTop: 40,
        paddingHorizontal: 20,
        paddingVertical: 30
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
    }
})