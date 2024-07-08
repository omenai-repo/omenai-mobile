import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import LongBlackButton from 'components/buttons/LongBlackButton'
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';

export default function Subscriptions() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View style={styles.headerContainer}>
                    <Text style={{fontSize: 20, textAlign: 'center'}}>Subscriptions</Text>
                </View>
            </SafeAreaView>
            <ScrollView style={styles.mainContainer}>
                <LongBlackButton value='billing' onClick={() => navigation.navigate(screenName.gallery.billing)}/>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    headerContainer: {
        paddingHorizontal: 20,
    },
    mainContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        flex: 1
    },
})