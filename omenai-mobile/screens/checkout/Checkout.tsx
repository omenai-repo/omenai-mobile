import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import WithModal from 'components/modal/WithModal'
import BackHeaderTitle from 'components/header/BackHeaderTitle'
import FormsHeaderNavigation from './components/FormsHeaderNavigation'
import CardInfo from './components/forms/CardInfo'
import OTPForm from './components/forms/OTPForm'
import FinishTransaction from './components/forms/FinishTransaction'
import CheckoutSummary from './components/CheckoutSummary'
import AvsNoauthInput from './components/forms/AvsNoauthInput'
import AuthPinInput from './components/forms/AuthPinInput'
import { useRoute } from '@react-navigation/native'
import { getSinglePlanData } from 'services/subscriptions/getSinglePlanData'
import Loader from 'components/general/Loader'
import CheckoutStepper from './components/CheckoutStepper'
import EmptyArtworks from 'components/general/EmptyArtworks'
import { useModalStore } from 'store/modal/modalStore'
import { subscriptionStepperStore } from 'store/subscriptionStepper/subscriptionStepperStore'
import WebView from 'react-native-webview'

export default function Checkout() {
    const route = useRoute();

    const [loading, setLoading] = useState<boolean>(false);
    const [plan, setPlan] = useState<PlanProps | null>(null);
    const [reloadCount, setReloadCount] = useState(1);

    const { updateModal } = useModalStore();
    const { webViewUrl, setWebViewUrl } = subscriptionStepperStore();
    const [verificationScreen, setVerificationScreen] = useState<boolean>(false);

    const [activeIndex, setActiveIndex] = useState<number>(0);

    const {plan_id, tab} = route.params as {plan_id: string, tab: string}

    useEffect(() => {
        async function fetchSinglePlanDetails(){
            setLoading(true)
            const plan = await getSinglePlanData(plan_id);
            if(plan?.isOk){
                setPlan(plan.data)
            }else{
                //throw error
                updateModal({message: "Error fetching plan details", modalType: 'error', showModal: true})
            }

            setLoading(false)
        }

        fetchSinglePlanDetails()
    }, [reloadCount]);

    const handleFlutterwaveRedirect = (event: any) => {
        if(event.canGoBack && event.navigationType === 'formsubmit'){
            setWebViewUrl(null)
            setVerificationScreen(true)
            setActiveIndex(4)
        }
    }

    

    return (
        <WithModal>
            {webViewUrl === null && (
                <View style={{flex: 1}}>
                    <BackHeaderTitle title='Checkout' />
                    {loading && <Loader />}
                    <ScrollView style={styles.mainContainer}>
                        {/* <FormsHeaderNavigation index={activeIndex} setIndex={setActiveIndex} /> */}
                        {(!loading && plan !== null) &&
                            <View>
                                <CheckoutStepper
                                    plan={plan}
                                    verificationScreen={verificationScreen}
                                    setVerificationScreen={setVerificationScreen}
                                    activeIndex={activeIndex}
                                    setActiveIndex={setActiveIndex}
                                />
                                <CheckoutSummary 
                                    name={plan.name}
                                    pricing={plan.pricing}
                                    interval={tab}
                                />
                            </View>
                        }
                        {(!loading && plan === null) && (
                            <EmptyArtworks
                                size={70}
                                writeUp='An unexpected error occured, reload page'
                            />
                        )}
                    </ScrollView>
                </View>
            )}
            {webViewUrl && (
                <WebView
                    source={{ uri: webViewUrl }} 
                    style={{ flex: 1 }} 
                    onNavigationStateChange={handleFlutterwaveRedirect}
                />
            )}
        </WithModal>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        paddingHorizontal: 20,
        flex: 1,
        paddingTop: 10,
        marginTop: 20
    }
})