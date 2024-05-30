import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LongBlackButton from 'components/buttons/LongBlackButton'
import { colors } from 'config/colors.config'
import { useOrderSummaryStore } from 'store/orders/OrderSummaryStore';

type SummaryContainerProps = {
    buttonTypes: "Proceed to shipping" | "Request price quote" | "Proceed to make payment"
}

export default function SummaryContainer({buttonTypes}: SummaryContainerProps) {
    const { setSelectedSectionIndex } = useOrderSummaryStore();

    return (
        <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>Summary</Text>
            <View style={styles.priceListing}>
                {[0,1,2].map(i => (
                    <View style={styles.priceListingItem} key={i}>
                        <Text style={{fontSize: 14, color: '#616161', flex: 1}}>Artwork Name</Text>
                        <Text style={{fontSize: 14, fontWeight: '500', color: '#616161'}}>${i},000</Text>
                    </View>
                ))}
            </View>
            <View style={styles.priceListingItem}>
                <Text style={{fontSize: 16, fontWeight: '500', color: colors.primary_black, flex: 1}}>Subtotal</Text>
                <Text style={{fontSize: 16, fontWeight: '500', color: colors.primary_black}}>$4,000</Text>
            </View>
            <View style={{marginTop: 40}}>
                <LongBlackButton value={buttonTypes} onClick={() => setSelectedSectionIndex(2)} />
                {buttonTypes === "Proceed to shipping" && <Text style={{marginTop: 30, fontSize: 14, color: '#616161'}}>* Taxes and shipping to be calculated</Text>}
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