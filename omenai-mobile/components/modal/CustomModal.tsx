import { StyleSheet, Text, View } from 'react-native'
import Modal from "react-native-modal";
import React, { ReactNode, useState } from 'react'
import { colors } from 'config/colors.config';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import LongBlackButton from 'components/buttons/LongBlackButton';
import LongWhiteButton from 'components/buttons/LongWhiteButton';
import { modalType } from 'store/modal/modalStore';
import { MaterialIcons } from '@expo/vector-icons';

type ModalProps = {
    message: string,
    isVisible: boolean,
    modalType: modalType
}

export default function CustomModal({message, isVisible, modalType}: ModalProps) {
    return (
        <Modal isVisible={isVisible} backdropOpacity={0.2} animationIn={'slideInDown'} animationOut={'slideOutUp'}>
            <View style={styles.mainContainer}>
                <View style={styles.container}>
                    <View style={{height: 40, width: 40, borderRadius: 10, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center'}}>
                        {modalType === 'error' && <MaterialIcons name='error-outline' color={'#ff0000'} size={20} /> }
                        {modalType === 'success' && <MaterialIcons name='check-circle-outline' color={'#008000'} size={20} /> }
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={{fontSize: 16, color: colors.primary_black}}>{message}</Text>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: colors.white,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },
    mainContainer: {
        flex: 1,
        paddingTop: 50
    }
})