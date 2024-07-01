import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Input from 'components/inputs/Input'
import CustomSelectPicker from 'components/inputs/CustomSelectPicker'
import { uploadArtworkStore } from 'store/gallery/uploadArtworkStore';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { trimWhiteSpace } from 'utils/trimWhitePace';
import { countriesListing } from 'data/uploadArtworkForm.data';
import { validate } from 'lib/validations/upload_artwork_input_validator/validator';

type artistDetailsErrorsType = {
    artist: string,
    artist_birthyear: string
}

export default function ArtistDetails() {
    const {setActiveIndex, activeIndex, updateArtworkUploadData, artworkUploadData} = uploadArtworkStore();

    const [formErrors, setFormErrors] = useState<artistDetailsErrorsType>({artist: '', artist_birthyear: ''});

    const checkIsDisabled = () => {
        // Check if there are no error messages and all input fields are filled
        const isFormValid = Object.values(formErrors).every((error) => error === "");
        const areAllFieldsFilled = Object.values({
            artist: artworkUploadData.artist,
            birth_year: artworkUploadData.artist_birthyear
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
                    label='Artist full name'
                    onInputChange={value => updateArtworkUploadData('artist', value)}
                    placeHolder='Enter artist full name'
                    value={artworkUploadData.artist}
                    handleBlur={() => handleValidationChecks('artist', artworkUploadData.artist)}
                    errorMessage={formErrors.artist}
                />
                <Input
                    label='Artist Birth year'
                    onInputChange={value => updateArtworkUploadData('artist_birthyear', value)}
                    placeHolder='Enter artist birth year'
                    value={artworkUploadData.artist_birthyear}
                    handleBlur={() => handleValidationChecks('artist_birthyear', artworkUploadData.artist_birthyear)}
                    errorMessage={formErrors.artist_birthyear}
                    keyboardType="decimal-pad"
                />
                <View>
                    <CustomSelectPicker
                        label='Artist Country of origin'
                        handleSetValue={value => updateArtworkUploadData('artist_country_origin', value)}
                        placeholder='Select country'
                        value={artworkUploadData.artist_country_origin}
                        data={countriesListing}
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
        zIndex: 5
    },
    flexInputsContainer: {
        flexDirection: 'row',
        gap: 20
    }
})