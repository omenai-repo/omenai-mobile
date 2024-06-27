import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import WithModal from 'components/modal/WithModal'
import HeaderIndicator from './components/HeaderIndicator'
import ArtworkDetails from './components/ArtworkDetails'
import ArtworkDimensions from './components/ArtworkDimensions'
import ArtistDetails from './components/ArtistDetails'
import Pricing from './components/Pricing'
import UploadImage from './components/UploadImage'
import { uploadArtworkStore } from 'store/gallery/uploadArtworkStore'

export default function UploadArtwork() {

    const {activeIndex, artworkUploadData} = uploadArtworkStore();

    useEffect(() => {
        console.log(artworkUploadData.artist_country_origin)
    }, [artworkUploadData])

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