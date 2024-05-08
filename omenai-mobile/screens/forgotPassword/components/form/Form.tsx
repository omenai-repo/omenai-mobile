import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Input from '@/components/inputs/Input'
import LongBlackButton from '@/components/buttons/LongBlackButton'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useForgerPasswordStore } from '@/store/auth/forgotPassword/forgotPasswordStore'
import { colors } from '@/config/colors.config'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { screenName } from '@/constants/screenNames.constants'

export default function Form() {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const {email, setEmail} = useForgerPasswordStore()

    const handleSubmit = () => {

    }

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
                    />
                    {email.length > 0 && <Text style={styles.moreInfoText}>A verification link will be sent to example {email}</Text>}
                </View>
                <View style={{marginTop: 60}}>
                    <LongBlackButton
                        value='Send verification link'
                        isDisabled={email.length < 1}
                        onClick={handleSubmit}
                    />
                </View>
            </View>
            <View>
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
        paddingHorizontal: 20
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