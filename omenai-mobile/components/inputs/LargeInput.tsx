import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { colors } from '../../config/colors.config'

type InputProps = {
    label: string,
    value: string,
    onInputChange: (e: string) => void,
    placeHolder: string,
    errorMessage?: string,
    handleBlur?: () => void
}

export default function LargeInput({label, onInputChange, placeHolder, value, errorMessage, handleBlur}: InputProps) {
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
                onBlur={handleBlur}
                multiline
                numberOfLines={4}
            />
            {errorMessage && errorMessage?.length > 0 && <Text style={styles.errorMessage}>{errorMessage}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        color: colors.inputLabel
    },
    inputContainer: {
        height: 140,
        width: '100%',
        borderWidth: 1,
        borderColor: colors.inputBorder,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 20,
        paddingTop: 15,
        borderRadius: 5,
        marginTop: 10
    },
    errorMessage: {
        color: '#ff0000',
        marginTop: 2
    }
})