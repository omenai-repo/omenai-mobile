import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import forgotPasswordSuccessEmail from '../../../../assets/images/forgot-password-email-success.png'
import LongBlackButton from '../../../../components/buttons/LongBlackButton';
import { useForgetPasswordStore } from 'store/auth/forgotPassword/forgotPasswordStore';

export default function Success() {
    const {email} = useForgetPasswordStore();

    const handleClick = () => {
        //open primary mail app to reset password with reset link
    };

    return (
        <View style={styles.container}>
            <View style={styles.mainContainer}>
                <Text style={styles.introText}>A verification link has been sent to example</Text>
                <Text style={styles.introText}>{email}</Text>
                <Image source={forgotPasswordSuccessEmail} style={styles.successIcon} />
            </View>
            <View style={{marginTop: 70}}>
                <LongBlackButton
                    value='Open email app'
                    isDisabled={false}
                    onClick={handleClick}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 40
    },
    mainContainer: {
        alignItems: 'center'
    },
    successIcon: {
        maxHeight: 150,
        marginTop: 30
    },
    introText: {
        color: '#858585',
        fontSize: 16,
        marginTop: 5
    }
})