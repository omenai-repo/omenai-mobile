import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import successImage from '../../../../assets/icons/success_check.png';
import errorImage from '../../../../assets/icons/error.png';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { subscriptionStepperStore } from 'store/subscriptionStepper/subscriptionStepperStore';
import { verifyFlwTransaction } from 'services/subscriptions/verifyFlwTransaction';
import Loader from 'components/general/Loader';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';

export default function FinishTransaction() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const { transaction_id } = subscriptionStepperStore();
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<null | boolean>(null)
    const [verified, setVerified] = useState()

    useEffect(() => {
        console.log(transaction_id)
        async function handleTransVerification(){
            setLoading(true)
            const response = await verifyFlwTransaction({ transaction_id });

            if(response?.isOk){
                setVerified(response)
                setSuccess(true)
            }else{
                setSuccess(false)
            }
            setLoading(false)
        };

        handleTransVerification()
    }, [])

    return (
        <View>
            {loading && (
                <View>
                    <Loader />
                    <Text>Verification in progress...please wait</Text>
                </View>
            )}
            {(!loading && verified) && (
                <View>
                    <Text style={{fontSize: 16, textAlign: 'center'}}>{verified.message}</Text>
                    {success !== null && (
                        <Image style={{height: 100, marginHorizontal: 'auto', marginTop: 10, marginBottom: 30}} resizeMode='contain' source={success ? successImage : errorImage} />
                    )} 
                    <LongBlackButton
                        value='Return home'
                        onClick={() => navigation.navigate(screenName.gallery.overview)}
                    />
                </View>
            )}
            
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        
    }
})