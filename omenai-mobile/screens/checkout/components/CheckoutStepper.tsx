import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CardInfo from './forms/CardInfo';
import FinishTransaction from './forms/FinishTransaction';
import OTPForm from './forms/OTPForm';
import AvsNoauthInput from './forms/AvsNoauthInput';
import AuthPinInput from './forms/AuthPinInput';
import { subscriptionStepperStore } from 'store/subscriptionStepper/subscriptionStepperStore';
import { WebView } from 'react-native-webview';

type CheckoutStepperProps = {
    plan: PlanProps, 
    setVerificationScreen: () => void,
    activeIndex: number,
    setActiveIndex: (index: any) => void
}

export default function CheckoutStepper({plan, setVerificationScreen, activeIndex, setActiveIndex}: CheckoutStepperProps) {
    
    const [isLastStep, setIsLastStep] = useState(false);
    const [validateChargeAuthorization, setValidateChargeAuthorization] = useState<ValidateChargeTypes>("");

    const { set_transaction_id } = subscriptionStepperStore();

    const handleNext = () => {
        !isLastStep &&
        setActiveIndex((cur) =>
            cur + validateChargeAuthorization !== "redirect" ? 1 : 3
        );
    };

    const handlePinClick = () => {
        !isLastStep && setActiveIndex((cur) => cur + 1);
    };

    return (
        <View style={{flex: 1}}>
            {activeIndex === 0 && (
                <CardInfo
                    handleNext={handleNext}
                    updateAuthorization={setValidateChargeAuthorization}
                    plan={plan}
                />
            )}
            {activeIndex === 1 && (
                <View>
                    {validateChargeAuthorization === "pin" && (
                        <AuthPinInput
                            handleNext={handlePinClick}
                            updateFinalAuthorization={setValidateChargeAuthorization}
                        />
                    )}
                    {validateChargeAuthorization === "avs_noauth" && (
                        <AvsNoauthInput
                            updateFinalAuthorization={setValidateChargeAuthorization}
                            handleNext={handleNext}
                        />
                    )}
                    
                </View>
            )}
            {activeIndex === 2 && (
                <View>
                    {validateChargeAuthorization === "otp" && (
                        <OTPForm
                            handleNext={()=> {
                                setVerificationScreen();
                                setActiveIndex(4)
                            }}
                            set_id={set_transaction_id}
                        />
                    )}
                </View>
            )}
            
        </View>
    )
}

const styles = StyleSheet.create({})