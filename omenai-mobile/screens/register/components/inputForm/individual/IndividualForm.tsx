import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import PasswordInput from '@/components/inputs/PasswordInput'
import Input from '@/components/inputs/Input'
import NextButton from '@/components/buttons/NextButton'
import { useIndividualAuthRegisterStore } from '@/store/auth/register/IndividualAuthRegisterStore'
import { validateEmail } from '@/lib/validations/emailValidator'
import { validateText } from '@/lib/validations/textValidator'
import { validatePassword } from '@/lib/validations/passwordValidator'
import { validateConfirmPassword } from '@/lib/validations/confirmPasswordValidator'

export default function IndividualForm() {
    const { individualRegisterData, setEmail, setName, setPassword, setConfirmPassword, pageIndex, setPageIndex } = useIndividualAuthRegisterStore();

    const [formErrors, setFormErrors] = useState<IndividualRegisterData>({name: '', email: '', password: '', confirmPassword: ''});

    const checkIsDisabled = () => {
        // Check if there are no error messages and all input fields are filled
        const isFormValid = Object.values(formErrors).every((error) => error === "");
        const areAllFieldsFilled = Object.values(individualRegisterData).every((value) => value !== "");

        return !(isFormValid && areAllFieldsFilled);
    }

    return (
        <View style={styles.container}>
            <View style={{gap: 20}}>
                <Input 
                    label='Full name'
                    keyboardType='default' 
                    onInputChange={setName} 
                    placeHolder='Enter your full name'
                    value={individualRegisterData.name}
                    handleBlur={() => {
                        const validationMessage = validateText(individualRegisterData.name)
                        if(validationMessage.length > 0){
                            setFormErrors(prev => ({...prev, name: validationMessage[0]}))
                        }else{
                            setFormErrors(prev => ({...prev, name: ''}))
                        }
                    }}
                    errorMessage={formErrors.name}
                />
                <Input 
                    label='Email address' 
                    keyboardType='email-address' 
                    onInputChange={setEmail} 
                    placeHolder='Enter your email address'
                    value={individualRegisterData.email}
                    handleBlur={() => {
                        const validationMessage = validateEmail(individualRegisterData.email)
                        if(validationMessage.length > 0){
                            setFormErrors(prev => ({...prev, email: validationMessage[0]}))
                        }else{
                            setFormErrors(prev => ({...prev, email: ''}))
                        }
                    }}
                    errorMessage={formErrors.email}
                />
                <PasswordInput 
                    label='Password' 
                    onInputChange={setPassword} 
                    placeHolder='Enter password'
                    value={individualRegisterData.password}
                    handleBlur={() => {
                        const validationMessage = validatePassword(individualRegisterData.password)
                        if(validationMessage.length > 0){
                            setFormErrors(prev => ({...prev, password: validationMessage[0]}))
                        }else{
                            setFormErrors(prev => ({...prev, password: ''}))
                        }
                    }}
                    errorMessage={formErrors.password}
                />
                <PasswordInput 
                    label='Confirm password' 
                    onInputChange={setConfirmPassword} 
                    placeHolder='Enter password again'
                    value={individualRegisterData.confirmPassword}
                    handleBlur={() => {
                        const validationMessage = validateConfirmPassword(individualRegisterData.password, individualRegisterData.confirmPassword)
                        if(validationMessage.length > 0){
                            setFormErrors(prev => ({...prev, confirmPassword: validationMessage[0]}))
                        }else{
                            setFormErrors(prev => ({...prev, confirmPassword: ''}))
                        }
                    }}
                    errorMessage={formErrors.confirmPassword}
                />
            </View>
            <View style={styles.buttonsContainer}>
                {/* <BackFormButton handleBackClick={() => console.log('')} /> */}
                <View style={{flex: 1}} />
                <NextButton 
                    isDisabled={checkIsDisabled()} 
                    handleButtonClick={() => setPageIndex(pageIndex + 1)}  
                />
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