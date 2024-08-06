import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import ArtworkCard from 'components/artwork/ArtworkCard';
import { fetchArtworks } from 'services/artworks/fetchArtworks';
import { colors } from 'config/colors.config';
import ArtworkCardLoader from 'components/general/ArtworkCardLoader';
import { Feather } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import ViewAllCategoriesButton from 'components/buttons/ViewAllCategoriesButton';
import EmptyArtworks from 'components/general/EmptyArtworks';

export default function TrendingArtworks({refreshCount, limit} : {refreshCount?: number, limit: number}) {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const [isLoading, setIsLoading] = useState(false)

    const [data, setData] = useState([]);
    const [showMoreButton, setshowMoreButton] = useState(false);

    useEffect(() => {
        handleFetchArtworks()
    }, [refreshCount])

    const handleFetchArtworks = async () => {
        setIsLoading(true)

        const results = await fetchArtworks({listingType: "trending", page: 1});

        if(results.isOk){
            const resData = results.body.data

            setData(resData)
            
            if(resData.length >= 20){
                setData(resData.splice(0,limit))
                setshowMoreButton(true)
            }
        }else{
            console.log(results)
        }

        setIsLoading(false)
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate(screenName.artworkCategories, {title: "trending"})}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20}}>
                    <Text style={{fontSize: 18, fontWeight: 500, flex: 1}}>Trending Artworks</Text>
                    <Feather name='chevron-right' color={colors.grey} size={20} />
                </View>
            </TouchableOpacity>
            {isLoading && <ArtworkCardLoader /> }
            {(!isLoading && data.length > 0) &&
                <FlatList
                    data={data}
                    renderItem={({item, index}: {item: ArtworkFlatlistItem, index: number}) => {
                        if((index + 1) === data.length && showMoreButton){
                            return(
                                <ViewAllCategoriesButton label='View all trending artworks' listingType="trending" />
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
                <EmptyArtworks size={70} writeUp='No trending artworks at the moment' />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40
    }
})