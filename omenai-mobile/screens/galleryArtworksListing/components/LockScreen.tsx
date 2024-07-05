import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Octicons } from '@expo/vector-icons'
import LongBlackButton from 'components/buttons/LongBlackButton'
import { colors } from 'config/colors.config'

export default function LockScreen() {
    return (
        <View style={styles.container}>
            <Octicons name='shield-lock' size={40} color={colors.primary_black} />
            <Text style={{fontSize: 16, textAlign: 'center', marginVertical: 30, color: colors.primary_black}}>Your account is being verified, an agent will reach out to you within 24 hours.</Text>
            {/* <Text style={{fontSize: 16, textAlign: 'center', marginTop: 10, marginBottom: 50}}>To expedite this process, please click the ' Request gallery verification ' button below</Text> */}
            <LongBlackButton
                value='Request gallery verification'
                onClick={() => void('')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20
    }
})