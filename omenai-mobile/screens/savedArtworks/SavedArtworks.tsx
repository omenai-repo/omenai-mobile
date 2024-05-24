import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import BackScreenButton from 'components/buttons/BackScreenButton'
import { fetchUserSavedArtworks } from 'services/artworks/fetchUserSavedArtwork';
import { Feather } from '@expo/vector-icons';
import { UseSavedArtworksStore } from 'store/artworks/SavedArtworksStore';
import { getImageFileView } from 'lib/storage/getImageFileView';
import Divider from 'components/general/Divider';
import Loader from 'components/general/Loader';

type SavedArtworkItemProps = {
    name: string,
    artistName: string,
    url: string
}

export default function SavedArtworks() {
    const { isLoading, setIsLoading, data, setData } = UseSavedArtworksStore();
    const [refreshing, setRefreshing] = useState(false);

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

    const SavedArtworkItem = ({name, artistName, url}: SavedArtworkItemProps) => {
        let image_href = getImageFileView(url, 80);

        return(
            <TouchableOpacity>
                <View style={styles.savedArtworkItem}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10}}>
                        <Image source={{uri: image_href}} style={styles.image} />
                        <View>
                            <Text style={{fontSize: 16, color: colors.primary_black}}>{name}</Text>
                            <Text style={{fontSize: 14, color: '#858585', marginTop: 2}}>{artistName}</Text>
                        </View>
                    </View>
                    <Feather name='trash-2' color={'#ff0000'} size={15} />
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View style={styles.topContainer}>
                    <BackScreenButton handleClick={() => console.log('back')} />
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
                                />
                                {(index + 1) !== data.length && <Divider />}
                            </View>
                        ))}
                    </View>
                }
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
        marginTop: 50,
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