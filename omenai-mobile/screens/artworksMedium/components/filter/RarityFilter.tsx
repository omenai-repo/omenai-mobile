import { StyleSheet, Text, View } from 'react-native'
import React, {useState} from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors } from 'config/colors.config';
import { Feather } from '@expo/vector-icons';
import FilterOptionBox from './FilterOptionBox';
import { artworksMediumFilterStore } from 'store/artworks/ArtworksMediumFilterStore';

const rarityFilterOptions = [
    { option: "Unique", value: "Unique" },
    { option: "Limited edition", value: "Limited edition" },
    { option: "Open edition", value: "Open edition" },
    { option: "Unknown edition", value: "Unknown edition" },
];

export default function RarityFilter() {
    const [openDropdown, setOpenDropdown] = useState(false);
    const { filterOptions } = artworksMediumFilterStore();

    return (
        <View style={{position: 'relative', zIndex: 7}}>
            <TouchableOpacity onPress={() => setOpenDropdown(!openDropdown)}>
                <View style={styles.FilterSelectContainer}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10}}>
                        <Text style={{color: '#616161', fontSize: 16}}>Filter by rarity</Text>
                        {filterOptions.rarity.length > 0 && (
                            <View style={{paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#f5f5f5', borderRadius: 20}}><Text style={{fontSize: 12, color: colors.primary_black}}>{filterOptions.rarity.length}</Text></View>
                        )}
                    </View>
                    <Feather name='chevron-down' size={20} color={'#616161'} />
                </View>
            </TouchableOpacity>
            {/* Filter options */}
            {openDropdown &&
                <FilterOptionBox
                    filters={rarityFilterOptions}
                    label={"rarity"}
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