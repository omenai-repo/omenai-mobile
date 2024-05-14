import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../../../../config/colors.config';

import sortIcon from '../../../../assets/icons/sort-icon.png';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

type FilterSelectProps = {
    name: string
}

export default function Filters() {
    const [showFilters, setShowFilters] = useState(false);

    const FilterSelect = ({name} : FilterSelectProps) => {
        return(
            <TouchableOpacity>
                <View style={styles.FilterSelectContainer}>
                    <Text style={{color: '#616161', fontSize: 16, flex: 1}}>{name}</Text>
                    <Feather name='chevron-down' size={20} color={'#616161'} />
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View>
            <View style={styles.container}>
                <Text style={styles.resultsText}>107 results found</Text>
                <TouchableOpacity onPress={() => setShowFilters(prev => !prev)}>
                    {showFilters ?
                        <View style={[styles.filterButton, {backgroundColor: colors.black}]}>
                            <Text style={[styles.filterButtonText, {color: colors.white}]}>Filters</Text>
                            <Feather name='x' size={20} color={colors.white} />
                        </View>
                    :
                        <View style={styles.filterButton}>
                            <Text style={styles.filterButtonText}>Filters</Text>
                            <Image source={sortIcon} style={styles.sortIcon} />
                        </View>
                    }
                </TouchableOpacity>
            </View>
            {showFilters && 
                <View style={styles.FiltersListing}>
                    <FilterSelect name='Price range' />
                    <FilterSelect name='Orientation' />
                    <FilterSelect name='Year' />
                    <FilterSelect name='Rarity' />
                </View>
            }
        </View>
    ) 
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    resultsText: {
        fontSize: 16,
        color: '#858585',
        fontWeight: '500',
        flex: 1
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
    }
})