import { Image, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native'
import React from 'react'
import { colors } from '../../config/colors.config';
import omenaiSearchIcon from '../../assets/icons/omenai-search-icon.png'
import { useSearchStore } from 'store/search/searchStore';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import { StackNavigationProp } from '@react-navigation/stack';

export default function SearchInput() {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const { searchQuery, setSearchQuery } = useSearchStore();

    const handleSearch = () => {
        console.log(searchQuery)
        navigation.navigate(screenName.searchResults);
    }

    return (
        <View style={styles.container}>
            <Image source={omenaiSearchIcon} />
            <TextInput
                style={styles.input}
                placeholder='Search for anything'
                placeholderTextColor={'#858585'}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
            />
            <TouchableOpacity onPress={handleSearch}>
                <View style={styles.searchButton}>
                    <Text style={{color: colors.white, fontSize: 14}}>Search</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 65,
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: colors.inputBorder,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 40,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 16
    },
    searchButton: {
        height: '100%',
        backgroundColor: colors.primary_black,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20
    }
})