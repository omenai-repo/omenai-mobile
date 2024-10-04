import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Input from '../../../../components/inputs/Input'
import LongBlackButton from '../../../../components/buttons/LongBlackButton'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useForgetPasswordStore } from '../../../../store/auth/forgotPassword/forgotPasswordStore'
import { colors } from '../../../../config/colors.config'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation, useRoute } from '@react-navigation/native'
import { screenName } from '../../../../constants/screenNames.constants'
import { validate } from '../../../../lib/validations/validatorGroup'
import { sendPasswordResetLink } from 'services/password/sendPasswordResetLink'

export default function Form({
    setIsSuccess
}:{
    setIsSuccess: (e: boolean) => void
}) {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const {email, setEmail, isLoading, setIsLoading} = useForgetPasswordStore()
    const route = useRoute()

    const [formErrors, setFormErrors] = useState({email: ''});

    const handleSubmit = async () => {
        setIsLoading(true)

        const { type } = route.params as accountsRouteParamsType

        const results = await sendPasswordResetLink({email}, type)

        if(results?.isOk){
            Alert.alert(results?.body.message)
            //ADD further logic to navigate to the homepage and hide auth screens
            setIsSuccess(true)
        }else{
            Alert.alert(results?.body.message)
        }

        setIsLoading(false)
    }

    const checkIsDisabled = () => {
        // Check if there are no error messages and all input fields are filled
        const isFormValid = Object.values(formErrors).every((error) => error === "");
        const areAllFieldsFilled = Object.values({email}).every((value) => value !== "");

        return !(isFormValid && areAllFieldsFilled);
    }

    const handleValidationChecks = (label: string, value: string, confirm?: string) => {        
        const {success, errors} : {success: boolean, errors: string[] | []} = validate(value, label, confirm)
        if(!success){
            setFormErrors(prev => ({...prev, [label]: errors[0]}));
        }else{
            setFormErrors(prev => ({...prev, [label]: ''}));
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{flex: 1}}>
                <View style={{gap: 20}}>
                    <Input
                        label='Email address' 
                        keyboardType='email-address' 
                        onInputChange={setEmail} 
                        placeHolder='Enter your email address'
                        value={email}
                        handleBlur={() => handleValidationChecks('email', email)}
                        errorMessage={formErrors.email}
                    />
                    {email.length > 0 && <Text style={styles.moreInfoText}>A verification link will be sent to example {email}</Text>}
                </View>
                <View style={{marginTop: 60}}>
                    <LongBlackButton
                        value={isLoading ? 'Loading...' : 'Send verification link'}
                        isLoading={isLoading}
                        isDisabled={checkIsDisabled()}
                        onClick={handleSubmit}
                    />
                </View>
            </View>
            <View style={{marginTop: 100}}>
                <TouchableOpacity onPress={() => navigation.navigate(screenName.register)}>
                    <Text style={styles.createAccountLink}>Don't have an account? Create one</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: 40,
        paddingHorizontal: 20,
    },
    moreInfoText: {
        color: '#858585'
    },
    createAccountLink: {
        textAlign: 'center',
        color: colors.primary_black,
        fontSize: 16
    }
})