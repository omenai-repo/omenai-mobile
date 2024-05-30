import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import mailIcon from '../../../assets/images/forgot-password-email-success.png';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';

export default function PriceQuoteSent() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    return (
        <View style={styles.container}>
            <Text style={styles.titleHeader}>Price quote sent</Text>
            <View style={styles.summaryContainer}>
                <Text style={{fontSize: 16, textAlign: 'center', color: colors.primary_black}}>A price quote has been sent to your email</Text>
                <Image style={{marginTop: 40, marginBottom: 60}} source={mailIcon} />
                <LongBlackButton value='Return to home' onClick={() => navigation.navigate(screenName.home)} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    titleHeader: {
        fontSize: 20,
        fontWeight: 500,
        color: colors.primary_black,
        textAlign: 'center'
    },
    summaryContainer: {
        borderWidth: 1,
        borderColor: colors.inputBorder,
        marginTop: 40,
        paddingHorizontal: 20,
        paddingVertical: 30,
        backgroundColor: '#FAFAFA',
        alignItems: 'center'
    },
})