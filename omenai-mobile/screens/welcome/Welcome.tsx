import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

import omenai_logo from '../../assets/omenai-logo.png';
import welcome_banner from '../../assets/images/welcome-banner.png';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../config/colors.config';
import LongBlackButton from '../../components/buttons/LongBlackButton';
import LongWhiteButton from '../../components/buttons/LongWhiteButton';
import { screenName } from '../../constants/screenNames.constants';

export default function Welcome() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const handleNavigation = (value: any) => {
        navigation.navigate(value)
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image source={omenai_logo} />
                </View>
                <Image source={welcome_banner} style={styles.welcomeBanner} />
                <Text style={styles.largeText}>Get the best art deals anywhere, any time</Text>
                <View style={styles.buttonContainer}>
                    <LongBlackButton value='Log In' onClick={() => handleNavigation(screenName.login)} isDisabled={false} />
                    <LongWhiteButton value='Sign Up' onClick={() => handleNavigation(screenName.register)} />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 20
    },
    imageContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    welcomeBanner: {
        width: '100%',
        objectFit: 'contain',
        maxHeight: 350,
        marginTop: 20
    },
    largeText: {
        fontSize: 38,
        fontWeight: '500',
        lineHeight: 54,
        marginTop: 10
    },
    buttonContainer: {
        marginTop: 50,
        gap: 15
    }
})