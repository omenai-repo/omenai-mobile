import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '../../config/colors.config'

type FittedBlackButtonProps = {
    value: string,
    isDisabled?: boolean,
    onClick: () => void,
    isLoading?: boolean,
    children?: React.ReactNode,
    height?: number
}

export default function FittedBlackButton({value, isDisabled, onClick, isLoading, children, height}: FittedBlackButtonProps) {
    if (isDisabled || isLoading)
    return(
        <View style={[styles.container, {backgroundColor: '#E0E0E0'}, height ? {height: height} : null]}>
            <Text style={[styles.text, {color: '#A1A1A1'}]}>{value}</Text>
            {children}
        </View>
    )

    return (
        <TouchableOpacity activeOpacity={1} style={[styles.container, height ? {height: height} : null]} onPress={onClick}>
            <Text style={styles.text}>{value}</Text>
            {children}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        paddingHorizontal: 20,
        backgroundColor: colors.primary_black,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        alignContent: 'center',
        borderRadius: 5,
        gap: 10
    },
    text: {
        color: colors.white,
        fontSize: 16
    }
})