import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import BackScreenButton from 'components/buttons/BackScreenButton'
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { colors } from 'config/colors.config';

type BackHeaderTitleProps = {
    title: string,
    callBack?: () => void
}

export default function BackHeaderTitle({title, callBack}: BackHeaderTitleProps) {
    const navigation = useNavigation<StackNavigationProp<any>>();

    return (
        <SafeAreaView>
            <View style={styles.topContainer}>
                <BackScreenButton handleClick={() => {
                    navigation.goBack()
                    callBack && callBack()
                }} />
                <Text style={styles.topTitle}>{title}</Text>
                <View style={{width: 50}} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    topContainer: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    topTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
        color: colors.primary_black,
        textTransform: 'capitalize',
    }
})