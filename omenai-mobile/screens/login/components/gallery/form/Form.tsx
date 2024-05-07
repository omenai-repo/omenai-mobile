import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LongBlackButton from '../../../../../components/buttons/LongBlackButton'
import Input from '../../../../../components/inputs/Input'

export default function Form() {
    return (
        <View style={styles.container}>
            <View style={{gap: 20}}>
                <Input label='Gallery name' keyboardType='default' onInputChange={e => console.log(e)} placeHolder='Enter gallery name' />
                <Input label='Email address' keyboardType='email-address' onInputChange={e => console.log(e)} placeHolder='Enter your email address' />
            </View>
            <View>
                <LongBlackButton
                    value='Join waitlist'
                    isDisabled={false}
                    onClick={() => console.log('')}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        gap: 40
    }
})