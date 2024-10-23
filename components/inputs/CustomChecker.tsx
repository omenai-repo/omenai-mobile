import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { colors } from 'config/colors.config'
import { Feather } from '@expo/vector-icons'

type CustomCheckerProps = {
    label: string, 
    isSelected: boolean,
    onPress: () => void
}

export default function CustomChecker({label, isSelected, onPress}: CustomCheckerProps) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.container}>
                <View style={[styles.box, isSelected && {backgroundColor: colors.primary_black, borderColor: colors.primary_black}]}><Feather name='check' size={10} color={colors.white} /></View>
                <Text style={{fontSize: 14, color: colors.grey}}>{label}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 10
    },
    box: {
        height: 16,
        width: 16,
        borderWidth: 2,
        borderRadius: 2,
        borderColor: colors.grey,
        alignItems: 'center',
        justifyContent: 'center'
    }
})