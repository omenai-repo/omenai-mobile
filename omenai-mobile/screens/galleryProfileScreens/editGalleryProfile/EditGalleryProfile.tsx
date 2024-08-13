import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import BackHeaderTitle from 'components/header/BackHeaderTitle'
import Input from 'components/inputs/Input'
import LargeInput from 'components/inputs/LargeInput'
import LongBlackButton from 'components/buttons/LongBlackButton'
import { getAsyncData } from 'utils/asyncStorage.utils'
import { galleryProfileUpdate } from 'store/gallery/galleryProfileUpdateStore'
import { updateProfile } from 'services/update/updateProfile'
import WithModal from 'components/modal/WithModal'
import { useModalStore } from 'store/modal/modalStore'
import { logout } from 'utils/logout.utils'
import UploadNewLogo from './components/GalleryLogo'

export default function EditGalleryProfile() {
    const [user, setUser] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const { updateModal } = useModalStore();


    const {updateData, setProfileUpdateData, clearData} = galleryProfileUpdate();

    useEffect(() => {
        async function handleFetchUserSession(){
            const user = await getAsyncData('userSession');
            if(user.value){
                setUser(JSON.parse(user.value));
            }
        }

        handleFetchUserSession()
    }, []);

    const handleSubmit = async () => {
        setIsLoading(true);

        const { isOk, body } = await updateProfile(
            "gallery",
            updateData,
            user.id
        )

        if(!isOk){
            //throw error modal
            updateModal({modalType: 'error', message: body.message, showModal: true})
        }else{
            //throw succcess modal prompting galleries to re-login
            updateModal({modalType: 'success', message: `${body.message}, please log back in`, showModal: true})
            setTimeout(() => {
                logout()
            }, 3500)
        }

        setIsLoading(false)
    }

    return (
        <WithModal>
            <BackHeaderTitle title='Gallery profile' callBack={clearData} />
            <ScrollView style={{flex: 1, paddingHorizontal: 20, paddingTop: 10, marginTop: 10}} showsVerticalScrollIndicator={false}>
                <View style={{gap: 20}}>
                    <UploadNewLogo
                        logo={user?.logo}
                    />
                    <Input 
                        label='Gallery name'
                        value={user?.name || ''}
                        disabled
                        onInputChange={() => void('')}
                    />
                    <Input 
                        label='Gallery email address'
                        disabled
                        value={user?.email || ''}
                        onInputChange={() => void('')}
                    />
                    <Input 
                        label='Location'
                        placeHolder=''
                        value={updateData?.location || ''}
                        defaultValue={user?.location}
                        onInputChange={value => setProfileUpdateData('location', value)}
                    />
                    <Input 
                        label='Admin'
                        placeHolder=''
                        value={updateData?.admin || ''}
                        defaultValue={user?.admin}
                        onInputChange={value => setProfileUpdateData('admin', value)}
                    />
                    <LargeInput
                        label='Gallery description'
                        placeHolder=''
                        value={updateData?.description || ''}
                        defaultValue={user?.description}
                        onInputChange={value => setProfileUpdateData('description', value)}
                    />
                    <View style={{marginTop: 30}}>
                        <LongBlackButton
                            onClick={handleSubmit}
                            value={isLoading ? 'Updating...' : 'Save changes'}
                            isLoading={isLoading}
                            isDisabled={
                                (
                                    !updateData.admin &&
                                    !updateData.location &&
                                    !updateData.description
                                )
                            }
                        />
                    </View>
                </View>
                <View style={{height: 100}} />
            </ScrollView>
        </WithModal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    }
})