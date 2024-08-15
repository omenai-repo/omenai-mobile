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
import MigrationUpgradeCheckoutItem from './components/MigrationCheckouts/MigrationUpgradeCheckoutItem'
import { retrieveSubscriptionData } from 'services/subscriptions/retrieveSubscriptionData'
import { useAppStore } from 'store/app/appStore'

export default function Checkout() {
    const route = useRoute();

    const [loading, setLoading] = useState<boolean>(false);
    const [reloadCount, setReloadCount] = useState(1);
    const [verificationScreen, setVerificationScreen] = useState<boolean>(false);

    const [plan, setPlan] = useState<SubscriptionPlanDataTypes | null>(null);
    const [subData, setSubData] = useState<SubscriptionModelSchemaTypes | null>(null);

    const { updateModal } = useModalStore();
    const { webViewUrl, setWebViewUrl } = subscriptionStepperStore();
    const { userSession } = useAppStore();
    
    

    const [activeIndex, setActiveIndex] = useState<number>(0);

    const {plan_id, tab, id, action} = route.params as {plan_id: string, tab: string, id?: string, action?: string}

    useEffect(() => {
        async function fetchSinglePlanDetails(){
            setLoading(true)
            const plan = await getSinglePlanData(plan_id);
            const subResults = await retrieveSubscriptionData(userSession.id)

            if(!plan?.isOk && !subResults?.isOk){
                //throw error
                updateModal({message: "Something went wrong", modalType: 'error', showModal: true})
                
            }else{
                setPlan(plan?.data)
                setSubData(subResults?.data)
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
                                {action ? (
                                    <>
                                        {action === "upgrade" ? 
                                            <MigrationUpgradeCheckoutItem
                                                plan={plan}
                                                interval={tab}
                                                sub_data={subData}
                                            />
                                            :
                                            <Text>Downgrade</Text>
                                        }
                                    </>
                                )
                                :
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