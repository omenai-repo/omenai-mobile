import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'

import successImage from '../../../../assets/icons/success_check.png';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { subscriptionStepperStore } from 'store/subscriptionStepper/subscriptionStepperStore';

export default function FinishTransaction() {

    const { flw_ref } = subscriptionStepperStore();

    useEffect(() => {
        async function handleTransVerification(){
            
        };

        handleTransVerification()
    }, [])

    return (
        <View>
            <Text style={{fontSize: 16, textAlign: 'center'}}>Verification successful</Text>
            <Image style={{height: 100, marginHorizontal: 'auto', marginTop: 10, marginBottom: 30}} resizeMode='contain' source={successImage} />
            <LongBlackButton
                value='Finish transaction'
                onClick={() => void('')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        
    }
})