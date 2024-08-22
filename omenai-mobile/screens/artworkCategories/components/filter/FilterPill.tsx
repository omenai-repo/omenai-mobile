import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'
import { colors } from 'config/colors.config'
import { fetchPaginatedArtworks } from 'services/artworks/fetchPaginatedArtworks';
import { artworkCategoriesStore } from 'store/artworks/ArtworkCategoriesStore';

export default function FilterPill({ filter }: { filter: string }) {
    const { setArtworks, setIsLoading, setPageCount, pageCount, selectedFilters, removeSingleFilterSelection } = artworkCategoriesStore();

    const handleRemoveSingleFilter = async () => {
        setIsLoading(true)
        if (selectedFilters.length === 1) {
            removeSingleFilterSelection(filter);
            const response = await fetchPaginatedArtworks(pageCount, {
                price: [],
                year: [],
                medium: [],
                rarity: [],
            });
            if (response?.isOk) {
                setArtworks(response.data);
                setPageCount(response.count);
            }
          } else {
            removeSingleFilterSelection(filter);
          }

          setIsLoading(false)
    }

    return (
        <TouchableOpacity onPress={handleRemoveSingleFilter}>
            <View style={styles.container}>
                <Text style={{fontSize: 14, color: colors.white}}>{filter}</Text>
                <Feather name='x' size={20} color={colors.white}/>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary_black,
        borderRadius: 20,
        gap: 10,
        paddingHorizontal: 15,
        paddingVertical: 10
    }
})