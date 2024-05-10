import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import { colors } from '../../config/colors.config';

type AuthHeaderProps = {
    title: string,
    subTitle: string,
    handleBackClick: () => void
}

export default function AuthHeader({title, subTitle, handleBackClick}: AuthHeaderProps) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={{paddingHorizontal: 20, paddingBottom: 20, paddingTop: 10}}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackClick}>
                    <AntDesign name='arrowleft' color={colors.white} size={20} />
                </TouchableOpacity>
                <Text style={styles.headerText}>{title}</Text>
                <Text style={styles.subText}>{subTitle}</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.authHeaderBg,
    },
    backButton: {
        height: 40,
        width: 40,
        borderRadius: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#515151'
    },
    headerText: {
        fontSize: 20,
        color: colors.white,
        fontWeight: '500',
        marginTop: 20
    },
    subText: {
        fontSize: 14,
        marginTop: 10,
        color: colors.white
    }
})