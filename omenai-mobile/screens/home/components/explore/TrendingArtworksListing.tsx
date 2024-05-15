import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TrendingArtworkCard from 'components/artwork/TrendingArtworkCard'

export default function TrendingArtworksListing({data}: {data: any[]}) {
    return (
        <View style={styles.artworksContainer}>
            <View style={styles.singleColumn}>
                {data[0]?.map((i: any, idx: any) => (
                    <TrendingArtworkCard
                        key={idx}
                        title={i.title}
                        artist={i.artist}
                        image={i.url}
                        medium={i.medium}
                        likes={i.impressions}
                        rarity={i.rarity}
                    />
                ))}
            </View>
            <View style={styles.singleColumn}>
                {data[1]?.map((i: any, idx: any) => (
                    <TrendingArtworkCard
                        key={idx}
                        title={i.title}
                        artist={i.artist}
                        image={i.url}
                        medium={i.medium}
                        likes={i.impressions}
                        rarity={i.rarity}
                    />
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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