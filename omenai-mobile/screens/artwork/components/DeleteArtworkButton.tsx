import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import { Feather } from '@expo/vector-icons'

export default function DeleteArtworkButton() {
    return (
        <View style={styles.container}>
            <Text style={{fontSize: 16, color: '#ff0000'}}>Delete artwork</Text>
            <Feather name='trash-2' size={18} color={'#ff0000'} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10
    }
})