import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

import successImage from '../../../../assets/icons/success_check.png';
import LongBlackButton from 'components/buttons/LongBlackButton';

export default function FinishTransaction() {
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