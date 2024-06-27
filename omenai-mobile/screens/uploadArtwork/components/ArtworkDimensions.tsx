import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import Input from 'components/inputs/Input'
import LongBlackButton from 'components/buttons/LongBlackButton'
import { uploadArtworkStore } from 'store/gallery/uploadArtworkStore'
import NoLabelInput from 'components/inputs/NoLabelInput'

export default function ArtworkDimensions() {
    const {setActiveIndex, activeIndex} = uploadArtworkStore();

    return (
        <View style={styles.container}>
            <View style={styles.inputsContainer}>
                <View>
                    <Text style={styles.label}>Dimensions (in inches)</Text>
                    <View style={styles.flexInputsContainer}>
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
    },
    label: {
        fontSize: 14, 
        color: colors.inputLabel
    }
})