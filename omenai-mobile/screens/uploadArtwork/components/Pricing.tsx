import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import Input from 'components/inputs/Input'
import CustomSelectPicker from 'components/inputs/CustomSelectPicker'
import { displayPrice, preferredShippingCarrier } from 'data/uploadArtworkForm.data'
import LongBlackButton from 'components/buttons/LongBlackButton'
import { uploadArtworkStore } from 'store/gallery/uploadArtworkStore'

export default function Pricing() {
    const {setActiveIndex, activeIndex} = uploadArtworkStore();

    return (
        <View style={styles.container}>
            <View style={styles.inputsContainer}>
                <Input
                    label='Price ($)'
                    onInputChange={e => console.log(e)}
                    placeHolder='Enter your price'
                    value=''
                    keyboardType="decimal-pad"
                />
                <View style={{zIndex: 10}}>
                    <CustomSelectPicker
                        label='Display price'
                        data={displayPrice}
                        placeholder='Select'
                        value=''
                        handleSetValue={e => console.log(e)}
                    />
                </View>
                <View>
                    <CustomSelectPicker
                        label='Preferred shipping carrier'
                        data={preferredShippingCarrier}
                        placeholder='Yes'
                        value=''
                        handleSetValue={e => console.log(e)}
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