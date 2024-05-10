import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useGalleryAuthRegisterStore } from '@/store/auth/register/GalleryAuthRegisterStore'
import NextButton from '@/components/buttons/NextButton';
import { validate } from '@/lib/validations/validatorGroup';
import Input from '@/components/inputs/Input';
import BackFormButton from '@/components/buttons/BackFormButton';
import LargeInput from '@/components/inputs/LargeInput';

export default function ExtraGalleryDetailsInput() {
    const [formErrors, setFormErrors] = useState<Partial<GallerySignupData>>({admin: "", location: "", description: ""});

    const {pageIndex, setPageIndex, galleryRegisterData, setAdmin, setLocation, setDescription} = useGalleryAuthRegisterStore();

    const checkIsDisabled = () => {
        // Check if there are no error messages and all input fields are filled
        const isFormValid = Object.values(formErrors).every((error) => error === "");
        const areAllFieldsFilled = Object.values({
            admin: galleryRegisterData.admin,
            location: galleryRegisterData.location,
            description: galleryRegisterData.description
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

    return (
        <View style={{gap: 40}}>
            <View style={{gap: 20}}>
                <Input
                    label={`Administrator’s Full Name`}
                    keyboardType='default' 
                    onInputChange={setAdmin} 
                    placeHolder='Enter your full name'
                    value={galleryRegisterData.admin}
                    handleBlur={() => handleValidationChecks('admin', galleryRegisterData.admin)}
                    errorMessage={formErrors.admin}
                />
                <Input
                    label={`Gallery Location`}
                    keyboardType='default' 
                    onInputChange={setLocation} 
                    placeHolder='Enter location of gallery'
                    value={galleryRegisterData.location}
                    handleBlur={() => handleValidationChecks('location', galleryRegisterData.location)}
                    errorMessage={formErrors.location}
                />
                <LargeInput
                    label={`Gallery Description`}
                    onInputChange={setDescription} 
                    placeHolder='Write a description of your gallery (not more than 100 words)'
                    value={galleryRegisterData.description}
                    handleBlur={() => handleValidationChecks('description', galleryRegisterData.description)}
                    errorMessage={formErrors.description}
                />
            </View>
            <View style={styles.buttonsContainer}>
                <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
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