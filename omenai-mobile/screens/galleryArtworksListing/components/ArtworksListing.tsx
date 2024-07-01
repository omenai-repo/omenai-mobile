import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ArtworkCard from 'components/artwork/ArtworkCard';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import MiniArtworkCard from 'components/artwork/MiniArtworkCard';
import GalleryMiniArtworkCard from 'components/artwork/GalleryMiniArtworkCard';
import EmptyArtworks from 'components/general/EmptyArtworks';

export default function ArtworksListing({data}: {data: any[]}) {
    const [listing, setListing] = useState<any[]>([]);

    useEffect(() => {
        if(data.length > 1){

            var indexToSplit = data.length / 2;
            var first = data.slice(0, indexToSplit);
            var second = data.slice(indexToSplit);

            setListing([first, second])
        }else if(data.length > 0){
            setListing([data, []])
        }
    }, [])

    if(data.length === 0)
    return(
        <EmptyArtworks size={100} />
    )

    return (
        <View style={styles.artworksContainer}>
            <View style={{flex: 1}}>
            <FlatList
                data={listing[0]?.toReversed()}
                renderItem={({item}: {item: ArtworkFlatlistItem}) => (
                    <GalleryMiniArtworkCard 
                        title={item.title} 
                        url={item.url}
                        art_id={item.art_id}
                        artist={item.artist}
                    />
                )}
                keyExtractor={(_, index) => JSON.stringify(index)}
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                // style={{gap: 200}}
                contentContainerStyle={{ gap: 30}}
            />
            </View>
            <View style={{flex: 1}}>
                <FlatList
                    data={listing[1]?.toReversed()}
                    renderItem={({item}: {item: ArtworkFlatlistItem}) => (
                        <GalleryMiniArtworkCard 
                            title={item.title} 
                            url={item.url}
                            art_id={item.art_id}
                            artist={item.artist}
                        />
                    )}
                    keyExtractor={(_, index) => JSON.stringify(index)}
                    horizontal={false}
                    showsHorizontalScrollIndicator={false}
                    // style={{gap: 200}}
                    contentContainerStyle={{ gap: 30 }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    artworksContainer: {
        flexDirection: 'row',
        gap: 20,
        zIndex: 5
    },
    singleColumn: {
        flex: 1,
        gap: 20
    },
})