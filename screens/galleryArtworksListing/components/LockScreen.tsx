import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Octicons } from '@expo/vector-icons'
import LongBlackButton from 'components/buttons/LongBlackButton'
import { colors } from 'config/colors.config'
import BackScreenButton from 'components/buttons/BackScreenButton'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'

export default function LockScreen() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <SafeAreaView>
                <View style={{paddingHorizontal: 20}}>
                    <BackScreenButton handleClick={() => navigation.goBack()} />
                </View>
            </SafeAreaView>
            <View style={styles.container}>
                <Octicons name='shield-lock' size={40} color={colors.primary_black} />
                <Text style={{fontSize: 16, textAlign: 'center', marginVertical: 30, color: colors.primary_black}}>Your account is being verified, an agent will reach out to you within 24 hours.</Text>
                {/* <Text style={{fontSize: 16, textAlign: 'center', marginTop: 10, marginBottom: 50}}>To expedite this process, please click the ' Request gallery verification ' button below</Text> */}
                <LongBlackButton
                    value='Request gallery verification'
                    onClick={() => void('')}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 120
    }
})