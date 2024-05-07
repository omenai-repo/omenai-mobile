import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS } from '../../config/colors.config'

type LongBlackButton = {
    value: string,
    isDisabled: boolean,
    onClick: () => void
}

export default function LongBlackButton({value, onClick, isDisabled} : LongBlackButton) {

    if (isDisabled)
    return(
        <View style={[styles.container, {backgroundColor: '#E0E0E0'}]}>
            <Text style={[styles.text, {color: '#A1A1A1'}]}>{value}</Text>
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
        width: '100%',
        backgroundColor: COLORS.black,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: COLORS.white,
        fontSize: 16
    }
})