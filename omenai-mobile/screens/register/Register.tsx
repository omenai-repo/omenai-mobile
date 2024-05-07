import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS } from '../../config/colors.config'
import AuthHeader from '../../components/auth/AuthHeader'
import FormController from './components/FormController';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SCREEN } from '../../constants/screenNames.constants';

export default function Register() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    return (
        <View style={styles.container}>
            <AuthHeader
                title='Create an account'
                subTitle='Fill in required details and create an account'
                handleBackClick={() => navigation.navigate(SCREEN.WELCOME)}
            />
            
            <FormController />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        flex: 1
    }
})