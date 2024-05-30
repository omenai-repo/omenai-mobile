import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import BackScreenButton from 'components/buttons/BackScreenButton'
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from 'config/colors.config';
import LongBlackButton from 'components/buttons/LongBlackButton';

export default function Payment() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <SafeAreaView style={{paddingBottom: 0, marginBottom: 0}}>
                <View style={{paddingHorizontal: 20}}>
                    <BackScreenButton handleClick={() => {
                        navigation.goBack()
                    }}/>
                </View>
                <View style={styles.container}>
                    <Text style={styles.titleHeader}>Confirm and make payment</Text>
                    <View style={styles.summaryContainer}>
                    <Text style={styles.summaryText}>Summary</Text>
                        <View style={styles.priceListing}>
                            <View style={styles.priceListingItem}>
                                <Text style={{fontSize: 14, color: '#616161', flex: 1}}>Price</Text>
                                <Text style={{fontSize: 14, fontWeight: '500', color: '#616161'}}>$50,000</Text>
                            </View>
                            <View style={styles.priceListingItem}>
                                <Text style={{fontSize: 14, color: '#616161', flex: 1}}>Shipping</Text>
                                <Text style={{fontSize: 14, fontWeight: '500', color: '#616161'}}>$70</Text>
                            </View>
                            <View style={styles.priceListingItem}>
                                <Text style={{fontSize: 14, color: '#616161', flex: 1}}>Taxes</Text>
                                <Text style={{fontSize: 14, fontWeight: '500', color: '#616161'}}>$30</Text>
                            </View>
                        </View>
                        <View style={styles.priceListingItem}>
                            <Text style={{fontSize: 16, fontWeight: '500', color: colors.primary_black, flex: 1}}>Subtotal</Text>
                            <Text style={{fontSize: 16, fontWeight: '500', color: colors.primary_black}}>$50,100</Text>
                        </View>
                        <View style={{marginTop: 49}}>
                            <LongBlackButton value='Proceed to payment' onClick={() => console.log('')} />
                            <Text style={{marginTop: 30, fontSize: 14, color: '#ff0000', textAlign: 'center'}}>In order to prevent multiple transaction attempts for this artwork, we have implemented a queueing system and lock mechanism which prevents other users from accessing the payment portal</Text>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    titleHeader: {
        fontSize: 20,
        fontWeight: 500,
        color: colors.primary_black,
        textAlign: 'center'
    },
    summaryContainer: {
        borderWidth: 1,
        borderColor: colors.inputBorder,
        marginTop: 40,
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
    }
})