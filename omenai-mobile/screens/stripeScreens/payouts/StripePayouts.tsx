import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import WithModal from 'components/modal/WithModal'
import BackHeaderTitle from 'components/header/BackHeaderTitle'
import BalanceBox from './components/BalanceBox'
import { checkIsStripeOnboarded } from 'services/stripe/checkIsStripeOnboarded'
import { useRoute } from '@react-navigation/native'
import Loader from 'components/general/Loader'
import CompleteOnBoarding from './components/CompleteOnBoarding'

export default function StripePayouts() {
    const route = useRoute();
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);


    useEffect(() => {
        async function handleOnBoardingCheck(){
            setLoading(true)
            const { account_id } = route.params as {account_id: string}
            const res = await checkIsStripeOnboarded(account_id);
            if(res?.isOk){
                setIsSubmitted(res.details_submitted)
            }else{
                console.log('error')
            }

            console.log(res)
            setLoading(false)
        };

        handleOnBoardingCheck()
    }, []);

    if(loading)return(
        <Loader />
    )
    
    if(!loading)
    return (
        <WithModal>
            <BackHeaderTitle title={isSubmitted ? 'Stripe Payout': 'Complete stripe onboarding'} />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {isSubmitted ? <BalanceBox /> : <CompleteOnBoarding />}
            </ScrollView>
        </WithModal>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1,
        paddingTop: 15,
        marginTop: 15
    }
})