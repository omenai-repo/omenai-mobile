import { Linking, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Input from 'components/inputs/Input'
import { getAsyncData } from 'utils/asyncStorage.utils';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { getAccountID } from 'services/stripe/getAccountID';
import { createAccountLink } from 'services/stripe/createAccountLink';
import { useModalStore } from 'store/modal/modalStore';

export default function CompleteOnBoarding() {
    const [gallerySession, setGallerySession] = useState();
    const [accountID, setAccountID] = useState('');
    const [accountLinkCreatePending, setAccountLinkCreatePending] = useState(false);

    const { updateModal } = useModalStore()

    useEffect(() => {
        //fetch gallery session
        async function handleFetchSession(){
            const session = await getAsyncData('userSession')
            if(session.value){
                setGallerySession(JSON.parse(session.value))
                const connect_id =  await getAccountID(JSON.parse(session.value).email);
                if(connect_id?.data){
                    setAccountID(connect_id.data.connected_account_id)
                }
            }
            return
        }

        handleFetchSession();
    }, []);

    async function handleCompleteOnboarding() {
        setAccountLinkCreatePending(true);
        const res = await createAccountLink(accountID!);

        if(res?.isOk){
            const supportedLink = await Linking.canOpenURL(res.url);
            if(supportedLink){
                setAccountLinkCreatePending(false);
                await Linking.openURL(res.url)
            }
        }else{
            updateModal({message: 'Something went wrong, please try again or contact support', modalType: 'error', showModal: true})
        }
    }

    return (
        <View style={styles.container}>
            <View style={{gap: 20}}>
                <Input
                    label='Full Name'
                    placeHolder=''
                    onInputChange={() => void('')}
                    value={gallerySession?.name || ''}
                    disabled
                />
                <Input
                    label='Email address'
                    placeHolder=''
                    onInputChange={() => void('')}
                    value={gallerySession?.email || ''}
                    disabled
                />
                {accountID && <Text>Your connected account ID is: {accountID}</Text>}
            </View>
            <View style={{marginTop: 30}}>
                <LongBlackButton
                    value='Complete onboarding'
                    onClick={handleCompleteOnboarding}
                    isDisabled={accountID.length < 1}
                    isLoading={accountLinkCreatePending}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    }
})