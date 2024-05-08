import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useIndividualAuthLoginStore } from '../../../../../store/auth/login/IndividualAuthLoginStore'
import PasswordInput from '@/components/inputs/PasswordInput'
import Input from '@/components/inputs/Input'
import LongBlackButton from '@/components/buttons/LongBlackButton'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { screenName } from '@/constants/screenNames.constants'

export default function Form() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const { individualLoginData, setEmail, setPassword, handleSubmit } = useIndividualAuthLoginStore()

    return (
        <View style={styles.container}>
            <View style={{gap: 20}}>
                <Input
                    label='Email address' 
                    keyboardType='email-address' 
                    onInputChange={setEmail} 
                    placeHolder='Enter your email address'
                    value={individualLoginData.email}
                />
                <PasswordInput
                    label='Password' 
                    onInputChange={setPassword} 
                    placeHolder='Enter password'
                    value={individualLoginData.password}
                />
            </View>
            <View style={{gap: 40}}>
                <LongBlackButton
                    value='Log In'
                    isDisabled={false}
                    onClick={handleSubmit}
                />
                <TouchableOpacity onPress={() => navigation.navigate(screenName.forgotPassword)}>
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