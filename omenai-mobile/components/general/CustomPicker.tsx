import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import { TouchableOpacity } from 'react-native-gesture-handler'

type CustomPickerProps = {
    name: string,
    isSelected: boolean,
    onPress: (e: string) => void
}

export default function CustomPicker({name, isSelected, onPress}: CustomPickerProps) {
    return (
        <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => onPress(name)}>
            <View style={[styles.outerCircle, isSelected && {borderColor: colors.primary_black}]}>
                {isSelected && <View style={styles.innerCircle} />}
            </View>
            <Text style={[styles.text, isSelected && {color: colors.primary_black}]}>{name}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    outerCircle: {
        height: 17,
        width: 17,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.grey,
        alignItems: 'center',
        justifyContent: 'center'
    },
    innerCircle: {
        height: 7,
        width: 7,
        borderRadius: 20,
        backgroundColor: colors.primary_black
    },
    text: {
        fontSize: 14,
        color: colors.grey
    }
})