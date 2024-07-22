import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import WithModal from 'components/modal/WithModal'
import BackHeaderTitle from 'components/header/BackHeaderTitle'
import { ScrollView } from 'react-native-gesture-handler'
import { useRoute } from '@react-navigation/native'

type editPricingparams = {
    art_id: string, 
    pricing: number, 
    usd_price: number, 
    shouldShowPrice: boolean
}

export default function EditArtwork() {
    const route = useRoute();

    const [price, setPrice] = useState<number>(0);
    const [usdPrice, setUsdPrice] = useState<number>(0);
    const [shouldShowPrice, setShouldShowPrice] = useState<boolean>(false)

    useEffect(() => {
        const {data} = route.params as {data: editPricingparams}
        console.log(data)
    }, [])

    return (
        <WithModal>
            <BackHeaderTitle title='Edit artwork' />
            <ScrollView style={styles.container}>

            </ScrollView>
        </WithModal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
        marginTop: 10
    }
})