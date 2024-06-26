import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import { ScrollView } from 'react-native-gesture-handler'
import omenaiAvatar from '../../assets/images/omenai-avatar.png';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import { Feather } from '@expo/vector-icons';
import { getAsyncData } from 'utils/asyncStorage.utils';
import Divider from 'components/general/Divider';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import { logout } from 'utils/logout.utils';

type PageButtonItemProps = {
    name: string,
    subText?: string,
    handlePress: () => void,
    logout?: boolean
}

type userDataType = {
    name: string,
    email: string
}

export default function Profile() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const [userData, setuserdata] = useState<userDataType>({name: '', email: ''})

    useEffect(() => {
        handleFetchUserSession()
    }, []);

    const handleFetchUserSession = async () => {
        const userSession = await getAsyncData('userSession')

        if(userSession.isOk === false) return

        if(userSession.value){
            const parsedUserSessions = JSON.parse(userSession.value)
            setuserdata({
                name: parsedUserSessions.name,
                email: parsedUserSessions.email
            })
        }

        return
    }

    const PageButtonItem = ({name, subText, handlePress, logout}: PageButtonItemProps) => {
        return(
            <TouchableOpacity activeOpacity={1} onPress={handlePress}>
                <View style={[styles.pageButtonItem]}>
                    <View style={{flex: 1}}>
                        <Text style={[{fontSize: 16, color: colors.primary_black}, logout && {color: '#ff0000'}]}>{name}</Text>
                        {subText && <Text style={{fontSize: 14, color: '#858585', marginTop: 2}}>{subText}</Text>}
                    </View>
                    <Feather name='chevron-right' color={logout ? '#ff0000' : colors.primary_black} size={15} />
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <ScrollView style={styles.container}>
            <SafeAreaView>
                <View style={styles.profileContainer}>
                    <Image source={omenaiAvatar} style={styles.image} />
                    <View>
                        <Text style={{fontSize: 16, fontWeight: '500', color: colors.primary_black}}>{userData.name}</Text>
                        <Text style={{fontSize: 14, marginTop: 5, marginBottom: 20, color: '#858585'}}>{userData.email}</Text>
                        <FittedBlackButton value='View profile' isDisabled={false} onClick={() => console.log('')} />
                    </View>
                </View>
                <View style={styles.buttonsContainer}>
                    <PageButtonItem name='Saved artworks' subText='See all your saved artworks' handlePress={() => navigation.navigate(screenName.savedArtworks)} />
                    <Divider />
                    <PageButtonItem name='Order history' subText='A summary of all your orders' handlePress={() => navigation.navigate(screenName.orders)} />
                    <Divider />
                    <PageButtonItem name='Log Out' logout  handlePress={logout} />
                </View>
            </SafeAreaView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    profileContainer: {
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
        paddingTop: 20
    },
    image: {
        height: 140,
        width: 140
    },
    buttonsContainer: {
        marginTop: 50,
        borderWidth: 1,
        borderColor: colors.grey50,
        padding: 15,
        gap: 20
    },
    pageButtonItem: {
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: colors.grey50,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    }
})