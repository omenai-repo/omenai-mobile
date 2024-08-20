import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchViewHistory } from 'services/artworks/viewHistory/fetchRecentlyViewedArtworks'
import { useAppStore } from 'store/app/appStore'
import ArtworkCard from 'components/artwork/ArtworkCard';
import EmptyArtworks from 'components/general/EmptyArtworks';
import { Feather } from '@expo/vector-icons';
import { colors } from 'config/colors.config';
import ArtworkCardLoader from 'components/general/ArtworkCardLoader';

export default function RecentlyViewedArtworks() {
    const { userSession } = useAppStore();

    const [isLoading, setIsLoading] = useState(false);

    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        async function handleFetchHistory(){
            setIsLoading(true)
            const results = await fetchViewHistory(userSession.id)

            return

            if(results?.isOk){
                const resData = results.data

    
                setData(resData)
                
                if(resData.length >= 20){
                    setData(resData.splice(0,20))
                }
            }

            setIsLoading(false)
        };

        handleFetchHistory()
    }, [])

    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20}}>
                <Text style={{fontSize: 18, fontWeight: 500, flex: 1}}>Recently viewed artworks</Text>
            </View>
            {isLoading && <ArtworkCardLoader /> }
            {(!isLoading && data.length > 0) &&
                <FlatList
                    data={data}
                    renderItem={({item, index}: {item: ArtworkFlatlistItem, index: number}) => {
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