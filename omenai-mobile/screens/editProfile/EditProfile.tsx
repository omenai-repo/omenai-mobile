import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import WithModal from 'components/modal/WithModal'
import BackHeaderTitle from 'components/header/BackHeaderTitle'
import Input from 'components/inputs/Input'
import { useAppStore } from 'store/app/appStore'
import Preferences from './components/Preferences'
import LongBlackButton from 'components/buttons/LongBlackButton'

export default function EditProfile() {
    const { userSession } = useAppStore();

    return (
        <WithModal>
            <BackHeaderTitle title='Edit profile' />
            <ScrollView style={styles.container}>
                <View style={{gap: 20, marginBottom: 40}}>
                    <Input
                        label='Full name'
                        value='Ifeanyi'
                        disabled
                        onInputChange={()=>{}}
                    />
                    <Input
                        label='Email address'
                        value='ifeanyiahumareze@gmail.com'
                        disabled
                        onInputChange={()=>{}}
                    />
                    <Preferences
                        label='Preferences'
                        profilePreferences={userSession.preferences}
                    />
                </View>
                <LongBlackButton
                    value='Update profile'
                    onClick={() => {}}
                    isDisabled={true}
                />
            </ScrollView>
        </WithModal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
        marginTop: 10
    }
})