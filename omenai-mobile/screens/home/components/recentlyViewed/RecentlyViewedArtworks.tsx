import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchViewHistory } from 'services/artworks/viewHistory/fetchRecentlyViewedArtworks'
import { useAppStore } from 'store/app/appStore'
import ArtworkCard from 'components/artwork/ArtworkCard';
import EmptyArtworks from 'components/general/EmptyArtworks';
import { Feather } from '@expo/vector-icons';
import { colors } from 'config/colors.config';
import ArtworkCardLoader from 'components/general/ArtworkCardLoader';
import ViewHistoryCard from './ViewHistoryCard';

type ViewHistoryItem = {
    art_id: string,
    url: string,
    artist: string,
    artwork: string
}

export default function RecentlyViewedArtworks({refreshCount}: {refreshCount?: number}) {
    const { userSession } = useAppStore();

    const [isLoading, setIsLoading] = useState(false);

    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        async function handleFetchHistory(){
            setIsLoading(true)
            const results = await fetchViewHistory(userSession.id)

            if(results?.isOk){
                const resData = results.data
    
                
                
                if(resData.length >= 20){
                    setData(resData.splice(0,20))
                }else{
                    setData(resData);
                }
            }

            setIsLoading(false)
        };

        handleFetchHistory()
    }, [refreshCount])

    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20}}>
                <Text style={{fontSize: 18, fontWeight: 500, flex: 1}}>Recently viewed artworks</Text>
            </View>
            {isLoading && <ArtworkCardLoader /> }
            {(!isLoading && data.length > 0) &&
                <FlatList
                    data={data}
                    renderItem={({item, index}: {item: ViewHistoryItem, index: number}) => {
                        return(
                            <ViewHistoryCard 
                                art_id={item.art_id}
                                artist={item.artist}
                                artwork={item.artwork}
                                url={item.url}
                                key={index}
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
                <EmptyArtworks size={70} writeUp="You haven't viewed an artwork yet" />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        marginBottom: 40
    }
})