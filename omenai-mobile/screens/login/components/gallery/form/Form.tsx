import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LongBlackButton from '../../../../../components/buttons/LongBlackButton'
import Input from '../../../../../components/inputs/Input'
import { UseGalleryAuthStore } from '../../../../../store/auth/login/galleryAuthStore'
import { useGalleryAuthLoginStore } from 'store/auth/login/GalleryAuthLoginStore'
import PasswordInput from 'components/inputs/PasswordInput'
import WithModal from 'components/modal/WithModal'
import { useAppStore } from 'store/app/appStore'
import { useModalStore } from 'store/modal/modalStore'
import { loginAccount } from 'services/login/loginAccount'
import { storeAsyncData } from 'utils/asyncStorage.utils'

export default function Form() {
    const { galleryLoginData, setEmail, setPassword, clearInputs, isLoading, setIsLoading } = useGalleryAuthLoginStore();
    const { setUserSession, setIsLoggedIn } = useAppStore();
    const {updateModal} = useModalStore();

    const handleSubmit = async () => {
        setIsLoading(true)

        const results = await loginAccount(galleryLoginData, 'gallery')

        if(results?.isOk){
            const resultsBody = results?.body
            const data = {
                id: resultsBody.id,
                email: resultsBody.email,
                name: resultsBody.name,
                role: resultsBody.role,
                gallery_verified: resultsBody.gallery_verified,
                description: resultsBody.description,
                location: resultsBody.location,
                verified: resultsBody.verified,
                admin: resultsBody.admin,
                logo: resultsBody.logo,
                subscription_active: resultsBody.subscription_active,
            }

            const isStored = await storeAsyncData('userSession', JSON.stringify(data))

            if(isStored){
                setUserSession(data)
                setIsLoggedIn(true)
                clearInputs();
            }
        }else{
            // Alert.alert(results?.body.message)
            updateModal({message:results?.body.message, showModal: true, modalType: "error"})
        }

        setIsLoading(false)
    }

    return (
        <WithModal>
            <View style={styles.container}>
                <View style={{gap: 20}}>
                    <Input 
                        label='Gallery Email address' 
                        keyboardType='email-address' 
                        onInputChange={setEmail} 
                        placeHolder='Enter your gallery email address'
                        value={galleryLoginData.email}
                    />
                    <PasswordInput
                        label='Password' 
                        onInputChange={setPassword} 
                        placeHolder='Enter password'
                        value={galleryLoginData.password}
                    />
                </View>
                <View>
                    <LongBlackButton
                        value={isLoading ? 'Loading ...' : 'Sign In Gallery'}
                        isDisabled={false}
                        isLoading={isLoading}
                        onClick={handleSubmit}
                    />
                </View>
            </View>
        </WithModal>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        gap: 40
    }
})