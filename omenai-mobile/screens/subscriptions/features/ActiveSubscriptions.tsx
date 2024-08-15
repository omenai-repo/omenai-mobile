import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CardDetails from '../components/CardDetails'
import PlanDetails from '../components/PlanDetails'
import ManageSubscriptionsSection from '../components/ManageSubscriptionsSection'
import { useAppStore } from 'store/app/appStore'
import { retrieveSubscriptionData } from 'services/subscriptions/retrieveSubscriptionData'
import ActiveSubLoader from '../components/ActiveSubLoader'
import { useModalStore } from 'store/modal/modalStore'
import UpcomingBilling from '../components/UpcomingBilling'
import BillingInfo from '../components/BillingInfo'
import TransactionsListing from '../components/TransactionsListing'
import { useIsFocused } from '@react-navigation/native'

export default function ActiveSubscriptions() {
    const isFocused = useIsFocused();

    const [loading, setLoading] = useState<boolean>(false);

    const [ subscriptionData, setSubscriptionData ] = useState<any>()

    const { userSession } = useAppStore();
    const { updateModal } = useModalStore();

    useEffect(() => {
        async function handleFetchSubData(){
            setLoading(true);

            const res = await retrieveSubscriptionData(userSession.id);
            
            if(res?.isOk){
                setSubscriptionData(res.data)
            }else{
                //something went wrong
                updateModal({message: 'something went wrong', modalType: 'error', showModal: true})
            }

            setLoading(false)
        }

        if(isFocused){
            handleFetchSubData()
        }
    }, [isFocused]);

    if(loading)return <ActiveSubLoader />

    if(!loading && subscriptionData)
    return (
        <View style={{gap: 20, marginBottom: 100}}>
            <CardDetails
                cardData={subscriptionData.card}
            />
            <PlanDetails
                sub_status={subscriptionData.status}
                plan_details={subscriptionData.plan_details}
                end_date={subscriptionData.expiry_date}
                payment={subscriptionData.payment}
            />
            <UpcomingBilling
                plan_details={subscriptionData.plan_details}
                end_date={subscriptionData.expiry_date}
                payment={subscriptionData.payment}
            />
            <BillingInfo />
            <TransactionsListing />
        </View>
    )
}

const styles = StyleSheet.create({})