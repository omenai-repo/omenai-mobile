import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { colors } from '@/config/colors.config'

type InputProps = {
    label: string,
    value: string,
    onInputChange: (e: string) => void,
    placeHolder: string,
    keyboardType: string
}

export default function Input({label, onInputChange, placeHolder, keyboardType, value}: InputProps) {
    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <TextInput 
                onChangeText={onInputChange} 
                placeholder={placeHolder} 
                style={styles.inputContainer}
                keyboardType="default"
                autoCapitalize="none"
                value={value}
                // autoComplete='email'
            />
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        color: colors.inputLabel
    },
    inputContainer: {
        height: 60,
        width: '100%',
        borderWidth: 1,
        borderColor: colors.inputBorder,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10
    }
})