import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
import BackScreenButton from 'components/buttons/BackScreenButton';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { ScrollView } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type FilterProps = {
    children?: React.ReactNode
}

type FilterSelectProps = {
    name: string
}

export default function Filter({children}: FilterProps) {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const { filterOptions, selectedFilters, clearAllFilters } = filterStore();
    const { paginationCount, updatePaginationCount } = artworkActionStore();
    const { setArtworks, setIsLoading, setPageCount, isLoading } = artworkStore();

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
        navigation.goBack()
    }

    return (
        <View style={{backgroundColor: colors.white, flex: 1}}>
            <SafeAreaView>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, backgroundColor: colors.white, paddingBottom: 10, paddingTop: 20}}>
                    <View style={{flex: 1}}>
                        <BackScreenButton cancle handleClick={() => navigation.goBack()} />
                    </View>
                    
                    {selectedFilters.length > 0 &&
                        <TouchableOpacity onPress={clearAllFilters}>
                            <View style={styles.clearButton}>
                                <Text style={styles.filterButtonText}>Clear filters</Text>
                                <Feather name='trash' size={18} color={colors.primary_black} />
                            </View>
                        </TouchableOpacity>
                    }
                </View>
            </SafeAreaView>
            <ScrollView style={{flex: 1}}>
                {selectedFilters.length > 0 &&
                    <View style={styles.selectedFilterContainer}>
                        {selectedFilters.map((filter, index) => (
                            <FilterPill filter={filter.name} key={index} />
                        ))}
                    </View>
                }
                <View style={styles.FiltersListing}>
                    <PriceFilter />
                    <YearFilter />
                    <MediumFilter />
                    <RarityFilter />
                </View>
                <View style={{height: 200}} />
            </ScrollView>
                <View style={{position: 'absolute', bottom: 0, paddingHorizontal: 20, paddingVertical: 20, width: '100%'}}>
                    <SafeAreaView>
                    <LongBlackButton value={'Apply filters'} onClick={handleSubmitFilter} isLoading={isLoading} radius={10} />
                    </SafeAreaView>
                </View>
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
    clearButton: {
        height: 40,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#FAFAFA',
        borderRadius: 30,
        // borderWidth: 1,
        // borderColor: colors.inputBorder,
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
        marginTop: 30,
        paddingHorizontal: 20
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
        flexWrap: 'wrap',
        paddingHorizontal: 20
    }
})