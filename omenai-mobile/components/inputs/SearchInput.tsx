import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '../../config/colors.config';
import omenaiSearchIcon from '../../assets/icons/omenai-search-icon.png'
import { TextInput } from 'react-native-gesture-handler';

export default function SearchInput() {
    return (
        <View style={styles.container}>
            <Image source={omenaiSearchIcon} />
            <TextInput
                style={styles.input}
                placeholder='Search for anything'
                placeholderTextColor={'#858585'}
            />
            <TouchableOpacity>
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