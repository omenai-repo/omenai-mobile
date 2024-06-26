import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign, Feather } from '@expo/vector-icons'
import { colors } from '../../config/colors.config'

type BackScreenButtonTypes = {
    handleClick: () => void,
    cancle?: boolean
}

export default function BackScreenButton({handleClick, cancle}: BackScreenButtonTypes) {
    return (
        <TouchableOpacity activeOpacity={1} onPress={handleClick}>
            <View style={styles.container}>
                {cancle ? <Feather name='x' color={colors.primary_black} size={20} /> : <AntDesign name='arrowleft' color={colors.primary_black} size={20} />}
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