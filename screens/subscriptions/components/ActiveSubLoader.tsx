import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'

export default function ActiveSubLoader() {
    return (
        <View style={{gap: 20}}>
            <View style={{height: 200, backgroundColor: colors.grey50, borderRadius: 10, opacity: 0.6}} />
            <View style={{height: 150, backgroundColor: colors.grey50, borderRadius: 10, opacity: 0.6}} />
            <View style={{height: 100, backgroundColor: colors.grey50, borderRadius: 10, opacity: 0.6}} />
        </View>
    )
}

const styles = StyleSheet.create({})