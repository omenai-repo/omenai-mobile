import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import WithModal from 'components/modal/WithModal'
import HeaderIndicator from './components/HeaderIndicator'
import ArtworkDetails from './components/ArtworkDetails'

export default function UploadArtwork() {
    return (
        <WithModal>
            <HeaderIndicator activeIndex={1} />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <ArtworkDetails />
            </ScrollView>
        </WithModal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 20,
        paddingTop: 20
    }
})