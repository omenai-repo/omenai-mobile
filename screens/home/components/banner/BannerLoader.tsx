import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import tailwind from 'twrnc'

export default function BannerLoader() {
    return (
        <View style={styles.container}>
            <View style={tailwind`flex-1 flex-row gap-[20px] p-[15px] rounded-lx bg-[#f5f5f5]`}>
                <View style={{flex: 1}}>
                    <View style={{height: 25, backgroundColor: '#ddd'}} />
                    <View style={{marginTop: 20, gap: 10}}>
                        <View style={{height: 20, backgroundColor: '#ddd'}} />
                        <View style={{height: 20, backgroundColor: '#ddd'}} />
                    </View>
                </View>
                <View style={{height: '100%', width: 170, backgroundColor: '#ddd', borderRadius: 15}} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 250,
        flexDirection: 'row',
        padding: 20
    },
})