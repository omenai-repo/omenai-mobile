import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import WithModal from 'components/modal/WithModal'
import BackHeaderTitle from 'components/header/BackHeaderTitle'
import { ScrollView } from 'react-native-gesture-handler'
import { useRoute } from '@react-navigation/native'
import EditPricing from './components/EditPricing'


export default function EditArtwork() {
    const route = useRoute();
    const [artID, setArtID] = useState<string | null>(null)

    useEffect(() => {
        const {art_id} = route.params as {art_id: string}
        setArtID(art_id)
    }, [])

    return (
        <WithModal>
            <BackHeaderTitle title='Edit artwork pricong' />
            <ScrollView style={styles.container}>
                {artID &&
                    <EditPricing art_id={artID} />
                }
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