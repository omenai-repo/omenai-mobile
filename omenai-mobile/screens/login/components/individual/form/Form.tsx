import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useIndividualAuthLoginStore } from '../../../../../store/auth/login/IndividualAuthLoginStore'
import PasswordInput from '../../../../../components/inputs/PasswordInput'
import Input from '../../../../../components/inputs/Input'
import LongBlackButton from '../../../../../components/buttons/LongBlackButton'
import { loginAccount } from '../../../../../services/login/loginAccount'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { screenName } from '../../../../../constants/screenNames.constants'
import { utils_storeAsyncData } from 'utils/utils_asyncStorage'
import { useAppStore } from 'store/app/appStore'
import { useModalStore } from 'store/modal/modalStore'

export default function Form() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const { individualLoginData, setEmail, setPassword, clearInputs, isLoading, setIsLoading } = useIndividualAuthLoginStore();
    const { setUserSession, setIsLoggedIn } = useAppStore();
    const {updateModal} = useModalStore();

    const handleSubmit = async () => {
        setIsLoading(true)

        const results = await loginAccount(individualLoginData, 'individual')

        if(results?.isOk){
            const resultsBody = results?.body

            if(resultsBody.verified === false){

                setIsLoading(false)
                navigation.navigate(screenName.verifyEmail, {account: {id: resultsBody.id, type: 'individual'}})
                return
            }
            const data = {
                id: resultsBody.id,
                email: resultsBody.email,
                name: resultsBody.name,
                role: resultsBody.role,
                preferences: resultsBody.preferences,
                verified: resultsBody.verified
            }

            const isStored = await utils_storeAsyncData('userSession', JSON.stringify(data))

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
        <View style={styles.container}>
            <View style={{gap: 20}}>
                <Input
                    label='Email address' 
                    keyboardType='email-address' 
                    onInputChange={setEmail} 
                    placeHolder='Enter your email address'
                    value={individualLoginData.email}
                />
                <PasswordInput
                    label='Password' 
                    onInputChange={setPassword} 
                    placeHolder='Enter password'
                    value={individualLoginData.password}
                />
            </View>
            <View style={{gap: 40}}>
                <LongBlackButton
                    value={isLoading ? 'Loading...' : 'Log In'}
                    isDisabled={false}
                    onClick={handleSubmit}
                    isLoading={isLoading}
                />
                <TouchableOpacity onPress={() => navigation.navigate(screenName.forgotPassword, {type: 'individual'})}>
                    <Text style={styles.resetText}>Forgot password? Click here</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        gap: 40
    },
    resetText: {
        fontSize: 16,
        textAlign: 'center'
    }
})