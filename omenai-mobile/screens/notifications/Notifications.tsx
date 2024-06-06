import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { screenName } from 'constants/screenNames.constants';

export default function Notifications() {
    const navigation = useNavigation<StackNavigationProp<any>>();
    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <SafeAreaView>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text>Notifications</Text>
                    <TouchableOpacity style={{marginTop: 200}} onPress={() => navigation.navigate(screenName.home)}><Text>Go Back</Text></TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({})