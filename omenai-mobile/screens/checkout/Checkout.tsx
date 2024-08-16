import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import WithModal from 'components/modal/WithModal'
import BackHeaderTitle from 'components/header/BackHeaderTitle'
import FormsHeaderNavigation from './components/FormsHeaderNavigation'
import CardInfo from '../../components/checkoutStepper/forms/CardInfo'
import OTPForm from '../../components/checkoutStepper/forms/OTPForm'
import FinishTransaction from '../../components/checkoutStepper/forms/FinishTransaction'
import CheckoutSummary from './components/CheckoutSummary'
import AvsNoauthInput from '../../components/checkoutStepper/forms/AvsNoauthInput'
import AuthPinInput from '../../components/checkoutStepper/forms/AuthPinInput'
import { useNavigation, useRoute } from '@react-navigation/native'
import { getSinglePlanData } from 'services/subscriptions/getSinglePlanData'
import Loader from 'components/general/Loader'
import EmptyArtworks from 'components/general/EmptyArtworks'
import { useModalStore } from 'store/modal/modalStore'
import { subscriptionStepperStore } from 'store/subscriptionStepper/subscriptionStepperStore'
import WebView from 'react-native-webview'
import MigrationUpgradeCheckoutItem from './components/MigrationCheckouts/MigrationUpgradeCheckoutItem'
import { retrieveSubscriptionData } from 'services/subscriptions/retrieveSubscriptionData'
import { useAppStore } from 'store/app/appStore'
import { StackNavigationProp } from '@react-navigation/stack'
import { screenName } from 'constants/screenNames.constants'
import CheckoutStepper from 'components/checkoutStepper/CheckoutStepper'

export default function Checkout() {
    const route = useRoute();
    const navigation = useNavigation<StackNavigationProp<any>>();

    const [loading, setLoading] = useState<boolean>(false);
    const [reloadCount, setReloadCount] = useState(1);
    const [verificationScreen, setVerificationScreen] = useState<boolean>(false);

    const [plan, setPlan] = useState<SubscriptionPlanDataTypes | null>(null);
    const [subData, setSubData] = useState<SubscriptionModelSchemaTypes | null>(null);

    const { updateModal } = useModalStore();
    const { webViewUrl, setWebViewUrl } = subscriptionStepperStore();
    const { userSession } = useAppStore();
    
    

    const [activeIndex, setActiveIndex] = useState<number>(0);

    const {plan_id, tab, action} = route.params as {plan_id: string, tab: string, id?: string, action?: string};

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
            // setVerificationScreen(true)
            navigation.navigate(screenName.verifyTransaction)
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
                                    
                                    <MigrationUpgradeCheckoutItem
                                        plan={plan}
                                        interval={tab}
                                        sub_data={subData}
                                    />
                                )
                                :
                                <View>
                                    <CheckoutStepper
                                        plan={plan}
                                        activeIndex={activeIndex}
                                        setActiveIndex={setActiveIndex}
                                        setVerificationScreen={() => navigation.navigate(screenName.verifyTransaction)}
                                        updateCard={false}
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