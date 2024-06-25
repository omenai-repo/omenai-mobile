import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Input from 'components/inputs/Input'
import LargeInput from 'components/inputs/LargeInput'
import UploadImageInput from 'components/inputs/UploadImageInput'
import NoLabelInput from 'components/inputs/NoLabelInput'
import { colors } from 'config/colors.config'
import LongBlackButton from 'components/buttons/LongBlackButton'

export default function ArtworkDetails() {
    return (
        <View style={styles.container}>
            <View style={styles.inputsContainer}>
                <Input
                    label='Artwork title'
                    onInputChange={e => console.log(e)}
                    placeHolder='Enter the name of your artwork'
                    value=''
                />
                <UploadImageInput
                    label='Upload image'
                />
                <LargeInput
                    label='Artwork description'
                    onInputChange={e => console.log(e)}
                    placeHolder='Write a description of your artwork (not more than 100 words)'
                    value=''
                />
                <View>
                    <Text style={styles.label}>Dimensions (in inches)</Text>
                    <View style={styles.dimensionsInputs}>
                        <NoLabelInput 
                            placeHolder='Length'
                            value=''
                            onInputChange={e => console.log(e)}
                            keyboardType="decimal-pad"
                        />
                        <NoLabelInput 
                            placeHolder='Width'
                            value=''
                            onInputChange={e => console.log(e)}
                            keyboardType="decimal-pad"
                        />
                        <NoLabelInput 
                            placeHolder='Depth'
                            value=''
                            onInputChange={e => console.log(e)}
                            keyboardType="decimal-pad"
                        />
                    </View>
                </View>
                <Input
                    label='Weight (in Kg)'
                    onInputChange={e => console.log(e)}
                    placeHolder='Enter weight of artwork'
                    value=''
                    keyboardType="decimal-pad"
                />
                <Input
                    label='Price ($)'
                    onInputChange={e => console.log(e)}
                    placeHolder='Enter your price'
                    value=''
                    keyboardType="decimal-pad"
                />
            </View>
            <LongBlackButton
                value='Proceed'
                onClick={() => console.log('')}
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
    dimensionsInputs: {
        flexDirection: 'row',
        gap: 20
    },
    label: {
        fontSize: 14, 
        color: colors.inputLabel
    }
})