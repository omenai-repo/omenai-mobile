import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../../config/colors.config'
import { SafeAreaView } from 'react-native-safe-area-context';

import omenaiIndividualAvatar from '../../assets/images/omenai-individual-avatar.jpg'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

export default function Header() {
    return (
        <SafeAreaView style={{backgroundColor: colors.primary_black}}>
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 16, color: colors.white}}>Welcome Back,</Text>
                    <Text style={{fontSize: 20, fontWeight: 500, color: colors.white}}>John</Text>
                </View>
                <View style={styles.leftContainer}>
                    <TouchableOpacity>
                        <View style={styles.iconContainer}>
                            <Feather name='bell' size={20} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image style={styles.image} source={omenaiIndividualAvatar} alt='' />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary_black,
        paddingHorizontal: 20,
        paddingTop: 20,
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
        height: 50,
        width: 50,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAFAFA'
    },
    image: {
        height: 50,
        width: 50,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: colors.white
    }
})