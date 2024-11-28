import { Image, StyleSheet, TouchableOpacity, View, TextInput, Text } from 'react-native'
import React from 'react'
import { colors } from '../../config/colors.config';
import omenaiSearchIcon from '../../assets/icons/omenai-search-icon.png'
import { useSearchStore } from 'store/search/searchStore';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';

export default function SearchInput() {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const { searchQuery, setSearchQuery } = useSearchStore();

    const handleSearch = () => {
        if(searchQuery.length > 0){
            navigation.navigate(screenName.searchResults);
        }
    }

    const handleClearSearchQuery = () => {
        setSearchQuery('')
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder='Ask Omenai'
                placeholderTextColor={'#858585'}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
            />
            <TouchableOpacity style={styles.searchButton} activeOpacity={0.5} onPress={handleSearch}>
                <Text style={{fontSize: 14, color: colors.white}}>Search</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 55,
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: colors.inputBorder,
        paddingHorizontal: 10,
        paddingVertical: 7,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        borderRadius: 30
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 16,
        paddingLeft: 15
    },
    searchButton: {
        height: '100%',
        backgroundColor: colors.primary_black,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20
    }
})