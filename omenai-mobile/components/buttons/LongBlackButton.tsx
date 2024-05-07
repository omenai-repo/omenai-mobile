import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS } from '../../config/colors.config'

type LongBlackButton = {
    value: string,
    onClick: () => void
}

export default function LongBlackButton({value, onClick} : LongBlackButton) {
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