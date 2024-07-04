import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { colors } from '../../config/colors.config'

type InputProps = {
    label: string,
    value: string,
    onInputChange: (e: string) => void,
    placeHolder?: string,
    keyboardType?: KeyboardTypeOptions,
    errorMessage?: string,
    handleBlur?: () => void,
    disabled?: boolean,
    defaultValue?: string
}

export default function Input({label, onInputChange, placeHolder, keyboardType, value, errorMessage, handleBlur, disabled, defaultValue}: InputProps) {
    return (
        <View style={{zIndex: 100}}>
            <Text style={styles.label}>{label}</Text>
            <TextInput 
                onChangeText={onInputChange} 
                placeholder={placeHolder} 
                style={[styles.inputContainer, disabled && {color: '#1a1a1a70'}]}
                keyboardType={keyboardType}
                autoCapitalize="none"
                value={defaultValue ? undefined : value} 
                defaultValue={defaultValue}
                onBlur={handleBlur}
                editable={!disabled}
            />
            {(errorMessage && errorMessage?.length > 0) && <Text style={styles.errorMessage}>{errorMessage}</Text>}
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
    },
    errorMessage: {
        color: '#ff0000',
        marginTop: 2
    }
})