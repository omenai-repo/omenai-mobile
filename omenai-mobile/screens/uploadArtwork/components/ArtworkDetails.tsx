import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Input from 'components/inputs/Input'
import LargeInput from 'components/inputs/LargeInput'
import UploadImageInput from 'components/inputs/UploadImageInput'
import LongBlackButton from 'components/buttons/LongBlackButton'
import { uploadArtworkStore } from 'store/artworks/UploadArtworkStore'
import CustomSelectPicker from 'components/inputs/CustomSelectPicker'

export default function ArtworkDetails() {
    const {setActiveIndex, activeIndex} = uploadArtworkStore();

    return (
        <View style={styles.container}>
            <View style={styles.inputsContainer}>
                <Input
                    label='Artwork title'
                    onInputChange={e => console.log(e)}
                    placeHolder='Enter the name of your artwork'
                    value=''
                />
                <LargeInput
                    label='Artwork description'
                    onInputChange={e => console.log(e)}
                    placeHolder='Write a description of your artwork (not more than 100 words)'
                    value=''
                />
                <View style={styles.flexInputsContainer}>
                    <View style={{flex: 1}}>
                        <Input
                            label='Year'
                            onInputChange={e => console.log(e)}
                            placeHolder='Enter year of creation'
                            value=''
                            keyboardType="decimal-pad"
                        />
                    </View>
                    <View style={{flex: 1}}>
                        <CustomSelectPicker
                            label='Medium'
                            data={[]}
                            placeholder='Select medium'
                            value=''
                            handleSetValue={e => console.log(e)}
                        />
                    </View>
                </View>
                <View style={styles.flexInputsContainer}>
                    <View style={{flex: 1}}>
                        <CustomSelectPicker
                            label='Rarity'
                            data={[]}
                            placeholder='Select rarity'
                            value=''
                            handleSetValue={e => console.log(e)}
                        />
                    </View>
                    <View style={{flex: 1}}>
                        <CustomSelectPicker
                            label='Certificate of authenticity'
                            data={[]}
                            placeholder='Yes'
                            value=''
                            handleSetValue={e => console.log(e)}
                        />
                    </View>
                </View>
                <Input
                    label='Materials'
                    onInputChange={e => console.log(e)}
                    placeHolder='Enter the materials used (separate each with a comma)'
                    value=''
                    keyboardType="decimal-pad"
                />
                <View style={styles.flexInputsContainer}>
                    <View style={{flex: 1}}>
                        <CustomSelectPicker
                            label='Signature'
                            data={[]}
                            placeholder='Choose source'
                            value=''
                            handleSetValue={e => console.log(e)}
                        />
                    </View>
                    <View style={{flex: 1}}>
                        <CustomSelectPicker
                            label='Framing'
                            data={[]}
                            placeholder='Choose frame'
                            value=''
                            handleSetValue={e => console.log(e)}
                        />
                    </View>
                </View>
            </View>
            <LongBlackButton
                value='Proceed'
                onClick={() => setActiveIndex(activeIndex + 1)}
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