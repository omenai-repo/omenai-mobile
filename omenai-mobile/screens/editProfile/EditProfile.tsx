import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import { SafeAreaView } from 'react-native-safe-area-context'
import BackScreenButton from 'components/buttons/BackScreenButton'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

export default function EditProfile() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View style={styles.topContainer}>
                    <BackScreenButton handleClick={() => navigation.goBack()} />
                    <Text style={styles.topTitle}>Edit profile</Text>
                    <View style={{width: 50}} />
                </View>
            </SafeAreaView>
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    topContainer: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    topTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
        color: colors.primary_black
    },
})