import { Image, StyleSheet, View, SafeAreaView } from 'react-native'
import React from 'react'
import { colors } from '../../config/colors.config'

import omenaiLogo from '../../assets/omenai-logo.png';

export default function Header() {

    return (
        <SafeAreaView>
            <View style={{alignItems: 'center'}}>
                <Image source={omenaiLogo} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary_black,
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },
    iconContainer: {
        height: 40,
        width: 40,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAFAFA'
    },
    image: {
        height: 40,
        width: 40,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: colors.white
    }
})