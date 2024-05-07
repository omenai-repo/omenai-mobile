import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS } from '../../config/colors.config'
import AntDesign from '@expo/vector-icons/AntDesign';

export default function BackFormButton({handleBackClick}: {handleBackClick: () => void}) {
    return (
        <TouchableOpacity style={styles.container} onPress={handleBackClick}>
            <AntDesign name='arrowleft' color={COLORS.black} size={24} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 55,
        width: 70,
        borderWidth: 1,
        borderColor: COLORS.black,
        alignItems: 'center',
        justifyContent: 'center'
    }
})