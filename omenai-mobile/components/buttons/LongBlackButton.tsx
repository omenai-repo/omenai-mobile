import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '../../config/colors.config'

type LongBlackButtonProps = {
    value: string,
    isDisabled?: boolean,
    onClick: () => void,
    isLoading?: boolean,
    radius?: number,
    bgColor?: string
}

export default function LongBlackButton({value, onClick, isDisabled, isLoading, radius = 0, bgColor} : LongBlackButtonProps) {

    if (isDisabled || isLoading)
    return(
        <View style={[styles.container, {backgroundColor: '#E0E0E0'}]}>
            <Text style={[styles.text, {color: '#A1A1A1'}]}>{value}</Text>
        </View>
    )

    return (
        <TouchableOpacity activeOpacity={1} style={[styles.container, radius > 0 && {borderRadius: radius}, bgColor ? {backgroundColor: bgColor}: null]} onPress={onClick}>
            <Text style={styles.text}>{value}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 55,
        width: '100%',
        backgroundColor: colors.primary_black,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8
    },
    text: {
        color: colors.white,
        fontSize: 16
    }
})