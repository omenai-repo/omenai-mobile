import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ArtworkCard from 'components/artwork/ArtworkCard'

export default function RecentArtworkListing({data}: {data: any[]}) {
    return (
        <View style={styles.artworksContainer}>
            <View style={styles.singleColumn}>
                {data[0]?.map((artwork: any, idx: any) => (
                    <ArtworkCard
                        key={idx}
                        title={artwork.title}
                        artist={artwork.artist}
                        image={artwork.url}
                        medium={artwork.medium}
                        price={artwork.pricing.price || 0}
                        showPrice={artwork.pricing.shouldShowPrice}
                        rarity={artwork.rarity}
                    />
                ))}
            </View>
            <View style={styles.singleColumn}>
                {data[1]?.map((artwork: any, idx: any) => (
                    <ArtworkCard
                        key={idx}
                        title={artwork.title}
                        artist={artwork.artist}
                        image={artwork.url}
                        medium={artwork.medium}
                        price={artwork.pricing.price || 0}
                        showPrice={artwork.pricing.shouldShowPrice}
                        rarity={artwork.rarity}
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