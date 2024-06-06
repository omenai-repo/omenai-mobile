import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import ArtworkCard from 'components/artwork/ArtworkCard';
import { fetchArtworks } from 'services/artworks/fetchArtworks';
import { colors } from 'config/colors.config';
import ArtworkCardLoader from 'components/general/ArtworkCardLoader';

export default function NewArtworksListing({refreshCount} : {refreshCount?: number}) {
    const [isLoading, setIsLoading] = useState(false)

    const [data, setData] = useState([]);

    useEffect(() => {
        handleFetchArtworks()
    }, [refreshCount])

    const handleFetchArtworks = async () => {
        setIsLoading(true)

        const results = await fetchArtworks("recent");

        if(results.isOk){
            setData(results.body.data)
        }else{
            console.log(results)
        }

        setIsLoading(false)
    }

    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20}}>
                <Text style={{fontSize: 18, fontWeight: 500, flex: 1}}>New artworks for you</Text>
                <Text>View more</Text>
            </View>
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
                    style={{marginTop: 20}}
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40
    }
})