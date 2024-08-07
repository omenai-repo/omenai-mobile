import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Fontisto } from '@expo/vector-icons'
import { colors } from 'config/colors.config'
import LongBlackButton from 'components/buttons/LongBlackButton';

export default function AuthPinInput() {
    const [pin, setpin] = useState('');

    const handlePinChange = (value: string) => {
        const numbersOnly = value.replace(/\D/g, ""); // Remove non-numeric characters
    
        setpin(numbersOnly)
    };
      
    return (
        <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: 16, flex: 1}}>Pin verification</Text>
                <View style={styles.secureForm}>
                    <Fontisto name='locked' size={10} />
                    <Text style={{fontSize: 12, color: colors.primary_black}}>Secure form</Text>
                </View>
            </View>
            <View style={{marginTop: 30, marginBottom: 50}}>
                <Text style={styles.label}>Enter 4 digit pit</Text>
                <TextInput
                    onChangeText={handlePinChange} 
                    placeholder={'1234'} 
                    style={styles.inputContainer}
                    keyboardType={'number-pad'}
                    secureTextEntry={true}
                    autoCapitalize="none"
                    value={pin} 
                />
            </View>
            <LongBlackButton
                value='Submit'
                onClick={()=>{}}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        gap: 20,
        marginTop: 20,
        marginBottom: 30,
        zIndex: 100
    },
    secureForm: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    label: {
        fontSize: 14,
        color: colors.inputLabel
    },
    inputContainer: {
        height: 60,
        width: '100%',
        borderWidth: 1,
        borderColor: colors.inputBorder,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10
    },
})