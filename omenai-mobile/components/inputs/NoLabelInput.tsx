import { KeyboardTypeOptions, StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import { TextInput } from 'react-native-gesture-handler';

type NoLabelInputProps = {
    value: string,
    onInputChange: (e: string) => void,
    placeHolder: string,
    keyboardType?: KeyboardTypeOptions,
    errorMessage?: string,
    handleBlur?: () => void,
}

export default function NoLabelInput({value, onInputChange, placeHolder, keyboardType, errorMessage, handleBlur}:NoLabelInputProps) {
    return (
        <View style={{flex: 1, width: '100%'}}>
            <TextInput
                onChangeText={onInputChange} 
                placeholder={placeHolder} 
                style={[styles.container, (errorMessage && errorMessage?.length > 0) ? {borderColor: '#ff0000'} : null]}
                keyboardType={keyboardType}
                autoCapitalize="none"
                value={value}
                onBlur={handleBlur}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
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
        marginTop: 2,
        width: 300
    }
})