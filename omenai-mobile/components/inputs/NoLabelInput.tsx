import { KeyboardTypeOptions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import { TextInput } from 'react-native-gesture-handler';

type NoLabelInputProps = {
    value: string,
    onInputChange: (e: string) => void,
    placeHolder: string,
    keyboardType?: KeyboardTypeOptions
}

export default function NoLabelInput({value, onInputChange, placeHolder, keyboardType}:NoLabelInputProps) {
    return (
        <TextInput
            onChangeText={onInputChange} 
            placeholder={placeHolder} 
            style={styles.container}
            keyboardType={keyboardType}
            autoCapitalize="none"
            value={value}
            // autoComplete='email'
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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