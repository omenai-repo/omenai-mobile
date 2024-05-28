import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
            <HeaderWithTitle pageTitle='Catalog' />
            <ScrollView>
                <View style={styles.topContainer}>
                    <Text style={styles.introText}>Shop your favorite artworks and collections</Text>
                    <SearchInput />
                </View>
                <View style={styles.mainContainer}>
                    {/* <Text style={{fontSize: 20, fontWeight: '500', color: colors.primary_black}}>Browse by collection</Text> */}
                    <View style={{zIndex: 100}}>
                        <Filter>
                            {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {tags.map((i, idx) => (
                                    <TagItem
                                        name={i}
                                        isSelected={i === selectedTag}
                                        key={idx}
                                    />
                                ))}
                            </ScrollView> */}
                        </Filter>
                    </View>
                    <View style={{zIndex: 5}}>
                        {isLoading ? <View style={{height: 200, alignItems: 'center', justifyContent: 'center'}}><Text>Loading ...</Text></View>:
                        <ArtworksListing data={artworks} />}
                    </View>
                </View>
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
    },
    introText: {
        fontSize: 28,
        fontWeight: '500',
        color: colors.primary_black,
        maxWidth: 290,
        paddingVertical: 40
    },
    mainContainer: {
        marginTop: 40,
        borderTopWidth: 1,
        borderTopColor: colors.inputBorder,
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
    }
})