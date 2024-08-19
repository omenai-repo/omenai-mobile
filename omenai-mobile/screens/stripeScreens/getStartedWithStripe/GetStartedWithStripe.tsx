import { SafeAreaView, ScrollView, StyleSheet, Text, View, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import Input from 'components/inputs/Input'
import { utils_getAsyncData } from 'utils/utils_asyncStorage';
import CustomSelectPicker from 'components/inputs/CustomSelectPicker';
import { country_codes } from 'json/country_alpha_2_codes';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { createConnectedAccount } from 'services/stripe/createConnectedAccount';
import WithModal from 'components/modal/WithModal';
import { useModalStore } from 'store/modal/modalStore';
import { createAccountLink } from 'services/stripe/createAccountLink';

const transformedCountryCodes = country_codes.map(item => ({
    value: item.key,
    label: item.name
  }));

export default function GetStartedWithStripe() {
    const [gallerySession, setGallerySession] = useState();
    const [countrySelect, setCountrySelect] = useState<string>("");

    const { updateModal } = useModalStore()

    const [accountCreatePending, setAccountCreatePending] = useState(false);
    const [accountLinkCreatePending, setAccountLinkCreatePending] = useState(false);
    const [connectedAccountId, setConnectedAccountId] = useState();

    useEffect(() => {
        //fetch gallery session
        async function handleFetchSession(){
            const session = await utils_getAsyncData('userSession')
            if(session.value){
                setGallerySession(JSON.parse(session.value))
                return
            }
            return
        }

        handleFetchSession();
    }, []);

    async function handleCreateConnectAccount(){
        setAccountCreatePending(true);

        const customer = {
            name: gallerySession.name,
            email: gallerySession.email,
            customer_id: gallerySession.id,
            country: countrySelect
        }

        const res = await createConnectedAccount(customer)
        if(res?.isOk){
            setConnectedAccountId(res.account_id);
            updateModal({message: 'Connected account created successfully, Please continue with Onboarding', modalType: 'success', showModal: true})
        }else{
            console.log(res?.message)
            updateModal({message: 'Something went wrong, please try again or contact support', modalType: 'error', showModal: true})
        }

        setAccountCreatePending(false);
    }

    async function handleAccountLink(){
        setAccountLinkCreatePending(true)

        const res = await createAccountLink(connectedAccountId!);

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
        <WithModal>
            <SafeAreaView>
                <View style={{paddingHorizontal: 20}}><Text style={{textAlign: 'center', fontSize: 20}}>Connect Stripe</Text></View>
            </SafeAreaView>
            <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
                <Text>Let&apos;s get you setup to receive payments!</Text>
                <View style={[styles.form, {zIndex: 10}]}>
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
                    <CustomSelectPicker
                        label='Country'
                        placeholder='Select country'
                        data={transformedCountryCodes}
                        handleSetValue={e => setCountrySelect(e)}
                        value={countrySelect}
                    />
                </View>
                {(connectedAccountId ||
                    accountCreatePending ||
                    accountLinkCreatePending) && (
                    <View style={{marginTop: 20, gap: 7}}>
                        {connectedAccountId && (
                            <>
                            <Text style={{fontSize: 14}}>
                                Your connected account ID is:{" "}
                                {connectedAccountId}{" "}
                            </Text>
                            <Text style={{fontSize: 12, opacity: 0.7}}>Hey, don&apos;t worry, we'll remember it for you!</Text>
                            </>
                        )}
                        {accountCreatePending && (
                            <Text style={{fontSize: 14}}>Creating a connected account for you...</Text>
                        )}
                        {accountLinkCreatePending && (
                            <Text style={{fontSize: 14}}>Creating a new Account Link for you...</Text>
                        )}
                    </View>
                )}
                <View style={{marginTop: 30, zIndex: 5}}>
                    {!connectedAccountId && <LongBlackButton
                        value='Create connected account'
                        onClick={handleCreateConnectAccount}
                        isLoading={accountCreatePending}
                        isDisabled={countrySelect.length < 1}
                    />}
                    {connectedAccountId && <LongBlackButton
                        value='Continue to stripe onboarding'
                        onClick={handleAccountLink}
                        isLoading={accountLinkCreatePending}
                    />}
                </View>
            </ScrollView>
        </WithModal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    mainContainer: {
        paddingHorizontal: 20,
        flex: 1,
        marginTop: 15,
        paddingTop: 10
    },
    form: {
        gap: 20,
        marginTop: 30
    }
})