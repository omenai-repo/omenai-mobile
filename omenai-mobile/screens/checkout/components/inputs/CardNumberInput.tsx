import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from 'config/colors.config';
import { getCardType } from 'utils/utils_cardTypeDetection';

import mastercardLogo from 'assets/icons/MastercardLogo.png';
import verve from 'assets/icons/verve.png';
import visa from 'assets/icons/visa.png';

interface CardNumberProps {
    onChange: (value: string) => void;
}

export default function CardNumberInput({onChange}: CardNumberProps) {
    const [cardNumber, setCardNumber] = useState<number[]>([]);
    const [cardType, setCardType] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: string) => {
        const input = e.replace(/\s+/g, ""); // Remove all spaces
        const numbersOnly = input.replace(/\D/g, ""); // Remove non-numeric characters

        const newCardNumber = numbersOnly.split("").map(Number);
        setCardNumber(newCardNumber.slice(0, 25)); // Limit to 16 digits

        const cardNumberString = newCardNumber.join("");
        const detectedCardType = getCardType(cardNumberString);
        setCardType(detectedCardType);

        console.log(detectedCardType)

        const isValid = validateCardNumber(cardNumberString);
        setError(isValid ? null : "Invalid card number");
        onChange(cardNumberString);
    };

    const validateCardNumber = (cardNumber: string): boolean => {
        return !isNaN(Number(cardNumber));
      };
    
    const formattedCardNumber = cardNumber.reduce((acc, digit, index) => {
        return index % 4 === 0 ? acc + " " + digit : acc + digit;
    }, "");

    return (
        <View>
            <Text style={styles.label}>Card number</Text>
            <View style={styles.container}>
                <TextInput
                    style={{flex: 1, paddingHorizontal: 20}}
                    value={formattedCardNumber}
                    maxLength={24}
                    placeholder="1234 1234 1234 1234"
                    onChangeText={handleInputChange}
                    keyboardType="number-pad"
                />
                {cardType !== null && (
                    <View style={styles.logoContainer}>
                        {cardType === 'mastercard' && <Image source={mastercardLogo} style={styles.logo} resizeMode="contain" />}
                        {cardType === 'visa' && <Image source={visa} style={styles.logo} resizeMode="contain" />}
                        {cardType === 'verve' && <Image source={verve} style={styles.logo} resizeMode="contain" />}
                    </View>
                )}
                
            </View>
            {error && <Text style={{fontSize: 12, color: '#ff000070'}}>{error}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        color: colors.inputLabel
    },
    container: {
        height: 60,
        width: '100%',
        borderWidth: 1,
        borderColor: colors.inputBorder,
        backgroundColor: '#FAFAFA',
        borderRadius: 5,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    logoContainer: {
        maxWidth: 50,
        justifyContent: 'flex-end',
        paddingRight: 15
    },
    logo: {
        height: 30,
        width: 35
    }
})