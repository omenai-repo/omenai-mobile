import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useHomeStore } from 'store/home/homeStore'
import { fetchArtworks } from '../../../../services/artworks/fetchArtworks'
import TrendingArtworksListing from './TrendingArtworksListing'
import RecentArtworkListing from './RecentArtworkListing'
import { fetchCuratedArtworks } from 'services/artworks/fetchCuratedArtworks'

export default function Explore() {
    const { isLoading, setIsLoading, listingType } = useHomeStore();

    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        handleFetchArtworks()
    }, [listingType]);

    const handleFetchArtworks = async () => {
        setIsLoading(true)
        setData([])
        let results
        if(listingType === 'curated'){
            results = await fetchCuratedArtworks();
        }else{
            results = await fetchArtworks(listingType);
        }
        

        let arr = []

        if(results.isOk){
            if(results.body.data?.length > 0){
                arr = results.body.data.slice(0, 4)

                var indexToSplit = arr.length / 2;
                var first = arr.slice(0, 2);
                var second = arr.slice(indexToSplit, 4);

                setData([first, second])
            }
        }else{
            Alert.alert(results.body)
        }

        setIsLoading(false)
    }

    if(isLoading)
    return(
        <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
        </View>
    )

    if(!isLoading && data.length === 0)
    return(
        <View style={styles.loadingContainer}>
            <Text style={{textAlign: 'center'}}>No artworks match your profile, try updating your preferences</Text>
        </View>
    )

    return (
        <View>
            {listingType === 'trending' && <TrendingArtworksListing data={data} />}
            {(listingType === 'recent' || listingType === 'curated') && <RecentArtworkListing data={data} />}
        </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'center'
    }
})