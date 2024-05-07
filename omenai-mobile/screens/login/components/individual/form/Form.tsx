import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Input from '../../../../../components/inputs/Input'
import PasswordInput from '../../../../../components/inputs/PasswordInput'
import LongBlackButton from '../../../../../components/buttons/LongBlackButton'

export default function Form() {
    return (
        <View style={styles.container}>
            <View style={{gap: 20}}>
                <Input label='Email address' onInputChange={e => console.log(e)} placeHolder='Enter your email address' />
                <PasswordInput label='Password' onInputChange={e => console.log(e)} placeHolder='Enter password' />
            </View>
            <View style={{gap: 40}}>
                <LongBlackButton
                    value='Log In'
                    isDisabled
                    onClick={() => console.log('')}
                />
                <TouchableOpacity>
                    <Text style={styles.resetText}>Forgot password? Click here</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        gap: 40
    },
    resetText: {
        fontSize: 16,
        textAlign: 'center'
    }
})