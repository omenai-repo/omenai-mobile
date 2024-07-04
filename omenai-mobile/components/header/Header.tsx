import { Image, StyleSheet, View, SafeAreaView } from 'react-native'
import React from 'react'
import { colors } from '../../config/colors.config'

import omenaiLogo from '../../assets/omenai-logo.png';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';

export default function Header({showNotification}: {showNotification?: boolean}) {
    const navigation = useNavigation<StackNavigationProp<any>>();

    return (
        <SafeAreaView>
            <View style={styles.mainContainer}>
                {/* <View style={{width: 50}} /> */}
                <View style={{flex: 1}}>
                    <Image style={{width: 130, height: 30}} resizeMode='contain' source={omenaiLogo} />
                </View>
                {showNotification &&
                    <TouchableOpacity onPress={() => navigation.navigate(screenName.notifications)} style={styles.iconContainer}>
                        <Feather name='bell' size={20} color={colors.grey} />
                    </TouchableOpacity>
                }
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
    mainContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        alignSelf: 'center',
        gap: 20
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
        backgroundColor: '#f5f5f5'
    },
    image: {
        height: 40,
        width: 40,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: colors.white
    }
})