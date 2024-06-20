import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, RefreshControl} from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import { ScrollView } from 'react-native-gesture-handler'
import SearchInput from 'components/inputs/SearchInput'
import Filter from 'components/filter/Filter'
import HeaderWithTitle from 'components/header/HeaderWithTitle'
import ArtworksListing from './components/ArtworksListing'
import { artworkActionStore } from 'store/artworks/ArtworkActionStore'
import { artworkStore } from 'store/artworks/ArtworkStore'
import { filterStore } from 'store/artworks/FilterStore'
import { fetchPaginatedArtworks } from 'services/artworks/fetchPaginatedArtworks'
import { useNavigation } from '@react-navigation/native'
import { screenName } from 'constants/screenNames.constants'
import FilterButton from 'components/filter/FilterButton'
import Loader from 'components/general/Loader'

type TagItemProps = {
    name: string,
    isSelected: boolean,
}

const tags = [
    'All collections',
    'Live arts',
    'Sculptures'
]

export default function Catalog() {
    const [selectedTag, setSelectedTag] = useState(tags[0]);
    const { paginationCount } = artworkActionStore();
    const { setArtworks, artworks, isLoading, setPageCount, setIsLoading } = artworkStore();
    const { filterOptions } = filterStore();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        // setRefreshing(true);
        handleFecthArtworks()
    }, []);

    useEffect(() => {
        handleFecthArtworks()
    }, [])

    const handleFecthArtworks = async () => {
        setIsLoading(true)
        const response = await fetchPaginatedArtworks(
            paginationCount,
            filterOptions
        );
        if (response?.isOk) {
            setArtworks(response.data);
            setPageCount(response.count);
        }
        setIsLoading(false)
    }

    const handleTagSelect = (e: string) => {
        setSelectedTag(e)
    }
    
    const TagItem = ({name, isSelected}: TagItemProps) => {
        return(
            <TouchableOpacity onPress={() => handleTagSelect(name)}>
                <View style={[styles.tagItem, isSelected && {backgroundColor: colors.primary_black}]}>
                    <Text style={[styles.tagText, isSelected && {color: colors.white}]}>{name}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <SafeAreaView>
                    <View style={styles.mainContainer}>
                        <View style={{zIndex: 100}}>
                            <FilterButton>
                                <Text style={styles.headerText}>Catalog</Text>
                            </FilterButton>
                        </View>
                        <View style={{zIndex: 5}}>
                            {isLoading ?
                                <Loader />
                            :
                                <ScrollView
                                    style={{height: '100%'}}
                                    showsVerticalScrollIndicator={false}
                                    refreshControl={
                                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                    }
                                >
                                    <ArtworksListing data={artworks} />
                                    <View style={{height: 300}} />
                                </ScrollView>
                            }
                        </View>
                    </View>
            </SafeAreaView>
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
    },
    introText: {
        fontSize: 28,
        fontWeight: '500',
        color: colors.primary_black,
        maxWidth: 290,
        paddingVertical: 40
    },
    mainContainer: {
        marginTop: 10,
        paddingHorizontal: 20,
        paddingTop: 10
    },
    tagItem: {
        backgroundColor: '#FAFAFA',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginRight: 10
    },
    tagText: {
        fontSize: 12,
        color: colors.primary_black
    },
    headerText: {
        fontSize: 18,
        fontWeight: '500',
        color: colors.primary_black, 
        paddingVertical: 20
    },
})