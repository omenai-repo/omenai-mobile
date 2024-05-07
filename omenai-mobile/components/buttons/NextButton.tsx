import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS } from '../../config/colors.config'
import { AntDesign } from '@expo/vector-icons'

export default function NextButton({isDisabled, handleButtonClick}: {isDisabled: boolean, handleButtonClick: () => void}) {
    
    if(isDisabled)
    return(
        <View style={[styles.container, {backgroundColor: '#E0E0E0'}]}>
            <Text style={{fontSize: 16, color: '#A1A1A1'}}>Next</Text>
            <AntDesign name='arrowright' color='#A1A1A1' size={20} />
        </View>
    )

    return (
        <TouchableOpacity style={styles.container} onPress={handleButtonClick}>
            <Text style={{fontSize: 16, color: COLORS.white}}>Next</Text>
            <AntDesign name='arrowright' color={COLORS.white} size={20} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 55,
        backgroundColor: COLORS.black,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 30
    }
})