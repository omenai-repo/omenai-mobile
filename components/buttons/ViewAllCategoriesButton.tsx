import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { colors } from 'config/colors.config';
import { Feather } from '@expo/vector-icons';
import { screenName } from 'constants/screenNames.constants';

type ViewAllCategoriesButtonProps = {
    label: string,
    darkMode?: boolean,
    listingType: artworkListingType
}

export default function ViewAllCategoriesButton({label, darkMode, listingType}: ViewAllCategoriesButtonProps) {
    const navigation = useNavigation<StackNavigationProp<any>>();

    return (
        <TouchableOpacity onPress={() => navigation.navigate(screenName.artworkCategories, {title: listingType})}>
            <View style={[styles.container, darkMode && {borderColor: colors.white}]}>
                <Text style={[{fontSize: 14}, darkMode && {color: colors.white}]}>{label}</Text>
                <Feather name='arrow-right' size={18} style={[darkMode && {color: colors.white}]} />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.black,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 120,
        marginHorizontal: 30,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    }
})