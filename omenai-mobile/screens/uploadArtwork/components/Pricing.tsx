import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from 'config/colors.config'
import Input from 'components/inputs/Input'
import CustomSelectPicker from 'components/inputs/CustomSelectPicker'
import { displayPrice, preferredShippingCarrier } from 'data/uploadArtworkForm.data'
import LongBlackButton from 'components/buttons/LongBlackButton'
import { uploadArtworkStore } from 'store/gallery/uploadArtworkStore';
import { validate } from 'lib/validations/upload_artwork_input_validator/validator'

type artworkPricingErrorsType = {
    price: string
}

export default function Pricing() {
    const {setActiveIndex, activeIndex, artworkUploadData, updateArtworkUploadData} = uploadArtworkStore();

    const [formErrors, setFormErrors] = useState<artworkPricingErrorsType>({price: ''});

    const checkIsDisabled = () => {
        // Check if there are no error messages and all input fields are filled
        const isFormValid = Object.values(formErrors).every((error) => error === "");
        const areAllFieldsFilled = Object.values({
            pricing: artworkUploadData.price,
            showPrice: artworkUploadData.shouldShowPrice
        }).every((value) => value !== "");

        return !(isFormValid && areAllFieldsFilled);
    }

    const handleValidationChecks = (label: string, value: string) => {        
        const {success, errors} : {success: boolean, errors: string[] | []} = validate(label, value)
        if(!success){
            setFormErrors(prev => ({...prev, [label]: errors[0]}));
        }else{
            setFormErrors(prev => ({...prev, [label]: ''}));
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputsContainer}>
                <Input
                    label='Price ($)'
                    onInputChange={value => updateArtworkUploadData('price', parseInt(value, 10))}
                    placeHolder='Enter your price'
                    value={artworkUploadData.price}
                    handleBlur={() => handleValidationChecks('price', JSON.stringify(artworkUploadData.price))}
                    errorMessage={formErrors.price}
                    keyboardType="decimal-pad"
                />
                <View style={{zIndex: 10}}>
                    <CustomSelectPicker
                        label='Display price'
                        data={displayPrice}
                        placeholder='Select'
                        value={artworkUploadData.shouldShowPrice}
                        handleSetValue={value => updateArtworkUploadData('shouldShowPrice', value)}
                    />
                </View>
            </View>
            <View style={{zIndex: 2}}>
                <LongBlackButton
                    value='Proceed'
                    onClick={() => setActiveIndex(activeIndex + 1)}
                    isLoading={false}
                    isDisabled={checkIsDisabled()}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 100
    },
    inputsContainer: {
        gap: 20,
        marginBottom: 50,
        zIndex: 3
    },
    flexInputsContainer: {
        flexDirection: 'row',
        gap: 20
    },
    label: {
        fontSize: 14, 
        color: colors.inputLabel
    }
})