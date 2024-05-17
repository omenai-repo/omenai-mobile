import { Image, StyleSheet, Text, View, SafeAreaView, Modal } from 'react-native'
import React from 'react'
import { colors } from '../../config/colors.config'

import omenaiIndividualAvatar from '../../assets/images/omenai-individual-avatar.jpg'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { useAppStore } from 'store/app/appStore';
import { logout } from 'utils/logout.utils';
import CustomModal from 'components/modal/CustomModal';
import { useModalStore } from 'store/modal/modalStore';

export default function Header() {
    const { userSession } = useAppStore();

    const { setModalMessage, modalMessage } = useModalStore()

    return (
        <SafeAreaView style={{backgroundColor: colors.primary_black}}>
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 16, color: colors.white}}>Welcome Back,</Text>
                    <Text style={{fontSize: 20, fontWeight: 500, color: colors.white}}>{userSession?.name}</Text>
                </View>
                <View style={styles.leftContainer}>
                    <TouchableOpacity>
                        <View style={styles.iconContainer}>
                            <Feather name='bell' size={20} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalMessage('Confirm Logout')}>
                        <Image style={styles.image} source={omenaiIndividualAvatar} alt='' />
                    </TouchableOpacity>
                </View>
            </View>
            <CustomModal
                multiChoice='Yes, Logout'
                isVisible={modalMessage !== null}
                value={modalMessage}
                handleDismiss={e => {
                    setModalMessage(null)
                    if(e === true){
                        logout()
                    }
                }}
            />
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