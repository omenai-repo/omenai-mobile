import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import PasswordInput from '../../../../../components/inputs/PasswordInput'
import Input from '../../../../../components/inputs/Input'
import BackFormButton from '../../../../../components/buttons/BackFormButton'
import NextButton from '../../../../../components/buttons/NextButton'
import { useIndividualAuthRegisterStore } from '../../../../../store/auth/register/IndividualAuthRegisterStore'

export default function IndividualForm() {
    const { individualRegisterData, setEmail, setName, setPassword, setConfirmPassword, pageIndex, setPageIndex } = useIndividualAuthRegisterStore();

    return (
        <View style={styles.container}>
            <View style={{gap: 20}}>
                <Input 
                    label='Full name'
                    keyboardType='default' 
                    onInputChange={setName} 
                    placeHolder='Enter your full name'
                    value={individualRegisterData.name}
                />
                <Input 
                    label='Email address' 
                    keyboardType='email-address' 
                    onInputChange={setEmail} 
                    placeHolder='Enter your email address'
                    value={individualRegisterData.email}
                />
                <PasswordInput 
                    label='Password' 
                    onInputChange={setPassword} 
                    placeHolder='Enter password'
                    value={individualRegisterData.password}
                />
                <PasswordInput 
                    label='Confirm password' 
                    onInputChange={setConfirmPassword} 
                    placeHolder='Enter password again'
                    value={individualRegisterData.confirmPassword}
                />
            </View>
            <View style={styles.buttonsContainer}>
                {/* <BackFormButton handleBackClick={() => console.log('')} /> */}
                <View style={{flex: 1}} />
                <NextButton isDisabled={false} handleButtonClick={() => setPageIndex(pageIndex + 1)}  />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        gap: 40
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    }
})