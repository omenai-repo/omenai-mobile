import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../../config/colors.config'
import AuthHeader from '../../components/auth/AuthHeader'
import AuthTabs from '../../components/auth/AuthTabs';
import FormController from './components/FormController';

export default function Register() {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <View style={styles.container}>
            <AuthHeader
                title='Create an account'
                subTitle='Fill in required details and create an account'
                handleBackClick={() => console.log('')}
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