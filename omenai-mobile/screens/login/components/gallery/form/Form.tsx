import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function Form() {
    return (
        <View style={styles.container}>
            <Text style={{fontSize: 18, textAlign: 'center', fontWeight: '500'}}>Sign Up to gallery waitlist</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 60
    }
})