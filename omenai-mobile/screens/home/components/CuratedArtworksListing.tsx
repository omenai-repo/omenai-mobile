import { StyleSheet, Text, View, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import ArtworkCard from 'components/artwork/ArtworkCard';
import { fetchArtworks } from 'services/artworks/fetchArtworks';
import { colors } from 'config/colors.config';
import ArtworkCardLoader from 'components/general/ArtworkCardLoader';
import curatedBg from 'assets/images/curated_bg.png';
import { fetchCuratedArtworks } from 'services/artworks/fetchCuratedArtworks';
import ViewAllCategoriesButton from 'components/buttons/ViewAllCategoriesButton';
import { screenName } from 'constants/screenNames.constants';
import EmptyArtworks from 'components/general/EmptyArtworks';

export default function CuratedArtworksListing({refreshCount, limit} : {refreshCount?: number, limit: number}) {
    const [isLoading, setIsLoading] = useState(false)

    const [data, setData] = useState<any[]>([]);
    const [showMoreButton, setshowMoreButton] = useState(false);

    useEffect(() => {
        handleFetchArtworks()
    }, [refreshCount])

    const handleFetchArtworks = async () => {
        setIsLoading(true)

        const results = await fetchCuratedArtworks();

        if(results.isOk){
            const data = Array.isArray(results.body) ? results.body : [];
            if(data.length <= 20){
                setData(data)
                setshowMoreButton(false)
            }else{
                setData(data.splice(0,limit))
                setshowMoreButton(true)
            }
        }else{
            console.log(results)
        }

        setIsLoading(false)
    }

    return (
        <ImageBackground source={curatedBg} resizeMode="cover" style={styles.container}>
            <View style={styles.mainContainer}>
                <View style={{paddingHorizontal: 20}}>
                    <Text style={{fontSize: 18, fontWeight: 500, flex: 1, color: colors.white}}>Artworks based on your interests</Text>
                    <Text style={{fontSize: 14, color: colors.white, marginTop: 10, opacity: 0.9}}>Explore artworks based off your interests and interactions within the past days</Text>
                </View>
                <View style={{marginTop: 10}}>
                {isLoading && <ArtworkCardLoader /> }
                {(!isLoading && data.length > 0) &&
                    <FlatList
                        data={data}
                        renderItem={({item, index}: {item: ArtworkFlatlistItem, index: number}) => {
                            if((index + 1) === limit && showMoreButton){
                                return(
                                    <ViewAllCategoriesButton label='View all curated artworks'  listingType="recent" darkMode />
                                )
                            }
                            return(
                                <ArtworkCard 
                                    title={item.title} 
                                    url={item.url}
                                    artist={item.artist}
                                    showPrice={item.pricing.shouldShowPrice === "Yes"}
                                    price={item.pricing.usd_price}
                                    availiablity={item.availability}
                                    lightText={true}
                                    width={310}
                                    impressions={item.impressions}
                                    like_IDs={item.like_IDs}
                                    art_id={item.art_id}
                                />
                            )
                        }}
                        keyExtractor={(_, index) => JSON.stringify(index)}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={{marginTop: 20}}
                    />
                }
                {(!isLoading && data.length < 1) && (
                    <EmptyArtworks size={70} writeUp='No artworks to match your interests' darkTheme />
                )}
                </View>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        backgroundColor: colors.primary_black,
    },
    mainContainer: {
        paddingBottom: 50,
        backgroundColor: colors.black,
        marginTop: 80,
        paddingTop: 20
    }
})