import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react';
import Input from 'components/inputs/Input';
import LongBlackButton from 'components/buttons/LongBlackButton';

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
        <View style={styles.container}>
            <Text style={{fontSize: 16}}>Enter your card information</Text>
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
                value='Proceed'
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    formContainer: {
        gap: 20,
        marginTop: 30,
        marginBottom: 30
    }
})