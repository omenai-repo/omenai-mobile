import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import WithModal from 'components/modal/WithModal'
import BackHeaderTitle from 'components/header/BackHeaderTitle'
import BalanceBox from './components/BalanceBox'
import { checkIsStripeOnboarded } from 'services/stripe/checkIsStripeOnboarded'
import { useRoute } from '@react-navigation/native'
import Loader from 'components/general/Loader'
import CompleteOnBoarding from './components/CompleteOnBoarding'
import { useModalStore } from 'store/modal/modalStore'

export default function StripePayouts() {
    const route = useRoute();
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [accountID, setAccountID] = useState('');

    const { updateModal } = useModalStore()


    useEffect(() => {
        async function handleOnBoardingCheck(){
            setLoading(true)
            const { account_id } = route.params as {account_id: string}
            setAccountID(account_id)
            const res = await checkIsStripeOnboarded(account_id);
            if(res?.isOk){
                setIsSubmitted(res.details_submitted)
            }else{
                updateModal({message: 'Something went wrong, please try again or contact support', modalType: 'error', showModal: true})
            }
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
                {!isSubmitted && <CompleteOnBoarding />}
                {(isSubmitted && accountID.length > 0) && <BalanceBox account_id={accountID} />}
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