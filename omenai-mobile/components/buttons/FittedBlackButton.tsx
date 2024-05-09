import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '@/config/colors.config'

type FittedBlackButtonProps = {
    value: string,
    isDisabled: boolean,
    onClick: () => void,
    isLoading?: boolean
}

export default function FittedBlackButton({value, isDisabled, onClick, isLoading}: FittedBlackButtonProps) {
    if (isDisabled)
    return(
        <View style={[styles.container, {backgroundColor: '#E0E0E0'}]}>
            <Text style={[styles.text, {color: '#A1A1A1'}]}>{value}</Text>
        </View>
    )

    if (isLoading)
    return(
        <View style={[styles.container, {backgroundColor: '#E0E0E0'}]}>
            <Text style={[styles.text, {color: '#A1A1A1'}]}>Loading...</Text>
        </View>
    )

    return (
        <TouchableOpacity style={styles.container} onPress={onClick}>
            <Text style={styles.text}>{value}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 55,
        paddingHorizontal: 30,
        backgroundColor: colors.primary_black,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: colors.white,
        fontSize: 16
    }
})