import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import { PageButtonCard } from 'components/buttons/PageButtonCard'
import Divider from 'components/general/Divider'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { screenName } from 'constants/screenNames.constants'
import { Feather } from '@expo/vector-icons'
import { logout } from 'utils/logout.utils'
import WithGalleryModal from 'components/modal/WithGalleryModal'
import { galleryOrderModalStore } from 'store/modal/galleryModalStore';
import { useAppStore } from 'store/app/appStore'
import Logo from './components/Logo'

export default function GalleryProfile() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const { setIsVisible, setModalType } = galleryOrderModalStore();
    const { userSession } = useAppStore();

    return (
        <WithGalleryModal>
            <SafeAreaView>
                <View style={styles.headerContainer}>
                    <Text style={{fontSize: 20, textAlign: 'center'}}>Profile</Text>
                </View>
            </SafeAreaView>
            <ScrollView style={styles.mainContainer}>
                {userSession.logo !== '' && (
                    <Logo url={userSession.logo} />
                )}
                <View style={styles.buttonsContainer}>
                    {/* <Divider /> */}
                    <PageButtonCard name='Edit gallery profile' subText='View and edit your profile details' handlePress={() => navigation.navigate(screenName.gallery.editProfile)} />
                    {/* <Divider /> */}
                    <PageButtonCard name='Change password' subText='Change the password to your account' handlePress={() => navigation.navigate(screenName.gallery.changePassword)} />
                    {/* <Divider /> */}
                    <PageButtonCard name='Delete account' subText='Delete your omenai gallery account' handlePress={() => {
                        setModalType('deleteAccount')
                        setIsVisible(true)
                    }}>
                        <Feather name='trash' color={'#ff0000'} size={15} />
                    </PageButtonCard>
                    {/* <Divider /> */}
                    <PageButtonCard name='Logout' logout handlePress={logout} />
                </View>
            </ScrollView>
        </WithGalleryModal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    headerContainer: {
        paddingHorizontal: 20,
    },
    mainContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        flex: 1
    },
    buttonsContainer: {
        marginTop: 10,
        // borderWidth: 1,
        // borderColor: colors.grey50,
        // padding: 15,
        gap: 20
    }
})