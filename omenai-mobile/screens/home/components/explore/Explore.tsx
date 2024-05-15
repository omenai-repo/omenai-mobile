import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { colors } from '../../../../config/colors.config'
import { Feather } from '@expo/vector-icons'
import ArtworkCard from 'components/artwork/ArtworkCard'
import { useHomeStore } from 'store/home/homeStore'
import { fetchArtworkImpressions } from '../../../../services/artworks/fetchArtworkImpressions'
import TrendingArtworkCard from 'components/artwork/TrendingArtworkCard'
import TrendingArtworksListing from './TrendingArtworksListing'
import RecentArtworkListing from './RecentArtworkListing'

export default function Explore() {
    const { isLoading, setIsLoading, listingType } = useHomeStore();

    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        handleFetchArtworks()
    }, [listingType]);

    const handleFetchArtworks = async () => {
        setIsLoading(true)
        const results = await fetchArtworkImpressions(listingType);

        let arr = []

        if(results.isOk){
            arr = results.body.data.slice(0, 4)

            var indexToSplit = arr.length / 2;
            var first = arr.slice(0, 2);
            var second = arr.slice(indexToSplit, 4);

            setData([first, second])
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

    return (
        <View>
            {listingType === 'trending' && <TrendingArtworksListing data={data} />}
            {listingType === 'recent' && <RecentArtworkListing data={data} />}
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