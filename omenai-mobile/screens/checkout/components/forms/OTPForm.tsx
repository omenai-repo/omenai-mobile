import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Input from 'components/inputs/Input';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { subscriptionStepperStore } from 'store/subscriptionStepper/subscriptionStepperStore';
import { validateCharge } from 'services/subscriptions/subscribeUser/validateCharge';
import { useModalStore } from 'store/modal/modalStore';

type OTPFormProps = {
    handleNext: () => void,
    set_id: (id: string) => void
}

export default function OTPForm({handleNext, set_id}:OTPFormProps) {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { flw_ref } = subscriptionStepperStore();
    const { updateModal } = useModalStore()

    async function handleSubmit() {
        if (otp === "" || otp.length < 4) {
            updateModal({message: "Invalid input parameter", modalType: 'error', showModal: true})
            return;
        }
        setIsLoading(true);
    
        const data = { otp, flw_ref };
    
        const response = await validateCharge(data);
        if (response?.isOk) {
          if (response.data.status === "error") {
            console.log(response.data);
            updateModal({message: response.data.message, modalType: 'error', showModal: true})
          } else {
            console.log(response.data);
            set_id(response.data.data.id);
            handleNext();
          }
        } else {
            updateModal({message: "Something went wrong", modalType: 'error', showModal: true})
        }
        setIsLoading(false);
    }

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
                onClick={handleSubmit}
                isLoading={isLoading}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 30
    }
})