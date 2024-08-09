import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CardInfo from './forms/CardInfo';
import FinishTransaction from './forms/FinishTransaction';
import OTPForm from './forms/OTPForm';
import AvsNoauthInput from './forms/AvsNoauthInput';
import AuthPinInput from './forms/AuthPinInput';

export default function CheckoutStepper({plan}:{plan: PlanProps}) {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [isLastStep, setIsLastStep] = useState(false);
    const [validateChargeAuthorization, setValidateChargeAuthorization] = useState<ValidateChargeTypes>("");
    const [finalChargeAuthorization, setFinalChargeAuthorization] = useState<FinalChargeAuthTypes>("");

    // const forms = [
    //     <CardInfo handleNext={() => setActiveIndex(3)} />,
    //     <OTPForm handleNext={() => setActiveIndex(prev => prev + 1)} />,
    //     <FinishTransaction />,
    //     <AvsNoauthInput />,
    //     <AuthPinInput />
    // ]

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
            {validateChargeAuthorization === "pin" && (
                <AuthPinInput
                    handleNext={handlePinClick}
                    updateFinalAuthorization={setFinalChargeAuthorization}
                />
            )}
            {validateChargeAuthorization === "avs_noauth" && (
                <AvsNoauthInput
                    updateFinalAuthorization={setFinalChargeAuthorization}
                    handleNext={handleNext}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({})