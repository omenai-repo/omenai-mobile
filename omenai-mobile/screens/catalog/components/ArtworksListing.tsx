import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ArtworkCard from 'components/artwork/ArtworkCard';
import { FlatList } from 'react-native-gesture-handler';
import MiniArtworkCard from 'components/artwork/MiniArtworkCard';

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
            <FlatList
                data={listing[0]}
                renderItem={({item}: {item: ArtworkFlatlistItem}) => (
                    <MiniArtworkCard 
                        title={item.title} 
                        url={item.url}
                        artist={item.artist}
                        showPrice={item.pricing.shouldShowPrice === "Yes"}
                        price={item.pricing.price}
                    />
                )}
                keyExtractor={(_, index) => JSON.stringify(index)}
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                style={{gap: 200}}
                contentContainerStyle={{ gap: 30 }}
            />
            <FlatList
                data={listing[1]}
                renderItem={({item}: {item: ArtworkFlatlistItem}) => (
                    <MiniArtworkCard 
                        title={item.title} 
                        url={item.url}
                        artist={item.artist}
                        showPrice={item.pricing.shouldShowPrice === "Yes"}
                        price={item.pricing.price}
                    />
                )}
                keyExtractor={(_, index) => JSON.stringify(index)}
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                style={{gap: 200}}
                contentContainerStyle={{ gap: 30 }}
            />
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