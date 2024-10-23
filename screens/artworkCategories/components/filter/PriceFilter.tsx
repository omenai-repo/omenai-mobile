import { StyleSheet, Text, View } from 'react-native'
import React, {useState} from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors } from 'config/colors.config';
import { Feather } from '@expo/vector-icons';
import FilterOptionBox from './FilterOptionBox';
import { artworkCategoriesStore } from 'store/artworks/ArtworkCategoriesStore';

const priceFilterOptions = [
    { option: "$0 to $1000", value: { min: 0, max: 1000 } },
    { option: "$1001 to $10000", value: { min: 1001, max: 10000 } },
    { option: "$10001 to $50000", value: { min: 10001, max: 50000 } },
    { option: "$50001 to $100000", value: { min: 50001, max: 100000 } },
    { option: "$100001 to $500000", value: { min: 100001, max: 500000 } },
    { option: "$500000+", value: { min: 500001, max: 10000000000 } },
  ];

export default function PriceFilter() {
    const [openDropdown, setOpenDropdown] = useState(false);
    const { filterOptions } = artworkCategoriesStore();

    return (
        <View style={{position: 'relative', zIndex: 10}}>
            <TouchableOpacity onPress={() => setOpenDropdown(!openDropdown)}>
                <View style={styles.FilterSelectContainer}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10}}>
                        <Text style={{color: '#616161', fontSize: 16}}>Filter by price</Text>
                        {filterOptions.price.length > 0 && (
                            <View style={{paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#f5f5f5', borderRadius: 20}}><Text style={{fontSize: 12, color: colors.primary_black}}>{filterOptions.price.length}</Text></View>
                        )}
                    </View>
                    <Feather name='chevron-down' size={20} color={'#616161'} />
                </View>
            </TouchableOpacity>
            {/* Filter options */}
            {openDropdown &&
                <FilterOptionBox
                    filters={priceFilterOptions}
                    label={"price"}
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    FilterSelectContainer: {
        height: 55,
        paddingHorizontal: 20,
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        borderRadius: 5,
        flexDirection: 'row',
    }
})