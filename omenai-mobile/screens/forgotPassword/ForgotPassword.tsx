import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../../config/colors.config'
import AuthHeader from '../../components/auth/AuthHeader'
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from '../../constants/screenNames.constants';
import Form from './components/form/Form';
import Success from './components/success/Success';
import { ScrollView } from 'react-native-gesture-handler';

export default function ForgotPassword() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    return (
        <View style={styles.container}>
            <AuthHeader
                title='Forgot Password?'
                subTitle='Provide the details required and reset your password'
                handleBackClick={() => navigation.navigate(screenName.login)}
            />
            {isSuccess ? <Success /> : 
                (
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.container}
                    >
                        <ScrollView style={styles.container}>
                            <Form
                                setIsSuccess={setIsSuccess}
                            />
                        </ScrollView>
                    </KeyboardAvoidingView>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flex: 1
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        display: 'flex'
    }
})