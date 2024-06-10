import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import BackScreenButton from 'components/buttons/BackScreenButton'
import { fetchUserSavedArtworks } from 'services/artworks/fetchUserSavedArtwork';
import { UseSavedArtworksStore } from 'store/artworks/SavedArtworksStore';
import { getImageFileView } from 'lib/storage/getImageFileView';
import Divider from 'components/general/Divider';
import Loader from 'components/general/Loader';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons'
import { screenName } from 'constants/screenNames.constants';
import { handleFetchUserID } from 'utils/asyncStorage.utils';
import useLikedState from 'custom/hooks/useLikedState';

type SavedArtworkItemProps = {
    name: string,
    artistName: string,
    url: string,
    index: number,
    art_id: string,
    likeIds: string[],
    impressions: number
}

export default function SavedArtworks() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const { isLoading, setIsLoading, data, setData } = UseSavedArtworksStore();
    const [refreshing, setRefreshing] = useState(false);

    const [sessionId, setSessionId] = useState('');

    useEffect(() => {
        handleFetchUserSessionData()
    }, [])


    const handleFetchUserSessionData = async () => {
        const userId = await handleFetchUserID();
        setSessionId(userId)
    }

    const onRefresh = React.useCallback(() => {
        // setRefreshing(true);
        handleFetchUserSavedArtorks()
    }, []);

    useEffect(() => {
        handleFetchUserSavedArtorks()
    }, [])

    const handleFetchUserSavedArtorks = async () => {
        setIsLoading(true);
        const results = await fetchUserSavedArtworks();

        if(results?.isOk){
            setData(results.data)
        }

        setIsLoading(false)
    };

    const SavedArtworkItem = ({name, artistName, url, index, art_id, likeIds, impressions}: SavedArtworkItemProps) => {
        let image_href = getImageFileView(url, 80);


        const { handleLike } = useLikedState(
            impressions,
            likeIds,
            sessionId,
            art_id
        ); 

        const handleRemove = () => {
            handleLike(false)
            
            //remove artwork from state
            let prevData = data
            prevData.splice(index, 1)
            setData(prevData)
        }


        return(
            <TouchableOpacity onPress={() => navigation.navigate(screenName.artwork, {title: name})} activeOpacity={1}>
                <View style={styles.savedArtworkItem}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10}}>
                        <Image source={{uri: image_href}} style={styles.image} />
                        <View>
                            <Text style={{fontSize: 16, color: colors.primary_black}}>{name}</Text>
                            <Text style={{fontSize: 14, color: '#858585', marginTop: 2}}>{artistName}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handleRemove}>
                        <AntDesign name='heart' color={'#ff0000'} size={20} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View style={styles.topContainer}>
                    <BackScreenButton handleClick={() => navigation.goBack()} />
                    <Text style={styles.topTitle}>Saved artworks</Text>
                    <View style={{width: 50}} />
                </View>
            </SafeAreaView>
            <ScrollView style={styles.mainContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {isLoading && <Loader />}
                {(data.length > 0 && !isLoading) &&
                    <View style={styles.sectionContainer}>
                        {data.map((artwork, index) => (
                            <View style={{gap: 20}} key={index}>
                                <SavedArtworkItem
                                    name={artwork.title}
                                    artistName={artwork.artist}
                                    url={artwork.url}
                                    art_id={artwork.art_id}
                                    likeIds={artwork.like_ids}
                                    impressions={artwork.impressions}
                                    index={index}
                                />
                                {(index + 1) !== data.length && <Divider />}
                            </View>
                        ))}
                    </View>
                }
                {(data.length === 0 && !isLoading) && (
                    <View style={{height: 400, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 20}}>No Saved Artworks</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    topContainer: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    topTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
        color: colors.primary_black
    },
    mainContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
        flex: 1
    },
    sectionContainer: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: colors.grey50,
        padding: 15,
        gap: 20,
        backgroundColor: '#FAFAFA'
    },
    savedArtworkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    image: {
        width: 80,
        height: 65,
        // objectFit: 'contain',
        backgroundColor: colors.inputBorder
    }
})