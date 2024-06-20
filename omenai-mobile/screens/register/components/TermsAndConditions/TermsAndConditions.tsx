import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import FittedBlackButton from '../../../../components/buttons/FittedBlackButton'
import BackFormButton from '../../../../components/buttons/BackFormButton'
import { colors } from '../../../../config/colors.config';
import { acceptTermsList } from '../../../../constants/accetTerms.constants';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useIndividualAuthRegisterStore } from '../../../../store/auth/register/IndividualAuthRegisterStore';
import { registerAccount } from '../../../../services/register/registerAccount';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import TermsAndConditionItem from '../../../../components/general/TermsAndConditionItem';

import { screenName } from '../../../../constants/screenNames.constants';
import { useModalStore } from 'store/modal/modalStore';


export default function TermsAndConditions() {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const {preferences, individualRegisterData, pageIndex, setPageIndex, selectedTerms, setSelectedTerms, isLoading, setIsLoading, clearState} = useIndividualAuthRegisterStore();
    const { updateModal } = useModalStore();

    const handleSubmit = async () => {
        setIsLoading(true)

        const data = {
            ...individualRegisterData,
            preferences
        }

        const results = await registerAccount(data, 'individual');
        
        if(results?.isOk){
            // Alert.alert(results?.body.message)
            clearState();
            //ADD further logic to navigate to the homepage and hide auth screens
            navigation.navigate(screenName.login)
        }else{
            updateModal({message:results?.body.message, modalType: "error", showModal: true})
        }

        setIsLoading(false)
    }

    const handleAcceptTerms = (index: number) => {
        if (selectedTerms.includes(index)) {
            setSelectedTerms(selectedTerms.filter((selectedTab) => selectedTab !== index));
        } else {
            setSelectedTerms([...selectedTerms, index]);
        }
    }


    return (
        <View style={{marginTop: 20}}>
            <Text style={styles.title}>Accept terms and conditions</Text>
            <View style={styles.termsContainer}>
                {acceptTermsList.map((i, idx) => (
                    <TermsAndConditionItem
                        writeUp={i}
                        key={idx}
                        isSelected={selectedTerms.includes(idx)}
                        handleSelect={() => handleAcceptTerms(idx)}
                    />
                ))}
            </View>
            <View style={styles.buttonsContainer}>
                <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
                <View style={{flex: 1}} />
                <FittedBlackButton isLoading={isLoading} value={isLoading ? 'Loading...' : 'Create my acount'} isDisabled={!selectedTerms.includes(0)} onClick={handleSubmit}  />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontWeight: '500',
        fontSize: 20
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginTop: 60
    },
    termsContainer: {
        marginTop: 20,
        backgroundColor: '#FAFAFA',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        paddingHorizontal: 15,
        paddingVertical: 20,
        gap: 30
    }
})