import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../../config/colors.config'
import Feather from '@expo/vector-icons/Feather';

type PasswordInputProps = {
    label: string,
    onInputChange: (e: string) => void,
    placeHolder: string
}


export default function PasswordInput({label, onInputChange, placeHolder}: PasswordInputProps) {
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
                />
                <TouchableOpacity style={styles.hideButton} onPress={() => setShowPassword(prev => !prev)}>
                    <Feather name={showPassword ? "eye-off" : "eye"} size={16} color="#858585" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        color: COLORS.inputLabel
    },
    inputContainer: {
        height: 60,
        width: '100%',
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
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
    }
})