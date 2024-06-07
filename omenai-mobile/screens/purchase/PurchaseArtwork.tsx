import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from 'config/colors.config'
import BackScreenButton from 'components/buttons/BackScreenButton'
import { useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
// import { ScrollView } from 'react-native-virtualized-view'
import TabsIndicator from './components/TabsIndicator'
import OrderSummary from './components/OrderSummary'
import { useOrderSummaryStore } from 'store/orders/OrderSummaryStore'
import ShippingDetails from './components/ShippingDetails'
import { fetchsingleArtworkOnPurchase } from 'services/artworks/fetchSingleArtworkOnPurchase'
import Loader from 'components/general/Loader'
import PriceQuoteSent from './components/PriceQuoteSent'
import { screenName } from 'constants/screenNames.constants'
import WithModal from 'components/modal/WithModal'

export default function PurchaseArtwork() {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const route = useRoute()
    const { selectedSectionIndex, setIsLoading, artworkOrderData, setArtworkOrderData, isLoading, resetState, setSelectedSectionIndex } = useOrderSummaryStore();

    useEffect(() => {
        handleFetchArtworkDetails()
    }, []);

    const handleFetchArtworkDetails = async () => {
        setIsLoading(true)

        const { title } = route.params as RouteParamsType

        const results = await fetchsingleArtworkOnPurchase(title)

        if(results.isOk){
            setArtworkOrderData(results.data)
        }else{
            console.log(results.body.mesage)
        }

        setIsLoading(false)
    };

    const handleBackNavigation = (goHome?: boolean) => {
        if(selectedSectionIndex === 2){
            setSelectedSectionIndex(selectedSectionIndex - 1)
        }else if(goHome){
            resetState()
            navigation.navigate(screenName.home)
        }else{
            resetState()
            navigation.goBack()
        }
        
    }

    return (
        <WithModal>
            <View style={{flex: 1, backgroundColor: colors.white}}>
                <SafeAreaView>
                    <View style={{paddingHorizontal: 20}}>
                        <BackScreenButton handleClick={handleBackNavigation}/>
                    </View>
                </SafeAreaView>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.scrollContainer}
                >
                <ScrollView nestedScrollEnabled={true}>
                    {/* <TabsIndicator selectedIndex={selectedSectionIndex} /> */}
                    {isLoading && <Loader />}
                    {(!isLoading && artworkOrderData) ? (
                        <>
                            {selectedSectionIndex === 1 && <OrderSummary data={artworkOrderData} />}
                            {selectedSectionIndex === 2 && <ShippingDetails data={artworkOrderData} />}
                            {selectedSectionIndex === 3 && <PriceQuoteSent handleClick={() => handleBackNavigation(true)}  />}
                        </>
                    ):
                        null
                    }
                </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </WithModal>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: colors.white,
        // marginTop: 10,
    }
})