import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'

export default function Divider() {
    return (
        <View style={styles.divider} />
    )
}

const styles = StyleSheet.create({
    divider: {
        borderTopWidth: 1,
        borderTopColor: colors.grey50
    }
})