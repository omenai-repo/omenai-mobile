import { StyleSheet, Text, View, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import ArtworkCard from 'components/artwork/ArtworkCard';
import { fetchArtworks } from 'services/artworks/fetchArtworks';
import { colors } from 'config/colors.config';
import ArtworkCardLoader from 'components/general/ArtworkCardLoader';
import curatedBg from 'assets/images/curated_bg.png';

export default function CuratedArtworksListing() {
    const [isLoading, setIsLoading] = useState(false)

    const [data, setData] = useState([]);

    useEffect(() => {
        handleFetchArtworks()
    }, [])

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
        <ImageBackground source={curatedBg} resizeMode="cover" style={styles.container}>
            <View style={{paddingHorizontal: 20}}>
                <Text style={{fontSize: 18, fontWeight: 500, flex: 1, color: colors.white}}>Artworks based on your interests</Text>
                <Text style={{fontSize: 14, color: colors.white, marginTop: 10, opacity: 0.9}}>Explore artworks based off your interests and interactions within the past days</Text>
            </View>
            <View style={{marginTop: 10}}>
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
                                lightText={true}
                            />
                        )}
                        keyExtractor={(_, index) => JSON.stringify(index)}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={{marginTop: 20}}
                    />
                }
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        backgroundColor: colors.primary_black,
        paddingVertical: 40
    }
})