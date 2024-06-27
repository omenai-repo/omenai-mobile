import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Input from 'components/inputs/Input'
import CustomSelectPicker from 'components/inputs/CustomSelectPicker'
import { uploadArtworkStore } from 'store/gallery/uploadArtworkStore';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { trimWhiteSpace } from 'utils/trimWhitePace';
import { countriesListing } from 'data/uploadArtworkForm.data';

export default function ArtistDetails() {
    const {setActiveIndex, activeIndex, updateArtworkUploadData, artworkUploadData} = uploadArtworkStore();

    const handleChange = ({label, value}: {label: string, value: string}) => {
        const trimmedValue = trimWhiteSpace(value);

        updateArtworkUploadData(label, trimmedValue);
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputsContainer}>
                <Input
                    label='Full Name'
                    onInputChange={value => handleChange({label: 'artist', value})}
                    placeHolder='Enter artist full name'
                    value={artworkUploadData.artist}
                />
                <Input
                    label='Birth year'
                    onInputChange={e => console.log(e)}
                    placeHolder='Enter artist birth year'
                    value=''
                    keyboardType="decimal-pad"
                />
                <View>
                    <CustomSelectPicker
                        label='Country of origin'
                        handleSetValue={value => handleChange({label: 'artist_country_origin', value})}
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