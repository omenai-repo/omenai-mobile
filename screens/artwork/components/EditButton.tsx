import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import { Feather } from '@expo/vector-icons'

export default function EditButton() {
    return (
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={styles.container}>
                <Feather name='edit-2' color={colors.primary_black} size={16} />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: colors.inputBorder
    }
})