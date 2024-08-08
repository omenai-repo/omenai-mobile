import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import WithModal from 'components/modal/WithModal'
import BackHeaderTitle from 'components/header/BackHeaderTitle'
import Header from './components/Header'
import Plan from './components/Plan'
import { getAllPlanData } from 'services/subscriptions/getAllPlanData'
import Loader from 'components/general/Loader'
import EmptyArtworks from 'components/general/EmptyArtworks'
import { useModalStore } from 'store/modal/modalStore'

export type billingTabs = "monthly" | "yearly"

export default function Billing() {
    const [selectedTab, setSelectedTab] = useState<billingTabs>("monthly");
    const [plans, setPlans] = useState<PlanProps[]>([]);
    const [loading, setLoading] = useState(false);

    const { updateModal } = useModalStore();

    useEffect(() => {
        async function handleFetchPlans(){
            setLoading(true)
            const results = await getAllPlanData();

            if(results?.isOk){
                setPlans(results.data)
            }else{
                //throw error
                updateModal({message: "Error fetching plans", modalType: 'error', showModal: true})
            }

            setLoading(false)
        }

        handleFetchPlans()    
    }, [])
    
    return (
        <WithModal>
            <BackHeaderTitle title='Billing' />
            <ScrollView style={styles.container}>
                <Header selectedTab={selectedTab} handleUpdate={setSelectedTab} />
                {loading && <Loader />}
                {(!loading && plans.length > 0) && (
                    <View style={styles.mainContainer}>
                        {plans.map((plan, index) => (
                            <Plan
                                key={index}
                                name={plan.name}
                                benefits={plan.benefits}
                                pricing={plan.pricing}
                                currency={plan.currency}
                                tab={selectedTab}
                                plan_id={plan.plan_id}
                            />
                        ))}
                    </View>
                )}
                {(!loading && plans.length === 0) && (
                    <EmptyArtworks
                        size={70}
                        writeUp='No plans at the moment, reload or check again later'
                    />
                )}
                
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
    },
    mainContainer: {
        marginTop: 20,
        gap: 20,
        paddingBottom: 50
    }
})