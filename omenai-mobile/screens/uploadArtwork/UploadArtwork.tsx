import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import WithModal from 'components/modal/WithModal'
import HeaderIndicator from './components/HeaderIndicator'
import ArtworkDetails from './components/ArtworkDetails'
import MoreArtworkDetails from './components/MoreArtworkDetails'
import { uploadArtworkStore } from 'store/artworks/UploadArtworkStore'

export default function UploadArtwork() {

    const {activeIndex} = uploadArtworkStore();

    return (
        <WithModal>
            <HeaderIndicator activeIndex={activeIndex} />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {activeIndex === 1 && <ArtworkDetails />}
                {activeIndex === 2 && <MoreArtworkDetails />}
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