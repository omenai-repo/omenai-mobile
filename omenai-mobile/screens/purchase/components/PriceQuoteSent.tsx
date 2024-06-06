import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import mailIcon from '../../../assets/images/forgot-password-email-success.png';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';

export default function PriceQuoteSent({handleClick}: {handleClick: () => void}) {
    const navigation = useNavigation<StackNavigationProp<any>>();

    return (
        <View style={styles.container}>
            <Text style={styles.titleHeader}>Price quote sent</Text>
            <View style={styles.summaryContainer}>
                <Text style={{fontSize: 16, textAlign: 'center', color: colors.primary_black}}>Order request has been successfully recieved and is being processed. We will get back to you within 24hours</Text>
                <Image style={{marginTop: 40, marginBottom: 60}} source={mailIcon} />
                <LongBlackButton value='Return to home' onClick={handleClick} />
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