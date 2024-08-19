import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import { ScrollView } from 'react-native-gesture-handler'
import omenaiAvatar from '../../assets/images/omenai-avatar.png';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import { utils_getAsyncData } from 'utils/utils_asyncStorage';
import Divider from 'components/general/Divider';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import { logout } from 'utils/logout.utils';
import { PageButtonCard } from 'components/buttons/PageButtonCard';
import WithModal from 'components/modal/WithModal';

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
        const userSession = await utils_getAsyncData('userSession')

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

    return (
        <WithModal>
        
            <SafeAreaView>
                <View style={styles.profileContainer}>
                    <Image source={omenaiAvatar} style={styles.image} />
                    <View>
                        <Text style={{fontSize: 16, fontWeight: '500', color: colors.primary_black}}>{userData.name}</Text>
                        <Text style={{fontSize: 14, marginTop: 5, marginBottom: 20, color: '#858585'}}>{userData.email}</Text>
                        <FittedBlackButton value='Edit profile' isDisabled={false} onClick={() => navigation.navigate(screenName.editProfile)} />
                    </View>
                </View>
                </SafeAreaView>
                <ScrollView style={styles.container}>
                    <View style={styles.buttonsContainer}>
                        <PageButtonCard name='Saved artworks' subText='See all your saved artworks' handlePress={() => navigation.navigate(screenName.savedArtworks)} />
                        <Divider />
                        <PageButtonCard name='Order history' subText='A summary of all your orders' handlePress={() => navigation.navigate(screenName.orders)} />
                        <Divider />
                        <PageButtonCard name='Log Out' logout  handlePress={logout} />
                    </View>
                </ScrollView>
        </WithModal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        marginTop: 10,
        paddingTop: 10
    },
    profileContainer: {
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20
    },
    image: {
        height: 100,
        width: 100
    },
    buttonsContainer: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: colors.grey50,
        padding: 15,
        gap: 20
    }
})