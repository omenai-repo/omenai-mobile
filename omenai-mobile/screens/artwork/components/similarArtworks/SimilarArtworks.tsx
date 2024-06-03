import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import ArtworkCard from 'components/artwork/ArtworkCard'
import { fetchArtworksByCriteria } from 'services/artworks/fetchArtworksByCriteria'
import ArtworkCardLoader from 'components/general/ArtworkCardLoader'
import { FlatList } from 'react-native-gesture-handler'

export default function SimilarArtworks({medium}: {medium: string}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        handleFetchArtworksByCiteria()
    }, [])

    const handleFetchArtworksByCiteria = async () => {
        setIsLoading(true)
        const results = await fetchArtworksByCriteria(medium);

        if(results.isOk){
            let resultsData = results.body.data as []
            if(resultsData.length > 0){
                setData(resultsData.splice(0,4))
            }
        }
        setIsLoading(false)
    }

    return (
        <View style={styles.similarContainer}>
            <Text style={styles.similarTitle}>Similar artwork</Text>
            <View style={styles.artworksContainer}>
            {isLoading ? <ArtworkCardLoader /> :
                <FlatList
                    data={data}
                    renderItem={({item}: {item: ArtworkFlatlistItem}) => (
                        <ArtworkCard 
                            title={item.title} 
                            url={item.url}
                            artist={item.artist}
                            showPrice={item.pricing.shouldShowPrice === "Yes"}
                            price={item.pricing.price}
                        />
                    )}
                    keyExtractor={(_, index) => JSON.stringify(index)}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    // style={{marginTop: 20}}
                />
            }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    similarContainer: {
        marginTop: 0,
        marginBottom: 100
    },
    similarTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: colors.primary_black,
        paddingHorizontal: 20
    },
    artworksContainer: {
        marginTop: 10
    },
    singleColumn: {
        flex: 1,
        gap: 20
    },
})