import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../../config/colors.config'
import Feather from '@expo/vector-icons/Feather';

type PasswordInputProps = {
    label: string,
    onInputChange: (e: string) => void,
    placeHolder: string,
    value: string,
    errorMessage?: string,
    handleBlur?: () => void
}


export default function PasswordInput({label, onInputChange, placeHolder, value, errorMessage, handleBlur}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={placeHolder}
                    onChangeText={onInputChange}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    value={value}
                    onBlur={handleBlur}
                />
                <TouchableOpacity style={styles.hideButton} onPress={() => setShowPassword(prev => !prev)}>
                    <Feather name={showPassword ? "eye" : "eye-off"} size={16} color="#858585" />
                </TouchableOpacity>
            </View>
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
        height: 60,
        width: '100%',
        borderWidth: 1,
        borderColor: colors.inputBorder,
        backgroundColor: '#FAFAFA',
        overflow: 'hidden',
        borderRadius: 5,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 20,
        backgroundColor: 'transparent'
    },
    hideButton: {
        width: 50,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorMessage: {
        color: '#ff0000',
        marginTop: 2
    }
})