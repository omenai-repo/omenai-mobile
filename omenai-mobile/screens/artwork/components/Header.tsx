import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react';
import BackScreenButton from 'components/buttons/BackScreenButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { colors } from 'config/colors.config';
import { Feather } from '@expo/vector-icons';

type ArtworkHeaderProps = {
    isGallery: boolean
}

export default function Header({isGallery}: ArtworkHeaderProps) {
    const navigation = useNavigation<StackNavigationProp<any>>();

    return (
        <SafeAreaView>
            <View style={{paddingHorizontal: 20, flexDirection: 'row'}}>
                <BackScreenButton handleClick={() => navigation.goBack()}/>
                <View style={{flex: 1}} />
                {/* <TouchableOpacity activeOpacity={1} onPress={() => {}}>
                    <View style={styles.container}>
                        <Feather name='edit-2' color={colors.primary_black} size={16} />
                    </View>
                </TouchableOpacity> */}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: colors.inputBorder
    }
})