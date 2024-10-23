import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'

export default function BannerLoader() {
    return (
        <View style={styles.container}>
        <View style={{flexDirection: 'row', gap: 20, flex: 1}}>
            <View style={{height: 100, width: 170, backgroundColor: '#f5f5f510'}} />
            <View style={{flex: 1}}>
                <View style={{height: 25, backgroundColor: '#f5f5f510'}} />
                <View style={{marginTop: 20, gap: 10}}>
                    <View style={{height: 20, backgroundColor: '#f5f5f510'}} />
                    <View style={{height: 20, backgroundColor: '#f5f5f510'}} />
                </View>
            </View>
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 200,
        backgroundColor: colors.primary_black,
        flexDirection: 'row',
        padding: 20
    },
})