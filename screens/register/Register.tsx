import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../../config/colors.config'
import AuthHeader from '../../components/auth/AuthHeader'
import FormController from './components/FormController';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { screenName } from '../../constants/screenNames.constants';
import CustomModal from 'components/modal/CustomModal';
import { useModalStore } from 'store/modal/modalStore';
import WithModal from 'components/modal/WithModal';
import { useIndividualAuthRegisterStore } from 'store/auth/register/IndividualAuthRegisterStore';
import { useGalleryAuthRegisterStore } from 'store/auth/register/GalleryAuthRegisterStore';

export default function Register() {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const { clearState: clearIndividualState } = useIndividualAuthRegisterStore();
    const { clearState: clearGalleryState } = useGalleryAuthRegisterStore()

    return (
        <WithModal>
            <AuthHeader
                title='Create an account'
                subTitle='Fill in required details and create an account'
                handleBackClick={() => {
                    navigation.navigate(screenName.welcome);

                    //clears registration form data
                    clearGalleryState()
                    clearIndividualState()
                }}
            />
            <FormController />
        </WithModal>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flex: 1
    }
})