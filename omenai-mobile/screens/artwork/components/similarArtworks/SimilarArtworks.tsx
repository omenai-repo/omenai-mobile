import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import ArtworkCard from 'components/artwork/ArtworkCard'
import { fetchArtworksByCriteria } from 'services/artworks/fetchArtworksByCriteria'

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
                setData(resultsData.splice(0,2))
            }
        }
        setIsLoading(false)
    }

    return (
        <View style={styles.similarContainer}>
            <Text style={styles.similarTitle}>Similar artwork</Text>
            <View style={styles.artworksContainer}>
                {data.map((art: {
                    title: string,
                    artist: string,
                    pricing: {price: number; shouldShowPrice: "Yes" | "No" | string}
                    url: string,
                    medium: string;
                    rarity: string;
                }, index) => (
                    <View style={styles.singleColumn} key={index}>
                        <ArtworkCard
                            title={art.title}
                            artist={art.artist}
                            image={art.url}
                            medium={art.rarity}
                            price={art.pricing.price}
                            showPrice={art.pricing.shouldShowPrice === "Yes" ? true : false}
                            rarity={art.rarity}
                        />
                    </View>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    similarContainer: {
        marginTop: 0
    },
    similarTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: colors.primary_black
    },
    artworksContainer: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 30
    },
    singleColumn: {
        flex: 1,
        gap: 20
    },
})