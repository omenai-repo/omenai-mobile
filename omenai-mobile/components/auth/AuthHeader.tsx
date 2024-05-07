import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '../../config/colors.config'

export default function AuthHeader() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={{paddingHorizontal: 20, paddingBottom: 20, paddingTop: 10}}>
                <TouchableOpacity style={styles.backButton}></TouchableOpacity>
                <Text style={styles.headerText}>Create an account</Text>
                <Text style={styles.subText}>Access your account so you can start purchasing artworks </Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.authHeaderBg,
    },
    backButton: {
        height: 40,
        width: 40,
        borderRadius: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white
    },
    headerText: {
        fontSize: 20,
        color: COLORS.white,
        fontWeight: '500',
        marginTop: 20
    },
    subText: {
        fontSize: 14,
        marginTop: 10,
        color: COLORS.white
    }
})