import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useGalleryAuthRegisterStore } from '../../../../store/auth/register/GalleryAuthRegisterStore'
import AccountDetailsInput from './AccountDetailsInput';
import ExtraGalleryDetailsInput from './ExtraGalleryDetailsInput';
import TermsAndConditions from './TermsAndConditions';
import UploadLogo from './UploadLogo';

export default function GalleryRegisterForm() {
    const { pageIndex } = useGalleryAuthRegisterStore();

    const forms = [
        <AccountDetailsInput />,
        <ExtraGalleryDetailsInput />,
        <UploadLogo />,
        <TermsAndConditions />
    ]
    
    return forms[pageIndex]
}

const styles = StyleSheet.create({})