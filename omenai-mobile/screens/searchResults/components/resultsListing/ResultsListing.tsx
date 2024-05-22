import { StyleSheet, Text, View, ScrollView} from 'react-native'
import React from 'react'
import ArtworkCard from 'components/artwork/ArtworkCard'

export default function ResultsListing({data}: {data: any[]}) {

    return (
        <ScrollView style={{marginTop: 20}} showsVerticalScrollIndicator={false}>
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
                            showTags={false}
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
                            price={artwork.pricing.price || 0}
                            showPrice={artwork.pricing.shouldShowPrice}
                            showTags={false}
                        />
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    artworksContainer: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 10
    },
    singleColumn: {
        flex: 1,
        gap: 20
    },
})