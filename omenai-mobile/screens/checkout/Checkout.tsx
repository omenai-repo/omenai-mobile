import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
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

export default function Checkout() {
    const route = useRoute();
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const {plan_id, tab} = route.params as {plan_id: string, tab: string}

    

    const forms = [
        <CardInfo handleNext={() => setActiveIndex(3)} />,
        <OTPForm handleNext={() => setActiveIndex(prev => prev + 1)} />,
        <FinishTransaction />,
        <AvsNoauthInput />,
        <AuthPinInput />
    ]

    return (
        <WithModal>
            <BackHeaderTitle title='Checkout' />
            <ScrollView style={styles.mainContainer}>
                {/* <FormsHeaderNavigation index={activeIndex} setIndex={setActiveIndex} /> */}
                {forms[activeIndex]}
                <CheckoutSummary />
            </ScrollView>
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