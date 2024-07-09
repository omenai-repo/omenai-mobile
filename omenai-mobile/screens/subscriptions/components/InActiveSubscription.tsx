import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { screenName } from 'constants/screenNames.constants';

export default function InActiveSubscription() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    return (
        <View>
            <Text style={{textAlign: 'center', marginTop: 40, marginBottom: 20, fontSize: 16}}>No active subscription</Text>
            <LongBlackButton value='Activate subscription' onClick={() => navigation.navigate(screenName.gallery.billing)}/>
        </View>
    )
}

const styles = StyleSheet.create({})