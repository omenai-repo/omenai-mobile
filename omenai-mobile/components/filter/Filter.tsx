import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from 'config/colors.config'
import sortIcon from '../../assets/icons/sort-icon.png';
import { Feather } from '@expo/vector-icons';

type FilterProps = {
    children?: React.ReactNode
}

type FilterSelectProps = {
    name: string
}

export default function Filter({children}: FilterProps) {
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
                    <TouchableOpacity onPress={() => setShowFilters(false)}>
                        <View style={styles.filterButton}>
                            <Text style={styles.filterButtonText}>Apply Filters</Text>
                        </View>
                    </TouchableOpacity>
                }
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
    }
})