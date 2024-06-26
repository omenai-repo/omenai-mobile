import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import WithModal from 'components/modal/WithModal'
import HeaderIndicator from './components/HeaderIndicator'
import ArtworkDetails from './components/ArtworkDetails'
import ArtworkDimensions from './components/ArtworkDimensions'
import { uploadArtworkStore } from 'store/artworks/UploadArtworkStore'
import ArtistDetails from './components/ArtistDetails'
import Pricing from './components/Pricing'
import UploadImage from './components/UploadImage'

export default function UploadArtwork() {

    const {activeIndex} = uploadArtworkStore();

    const components = [
        <ArtworkDetails />,
        <ArtworkDimensions />,
        <Pricing />,
        <ArtistDetails />,
        <UploadImage />
    ];

    return (
        <WithModal>
            <HeaderIndicator />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {components[activeIndex - 1]}
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