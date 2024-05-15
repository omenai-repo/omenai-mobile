import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ArtworkCard from 'components/artwork/ArtworkCard'

export default function RecentArtworkListing({data}: {data: any[]}) {
    return (
        <View style={styles.artworksContainer}>
            <View style={styles.singleColumn}>
                {data[0]?.map((i: any, idx: any) => (
                    <ArtworkCard
                        key={idx}
                        title={i.title}
                        artist={i.artist}
                        image={i.url}
                        medium={i.medium}
                        price={i.pricing.price || 0}
                        showPrice={i.pricing.shouldShowPrice}
                        rarity={i.rarity}
                    />
                ))}
            </View>
            <View style={styles.singleColumn}>
                {data[1]?.map((i: any, idx: any) => (
                    <ArtworkCard
                        key={idx}
                        title={i.title}
                        artist={i.artist}
                        image={i.url}
                        medium={i.medium}
                        price={i.pricing.price || 0}
                        showPrice={i.pricing.shouldShowPrice}
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