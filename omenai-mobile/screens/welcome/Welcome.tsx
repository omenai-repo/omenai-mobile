import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

import omenai_logo from '../../assets/omenai-logo.png';
import welcome_banner from '../../assets/images/welcome-banner.png';
import LongWhiteButton from '../../components/buttons/LongWhiteButton';
import LongBlackButton from '../../components/buttons/LongBlackButton';

export default function Welcome() {
    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image source={omenai_logo} />
                </View>
                <Image source={welcome_banner} style={styles.welcomeBanner} />
                <Text style={styles.largeText}>Get the best art deals anywhere, any time</Text>
                <View style={styles.buttonContainer}>
                    <LongBlackButton value='Log in' onClick={() => console.log('')} isDisabled={false} />
                    <LongWhiteButton value='Sign Up' onClick={() => console.log('')} />
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