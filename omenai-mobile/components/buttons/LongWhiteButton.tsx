import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '../../config/colors.config'

type LongWhiteButtonProps = {
    value: string,
    onClick: () => void
}

export default function LongWhiteButton({value, onClick} : LongWhiteButtonProps) {
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
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.black,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: colors.black,
        fontSize: 16
    }
})