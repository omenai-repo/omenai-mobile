import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react';
import Input from 'components/inputs/Input';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { Entypo, Feather, Fontisto } from '@expo/vector-icons';
import { colors } from 'config/colors.config';

type cardInfoProps = {
    name: string,
    cardNumber: string,
    expiryMonth: string,
    year: string,
    cvv: string
}

type CardInfoProps = {
    handleNext: () => void
}

export default function CardInfo({handleNext}:CardInfoProps) {
    const [cardInfo, setCardInfo] = useState<cardInfoProps>({name: '', cardNumber: '', expiryMonth: '', year: '', cvv: ''});

    return (
        <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: 16, flex: 1}}>Payment Method</Text>
                <View style={styles.secureForm}>
                    <Fontisto name='locked' size={10} />
                    <Text style={{fontSize: 12, color: colors.primary_black}}>Secure form</Text>
                </View>
            </View>
            <View style={styles.formContainer}>
                <Input
                    label='Card name'
                    onInputChange={e => setCardInfo(prev => ({...prev, name: e}))}
                    value={cardInfo.name}
                    placeHolder='Enter the name on your card'
                />
                <Input
                    label='Card number'
                    onInputChange={e => setCardInfo(prev => ({...prev, cardNumber: e}))}
                    value={cardInfo.cardNumber}
                    placeHolder='Enter the card number'
                />
                <View style={{flexDirection: 'row', gap: 20}}>
                    <View style={{flex: 1}}>
                        <Input
                            label='Expiry month'
                            onInputChange={e => setCardInfo(prev => ({...prev, expiryMonth: e}))}
                            value={cardInfo.expiryMonth}
                            placeHolder='MM'
                        />
                    </View>
                    <View style={{flex: 1}}>
                        <Input
                            label='Expiry year'
                            onInputChange={e => setCardInfo(prev => ({...prev, year: e}))}
                            value={cardInfo.year}
                            placeHolder='YYYY'
                        />
                    </View>
                </View>
                <Input
                    label='CVV'
                    onInputChange={e => setCardInfo(prev => ({...prev, cvv: e}))}
                    value={cardInfo.cvv}
                    placeHolder='Enter the CVV number'
                />
            </View>
            <LongBlackButton
                onClick={handleNext}
                value='Submit'
            />
        </View>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        gap: 20,
        marginTop: 20,
        marginBottom: 30
    },
    secureForm: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    }
})