import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'
import { colors } from 'config/colors.config'

type DropDownButtonProps = {
    label: string,
    onPress: (e: boolean) => void,
    value: boolean
}

export default function DropDownButton({label, onPress, value}: DropDownButtonProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.mainContainer} onPress={() => onPress(!value)}>
                <Text style={{fontSize: 12, color: colors.primary_black}}>{label}</Text>
                <Feather name={value ? 'chevron-up' : 'chevron-down'} color={colors.primary_black} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexWrap: 'wrap',
    },
    mainContainer: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#f1f1f1',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    }
})