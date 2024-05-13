import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useGalleryAuthRegisterStore } from '../../../../store/auth/register/GalleryAuthRegisterStore'
import AccountDetailsInput from './AccountDetailsInput';
import ExtraGalleryDetailsInput from './ExtraGalleryDetailsInput';
import TermsAndConditions from './TermsAndConditions';

export default function GalleryRegisterForm() {
    const { pageIndex } = useGalleryAuthRegisterStore();

    if(pageIndex === 0) return <AccountDetailsInput />
    
    if(pageIndex === 1) return <ExtraGalleryDetailsInput />

    if(pageIndex === 2) return <TermsAndConditions />

    return
}

const styles = StyleSheet.create({})