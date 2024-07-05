import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import WithModal from 'components/modal/WithModal'
import AuthHeader from 'components/auth/AuthHeader'
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import Input from 'components/inputs/Input';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { useModalStore } from 'store/modal/modalStore';
import Divider from 'components/general/Divider';
import { colors } from 'config/colors.config';
import { resendVerifyCode } from 'services/verify/resendVerifyCode';
import { verifyEmail } from 'services/verify/verifyEmail';
import { screenName } from 'constants/screenNames.constants';

export default function VerifyEmail() {
    const route = useRoute()
    const navigation = useNavigation<StackNavigationProp<any>>();
    const {updateModal} = useModalStore();
    
    const { account } = route.params as verifyEmailRouteParamsType

    const [token, setToken] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleVerifyToken = async () => {
        setIsLoading(true)
        const results = await verifyEmail({ params: account.id, token: token }, account.type);

        if(results.isOk){
            updateModal({message: results.body.message, modalType: "error", showModal: true})
            setIsLoading(false)
            setTimeout(() => {
                navigation.navigate(screenName.login)
            }, 4000)
        }else{
            updateModal({message: results.body.message, modalType: "error", showModal: true})
            setIsLoading(false)
        }
    }

    const handleResentToken = async () => {
        updateModal({message: "A new token will soon be on it's way to you", modalType: 'success', showModal: true})

        const results = await resendVerifyCode(account.type, account.id);
        if(!results.isOk){
            updateModal({message: results.body.message, modalType: "error", showModal: true})
        }
    };



    return (
        <WithModal>
            <AuthHeader
                title='Verify email'
                subTitle={`Verify your account so you can start ${account.type === "gallery" ? 'selling' : 'purchasing'} artwork`}
                handleBackClick={() => navigation.goBack()}
            />
            <ScrollView style={{flex: 1, paddingHorizontal: 20, marginTop: 20}}>
                <Input
                    placeHolder='Emter verification token'
                    label='Token'
                    onInputChange={e => setToken(e)}
                    value={token}
                />
                <View style={{marginTop: 30, marginBottom: 50}}>
                    <LongBlackButton
                        value='Verify'
                        onClick={handleVerifyToken}
                        isLoading={isLoading}
                        isDisabled={token.length < 4}
                    />
                </View>
                <TouchableOpacity activeOpacity={1} onPress={handleResentToken}>
                    <View style={styles.resendCode}>
                        <Text style={styles.extraText}>Did not recieve a code?</Text><Text style={[styles.extraText, {textDecorationLine: 'underline'}]}>Resend code</Text>
                    </View>
                </TouchableOpacity>
                <View style={{paddingVertical: 25}}><Divider /></View>
                <View style={styles.resendCode}>
                    <Text style={styles.extraText}>Feel free to contact us should you have any issues on</Text><Text style={[styles.extraText, {textDecorationLine: 'underline'}]}>moses@omenai.net</Text>
                </View>
            </ScrollView>
        </WithModal>
    )
}

const styles = StyleSheet.create({
    resendCode: {
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 5,
    },
    extraText: {
        fontSize: 14,
        color: colors.primary_black
    }
})