import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGalleryAuthRegisterStore } from '../../../../store/auth/register/GalleryAuthRegisterStore'
import NextButton from '../../../../components/buttons/NextButton';
import { validate } from '../../../../lib/validations/validatorGroup';
import Input from '../../../../components/inputs/Input';
import PasswordInput from '../../../../components/inputs/PasswordInput';

export default function AccountDetailsInput() {
    const [formErrors, setFormErrors] = useState<Partial<GallerySignupData>>({name: '', email: '', password: '', confirmPassword: ''});

    const {pageIndex, setPageIndex, galleryRegisterData, setName, setEmail, setPassword, setConfirmPassword} = useGalleryAuthRegisterStore();

    const checkIsDisabled = () => {
        // Check if there are no error messages and all input fields are filled
        const isFormValid = Object.values(formErrors).every((error) => error === "");
        const areAllFieldsFilled = Object.values({
            email: galleryRegisterData.email,
            name: galleryRegisterData.name,
            password: galleryRegisterData.password,
            confirmPassword: galleryRegisterData.confirmPassword
        }).every((value) => value !== "");

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

    useEffect(() => {
        if(galleryRegisterData.name){
            handleValidationChecks('name', galleryRegisterData.name)
        }
        if(galleryRegisterData.email){
            handleValidationChecks('email', galleryRegisterData.email)
        }
        if(galleryRegisterData.password){
            handleValidationChecks('password', galleryRegisterData.password)
        }
        if(galleryRegisterData.confirmPassword){
            handleValidationChecks('confirmPassword', galleryRegisterData.password, galleryRegisterData.confirmPassword)
        }
        return

    }, [galleryRegisterData])

    return (
        <View style={{gap: 40}}>
            <View style={{gap: 20}}>
                <Input
                    label='Gallery Name'
                    keyboardType='default' 
                    onInputChange={setName} 
                    placeHolder='Enter the name of your gallery'
                    value={galleryRegisterData.name}
                    errorMessage={formErrors.name}
                />
                <Input 
                    label={`Gallery's email address`} 
                    keyboardType='email-address' 
                    onInputChange={setEmail} 
                    placeHolder={`Enter your gallery's email address`}
                    value={galleryRegisterData.email}
                    errorMessage={formErrors.email}
                />
                <PasswordInput
                    label='Password' 
                    onInputChange={setPassword} 
                    placeHolder='Enter password'
                    value={galleryRegisterData.password}
                    errorMessage={formErrors.password}
                />
                <PasswordInput 
                    label='Confirm password' 
                    onInputChange={setConfirmPassword} 
                    placeHolder='Enter password again'
                    value={galleryRegisterData.confirmPassword}
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
    buttonsContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    }
})