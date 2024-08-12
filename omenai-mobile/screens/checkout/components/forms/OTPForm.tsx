import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Input from 'components/inputs/Input';
import LongBlackButton from 'components/buttons/LongBlackButton';

type OTPFormProps = {
    handleNext: () => void,
    set_id: (id: string) => void
}

export default function OTPForm({handleNext, set_id}:OTPFormProps) {
    const [otp, setOtp] = useState('');

    return (
        <View style={styles.container}>
            <Input
                label='Enter OTP'
                onInputChange={setOtp}
                value={otp}
                placeHolder='Enter otp sent to email'
            />
            <LongBlackButton
                value='Verify OTP'
                onClick={handleNext}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 30
    }
})