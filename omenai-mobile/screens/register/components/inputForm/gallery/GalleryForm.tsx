import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LongBlackButton from '@/components/buttons/LongBlackButton'
import Input from '@/components/inputs/Input'
import { UseGalleryAuthStore } from '@/store/auth/login/galleryAuthStore'

export default function GalleryForm() {
    const { waitlistData, setEmail, setName, handleSubmit } = UseGalleryAuthStore()

    return (
        <View style={styles.container}>
            <View style={{gap: 20}}>
                <Input 
                    label='Gallery name' 
                    keyboardType='default' 
                    onInputChange={setName} 
                    placeHolder='Enter gallery name'
                    value={waitlistData.name}
                />
                <Input 
                    label='Email address' 
                    keyboardType='email-address' 
                    onInputChange={setEmail} 
                    placeHolder='Enter your email address'
                    value={waitlistData.email}
                />
            </View>
            <View>
                <LongBlackButton
                    value='Join waitlist'
                    isDisabled={false}
                    onClick={handleSubmit}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        gap: 40
    }
})