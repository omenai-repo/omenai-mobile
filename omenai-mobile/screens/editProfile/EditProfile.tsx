import { ScrollView, StyleSheet, Text, View, SafeAreaView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import BackScreenButton from 'components/buttons/BackScreenButton'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import Input from 'components/inputs/Input'
import Preferences from './components/Preferences'
import { getAsyncData } from 'utils/asyncStorage.utils';

type EditUserSessionType = {
    email: string,
    name: string,
    preferences: string[]
}

export default function EditProfile() {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const [userSession, setUserSession] = useState<EditUserSessionType>()

    useEffect(() => {
        handleFetchUserSession()
    }, []);

    const handleFetchUserSession = async () => {
        const results = await getAsyncData('userSession');
        if(results.value){
            const parsedResults = JSON.parse(results.value)
            setUserSession(parsedResults)
        }
    }

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View style={styles.topContainer}>
                    <BackScreenButton handleClick={() => navigation.goBack()} />
                    <Text style={styles.topTitle}>Edit profile</Text>
                    <View style={{width: 50}} />
                </View>
            </SafeAreaView>
            <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
                <View style={{alignItems: 'center'}}>
                    <Image style={styles.image} source={''} alt='' />
                </View>
                <View style={styles.formContainer}>
                    <Input
                        label='Full name'
                        value={userSession?.name || ''}
                        disabled
                    />
                    <Input
                        label='Email address'
                        value={userSession?.email || ''}
                        disabled
                    />
                    <Preferences preferences={userSession?.preferences || []} />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
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
        color: colors.primary_black
    },
    mainContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
        flex: 1
    },
    image: {
        height: 100,
        width: 100,
        borderRadius: 100,
        backgroundColor: '#f5f5f5',
        objectFit: 'cover'
    },
    formContainer: {
        marginTop: 20,
        gap: 20
    }
})