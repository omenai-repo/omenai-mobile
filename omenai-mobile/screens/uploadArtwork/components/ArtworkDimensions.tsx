import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from 'config/colors.config'
import Input from 'components/inputs/Input'
import LongBlackButton from 'components/buttons/LongBlackButton'
import { uploadArtworkStore } from 'store/gallery/uploadArtworkStore'
import NoLabelInput from 'components/inputs/NoLabelInput';
import { validate } from 'lib/validations/upload_artwork_input_validator/validator'

type artworkDimensionsErrorsType = {
    height: string,
    depth: string,
    width: string,
    weight: string
}

export default function ArtworkDimensions() {
    const {setActiveIndex, activeIndex, artworkUploadData, updateArtworkUploadData} = uploadArtworkStore();

    const [formErrors, setFormErrors] = useState<artworkDimensionsErrorsType>({weight: '', depth: '', height: '', width: ''});

    const checkIsDisabled = () => {
        // Check if there are no error messages and all input fields are filled
        const isFormValid = Object.values(formErrors).every((error) => error === "");
        const areAllFieldsFilled = Object.values({
            weight: artworkUploadData.weight,
            depth: artworkUploadData.depth,
            height: artworkUploadData.height,
            width: artworkUploadData.width
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
                <View>
                    <Text style={styles.label}>Dimensions (in inches)</Text>
                    <View style={styles.flexInputsContainer}>
                        <NoLabelInput
                            placeHolder='Height'
                            onInputChange={value => updateArtworkUploadData('height', value)}
                            value={artworkUploadData.height}
                            handleBlur={() => handleValidationChecks('height', artworkUploadData.height)}
                            errorMessage={formErrors.height}
                        />
                        <NoLabelInput 
                            placeHolder='Width'
                            onInputChange={value => updateArtworkUploadData('width', value)}
                            value={artworkUploadData.width}
                            handleBlur={() => handleValidationChecks('width', artworkUploadData.width)}
                            errorMessage={formErrors.width}
                        />
                        <NoLabelInput 
                            placeHolder='Depth'
                            onInputChange={value => updateArtworkUploadData('depth', value)}
                            value={artworkUploadData.depth || ''}
                            handleBlur={() => handleValidationChecks('depth', artworkUploadData.depth || '')}
                            errorMessage={formErrors.depth}
                        />
                    </View>
                </View>
                <Input
                    label='Weight (in Kg)'
                    onInputChange={value => updateArtworkUploadData('weight', value)}
                    placeHolder='Enter weight of artwork'
                    value={artworkUploadData.weight}
                    handleBlur={() => handleValidationChecks('weight', artworkUploadData.weight)}
                    errorMessage={formErrors.weight}
                />
            </View>
            <LongBlackButton
                value='Proceed'
                onClick={() => setActiveIndex(activeIndex + 1)}
                isLoading={false}
                isDisabled={checkIsDisabled()}
            />
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
        marginBottom: 50
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