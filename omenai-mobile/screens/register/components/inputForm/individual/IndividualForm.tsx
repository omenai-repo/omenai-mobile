import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import PasswordInput from '../../../../../components/inputs/PasswordInput'
import Input from '../../../../../components/inputs/Input'
import NextButton from '../../../../../components/buttons/NextButton'
import { useIndividualAuthRegisterStore } from '../../../../../store/auth/register/IndividualAuthRegisterStore'
import { validate } from '../../../../../lib/validations/validatorGroup'

export default function IndividualForm() {
    const { individualRegisterData, setEmail, setName, setPassword, setConfirmPassword, pageIndex, setPageIndex } = useIndividualAuthRegisterStore();

    const [formErrors, setFormErrors] = useState<IndividualRegisterData>({name: '', email: '', password: '', confirmPassword: ''});

    const checkIsDisabled = () => {
        // Check if there are no error messages and all input fields are filled
        const isFormValid = Object.values(formErrors).every((error) => error === "");
        const areAllFieldsFilled = Object.values(individualRegisterData).every((value) => value !== "");

        return !(isFormValid && areAllFieldsFilled);
    }

    const handleValidationChecks = (label: string, value: string, confirm?: string) => {        
        const {success, errors} : {success: boolean, errors: string[] | []} = validate(value, label, confirm)
        if(!success){
            setFormErrors(prev => ({...prev, [label]: errors[0]}));
        }else{
            setFormErrors(prev => ({...prev, [label]: ''}));
        }
    };

     //
     useEffect(() => {
        if (individualRegisterData.name) {
            handleValidationChecks('name', individualRegisterData.name)
        }
        if(individualRegisterData.email){
            handleValidationChecks('email', individualRegisterData.email)
        }
        if(individualRegisterData.password){
            handleValidationChecks('password', individualRegisterData.password)
        }
        if(individualRegisterData.confirmPassword){
            handleValidationChecks('confirmPassword', individualRegisterData.password, individualRegisterData.confirmPassword)
        }
        return

    }, [individualRegisterData]);

    return (
        <View style={styles.container}>
            <View style={{gap: 20}}>
                <Input 
                    label='Full name'
                    keyboardType='default' 
                    onInputChange={setName} 
                    placeHolder='Enter your full name'
                    value={individualRegisterData.name}
                    errorMessage={formErrors.name}
                />
                <Input 
                    label='Email address' 
                    keyboardType='email-address' 
                    onInputChange={setEmail} 
                    placeHolder='Enter your email address'
                    value={individualRegisterData.email}
                    errorMessage={formErrors.email}
                />
                <PasswordInput 
                    label='Password' 
                    onInputChange={setPassword} 
                    placeHolder='Enter password'
                    value={individualRegisterData.password}
                    errorMessage={formErrors.password}
                />
                <PasswordInput 
                    label='Confirm password' 
                    onInputChange={setConfirmPassword} 
                    placeHolder='Enter password again'
                    value={individualRegisterData.confirmPassword}
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