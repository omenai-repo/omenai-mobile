import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function Loader() {
    return (
        <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        height: 500,
        alignItems: 'center',
        justifyContent: 'center'
    }
})