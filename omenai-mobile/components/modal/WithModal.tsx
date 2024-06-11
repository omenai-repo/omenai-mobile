import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react';
import CustomModal from './CustomModal';
import { useModalStore } from 'store/modal/modalStore';
import { colors } from 'config/colors.config';
import WebViewModal from './WebViewModal';

type WithModalProps = {
    children: React.ReactNode
}

export default function WithModal({children}: WithModalProps) {
    const { showModal, updateModal, modalMessage, modalType, webViewUrl } = useModalStore();

    useEffect(() => {
        if(showModal){
            closeModal()
        }
    }, [showModal])

    const closeModal = () => {
        //close modal after 4 seconds
        setTimeout(() => {
            updateModal({message: "", showModal: false, modalType: "success"})
        }, 3500)
    }

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            {webViewUrl === null && children}
            <WebViewModal url={webViewUrl} />
            <CustomModal 
                isVisible={showModal}
                message={modalMessage}
                modalType={modalType}
            />
        </View>
    )
}

const styles = StyleSheet.create({})