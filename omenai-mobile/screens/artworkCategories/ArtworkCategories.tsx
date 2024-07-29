import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { colors } from 'config/colors.config';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import ArtworksListing from './components/ArtworksListing';
import MiniArtworkCard from 'components/artwork/MiniArtworkCard';
import MiniArtworkCardLoader from 'components/general/MiniArtworkCardLoader';
import { RefreshControl } from 'react-native-gesture-handler';
import { fetchArtworks } from 'services/artworks/fetchArtworks';
import { useModalStore } from 'store/modal/modalStore';
import ShowMoreButton from 'components/buttons/ShowMoreButton';
import { fetchCuratedArtworks } from 'services/artworks/fetchCuratedArtworks';

export default function ArtworkCategories() {
    const route = useRoute()
    const { title } = route.params as {title: artworkListingType};

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState([]);

    const { updateModal } = useModalStore();

    useEffect(() => {
        handleFetchArtworks()
    }, []);

    const handleFetchArtworks = async () => {
        setIsLoading(true)

        let results

        if(title === "curated"){
            results = await fetchCuratedArtworks();
            if(results.isOk){
                const data = Array.isArray(results.body) ? results.body : [];
                setData(data)
            }else{
                updateModal({message: "Error fetching " + title + " artworks", showModal: true, modalType: 'error'})
            }
        }else{
            results = await fetchArtworks(title);
            if(results.isOk){
                const data = results.body.data
                setData(data)
            }else{
                console.log(results);
                updateModal({message: "Error fetching " + title + " artworks", showModal: true, modalType: 'error'})
            }
        } 

        setIsLoading(false)
    }

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <BackHeaderTitle title={title + ' artworks'} />
            {isLoading ?
                <View style={{paddingTop: 20, paddingHorizontal: 20}}>
                    <MiniArtworkCardLoader />
                </View>
            :
                <ScrollView
                    style={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={false} onRefresh={handleFetchArtworks} />
                    }
                >
                <ArtworksListing data={data} />
                <ShowMoreButton />
                <View style={{height: 300}} />
            </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
    }
})