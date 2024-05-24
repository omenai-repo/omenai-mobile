import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ArtworkCard from 'components/artwork/ArtworkCard';

export default function ArtworksListing({data}: {data: any[]}) {
    const [listing, setListing] = useState<any[]>([]);

    useEffect(() => {
        if(data.length > 1){

            var indexToSplit = data.length / 2;
            var first = data.slice(0, indexToSplit);
            var second = data.slice(indexToSplit);

            setListing([first, second])
        }
    }, [])

    return (
        <View style={styles.artworksContainer}>
            <View style={styles.singleColumn}>
                {listing[0]?.map((artwork: any, idx: any) => (
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
                {listing[1]?.map((artwork: any, idx: any) => (
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
        marginTop: 30,
        zIndex: 5
    },
    singleColumn: {
        flex: 1,
        gap: 20
    },
})