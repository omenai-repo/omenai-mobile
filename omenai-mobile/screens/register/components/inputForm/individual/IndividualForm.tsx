import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import PasswordInput from '../../../../../components/inputs/PasswordInput'
import Input from '../../../../../components/inputs/Input'
import BackFormButton from '../../../../../components/buttons/BackFormButton'
import NextButton from '../../../../../components/buttons/NextButton'

type IndividualFormProps = {
    handleNext: () => void
}

export default function IndividualForm({handleNext}: IndividualFormProps) {
    return (
        <View style={styles.container}>
            <View style={{gap: 20}}>
                <Input label='Full name' keyboardType='default' onInputChange={e => console.log(e)} placeHolder='Enter your full name' />
                <Input label='Email address' keyboardType='email-address' onInputChange={e => console.log(e)} placeHolder='Enter your email address' />
                <PasswordInput label='Password' onInputChange={e => console.log(e)} placeHolder='Enter password' />
                <PasswordInput label='Confirm password' onInputChange={e => console.log(e)} placeHolder='Enter password again' />
            </View>
            <View style={styles.buttonsContainer}>
                {/* <BackFormButton handleBackClick={() => console.log('')} /> */}
                <View style={{flex: 1}} />
                <NextButton isDisabled={false} handleButtonClick={handleNext}  />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        gap: 40
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    }
})