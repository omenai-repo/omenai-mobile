import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Input from 'components/inputs/Input'
import CustomSelectPicker from 'components/inputs/CustomSelectPicker'
import { uploadArtworkStore } from 'store/artworks/UploadArtworkStore';
import LongBlackButton from 'components/buttons/LongBlackButton';

export default function ArtistDetails() {
    const {setActiveIndex} = uploadArtworkStore();

    return (
        <View style={styles.container}>
            <View style={styles.inputsContainer}>
                <Input
                    label='Full Name'
                    onInputChange={e => console.log(e)}
                    placeHolder='Enter artist full name'
                    value=''
                />
                <Input
                    label='Birth year'
                    onInputChange={e => console.log(e)}
                    placeHolder='Enter artist birth year'
                    value=''
                    keyboardType="decimal-pad"
                />
                <CustomSelectPicker
                    label='Country of origin'
                    handleSetValue={e => console.log(e)}
                    placeholder='🇺🇸 United state of america'
                    value=''
                    data={[]}
                />
            </View>
            <LongBlackButton
                value='Proceed'
                onClick={() => setActiveIndex(3)}
                isLoading={false}
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
    }
})