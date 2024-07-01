import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import success_check from '../../../assets/icons/success_check.png';

export default function CompletedModal({placeholder}: {placeholder: string}) {
    return (
        <View style={styles.container}>
            <Image source={success_check} style={{height: 100, objectFit: 'contain'}} resizeMethod="resize" />
            <Text style={{fontSize: 14}}>{placeholder}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 30,
        gap: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }
})