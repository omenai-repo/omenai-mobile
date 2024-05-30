import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from 'config/colors.config'
import BackScreenButton from 'components/buttons/BackScreenButton'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
// import { ScrollView } from 'react-native-virtualized-view'
import TabsIndicator from './components/TabsIndicator'
import OrderSummary from './components/OrderSummary'
import { useOrderSummaryStore } from 'store/orders/OrderSummaryStore'
import ShippingDetails from './components/ShippingDetails'

export default function OrderDetails() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const { selectedSectionIndex } = useOrderSummaryStore();

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <SafeAreaView style={{paddingBottom: 0, marginBottom: 0}}>
                <View style={{paddingHorizontal: 20}}>
                    <BackScreenButton handleClick={() => navigation.goBack()}/>
                </View>
            </SafeAreaView>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.scrollContainer}
            >
            <ScrollView nestedScrollEnabled={true}>
                <TabsIndicator selectedIndex={selectedSectionIndex} />
                {selectedSectionIndex === 1 && <OrderSummary />}
                {selectedSectionIndex === 2 && <ShippingDetails />}
            </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: colors.white,
        // marginTop: 10,
    }
})