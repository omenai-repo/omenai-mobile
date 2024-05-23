import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import sortIcon from '../../assets/icons/sort-icon.png';
import { Feather } from '@expo/vector-icons';
import { filterStore } from 'store/artworks/FilterStore';
import PriceFilter from './PriceFilter';
import YearFilter from './YearFilter';
import MediumFilter from './MediumFilter';
import FilterPill from './FilterPill';
import { artworkStore } from 'store/artworks/ArtworkStore';
import { artworkActionStore } from 'store/artworks/ArtworkActionStore';
import { fetchPaginatedArtworks } from 'services/artworks/fetchPaginatedArtworks';
import RarityFilter from './RarityFilter';

type FilterProps = {
    children?: React.ReactNode
}

type FilterSelectProps = {
    name: string
}

export default function Filter({children}: FilterProps) {
    const [showFilters, setShowFilters] = useState(false);

    const { filterOptions, selectedFilters } = filterStore();
    const { paginationCount, updatePaginationCount } = artworkActionStore();
    const { setArtworks, setIsLoading, setPageCount } = artworkStore();

    const handleSubmitFilter = async () => {
        updatePaginationCount("reset");
        setIsLoading(true);
        const response = await fetchPaginatedArtworks(
            paginationCount,
            filterOptions
        );
        if (response?.isOk) {
            setPageCount(response.count);
            setArtworks(response.data);
        } else {
            
        }
        setIsLoading(false);
    }

    return (
        <View>
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    {!showFilters ? 
                        children
                    :
                    <View style={{width: 130}}>
                        <TouchableOpacity onPress={() => setShowFilters(false)}>
                            <View style={[styles.filterButton, {backgroundColor: colors.black}]}>
                                <Text style={[styles.filterButtonText, {color: colors.white}]}>Filters</Text>
                                <Feather name='x' size={20} color={colors.white} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    }
                </View>
                {!showFilters ?
                    <TouchableOpacity onPress={() => setShowFilters(true)}>
                        <View style={styles.filterButton}>
                            <Text style={styles.filterButtonText}>Filters</Text>
                            <Image source={sortIcon} style={styles.sortIcon} />
                        </View>
                    </TouchableOpacity>
                :
                    <TouchableOpacity onPress={handleSubmitFilter}>
                        <View style={styles.filterButton}>
                            <Text style={styles.filterButtonText}>Apply Filters</Text>
                        </View>
                    </TouchableOpacity>
                }
            </View>
            {selectedFilters.length > 0 &&
                <View style={styles.selectedFilterContainer}>
                    {selectedFilters.map((filter, index) => (
                        <FilterPill filter={filter.name} key={index} />
                    ))}
                </View>
            }
            {showFilters && 
                <View style={styles.FiltersListing}>
                    <PriceFilter />
                    <YearFilter />
                    <MediumFilter />
                    <RarityFilter />
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    leftContainer: {
        flex: 1,
        overflow: 'hidden'
    },
    filterButton: {
        height: 50,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        backgroundColor: '#FAFAFA',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.inputBorder
    },
    filterButtonText: {
        fontSize: 14,
        color: colors.primary_black
    },
    sortIcon: {
        height: 20,
        width: 20
    },
    FiltersListing: {
        gap: 15,
        marginTop: 20
    },
    FilterSelectContainer: {
        height: 55,
        paddingHorizontal: 20,
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        borderRadius: 5,
        flexDirection: 'row'
    },
    selectedFilterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 20,
        flexWrap: 'wrap'
    }
})