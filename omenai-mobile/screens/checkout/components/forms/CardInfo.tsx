import { StyleSheet, Text, View } from 'react-native'
import React, { Dispatch, SetStateAction, useState } from 'react';
import Input from 'components/inputs/Input';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { Entypo, Feather, Fontisto } from '@expo/vector-icons';
import { colors } from 'config/colors.config';
import { generateAlphaDigit } from 'utils/generateToken';
import { hasEmptyString } from 'utils/hasEmptyString';
import { useAppStore } from 'store/app/appStore';
import { initiateDirectCharge } from 'services/subscriptions/subscribeUser/initiateDirectCharge';
import { useModalStore } from 'store/modal/modalStore';
import { apiUrl } from 'constants/apiUrl.constants';
import { subscriptionStepperStore } from 'store/subscriptionStepper/subscriptionStepperStore';
import { useRoute } from '@react-navigation/native';

type cardInfoProps = {
    name: string,
    cardNumber: string,
    expiryMonth: string,
    year: string,
    cvv: string
}

type CardInfoProps = {
    handleNext: () => void,
    plan: PlanProps,
    updateAuthorization: Dispatch<SetStateAction<"redirect" | "avs_noauth" | "pin" | "">>
}

export default function CardInfo({handleNext, plan, updateAuthorization}:CardInfoProps) {
    const routes = useRoute();
    const { userSession } = useAppStore();
    const { updateModal } = useModalStore();

    const { tab }  = routes.params as {tab: string}

    const { update_flw_charge_payload_data } = subscriptionStepperStore()

    const [cardInfo, setCardInfo] = useState<cardInfoProps>({name: '', cardNumber: '', expiryMonth: '', year: '', cvv: ''});
    const [cardInputLoading, setCardInputLoading] = useState(false);

    const handleCardSubmit = async () => {
        setCardInputLoading(true)
        const ref = generateAlphaDigit(7);
        if (hasEmptyString(cardInfo)){
            //theow error
            updateModal({message: "Make sure all input fields are filled", modalType: 'error', showModal: true})
        }else{
            const data: FLWDirectChargeDataTypes & { name: string } = {
                name: cardInfo.name,
                cvv: cardInfo.cvv,
                card: cardInfo.cardNumber,
                month: cardInfo.expiryMonth,
                year: cardInfo.year.slice(2, 4),
                tx_ref: ref,
                amount: tab === "monthly" ? plan.pricing.monthly_price : plan.pricing.annual_price,
                customer: {
                  name: userSession.name,
                  email: userSession.email,
                },
                redirect: `${apiUrl}/dashboard/gallery/billing`,
            };

            const response = await initiateDirectCharge(data);
            if (response?.isOk) {
                if (response.data.status === "error") {
                    updateModal({message: response.data.message, showModal: true, modalType: 'error'})
                } else {
                console.log(response.data);
                if (response.data.meta.authorization.mode === "redirect") {
                    // console.log("User needs to be redirected");
                    handleRedirect(response.data.meta.authorization.redirect);
                    // redirect user
                } else {
                    updateAuthorization(response.data.meta.authorization.mode);
                }
                handleNext();
                }
                update_flw_charge_payload_data(data);
            } else {
                updateModal({message: 'Something went wrong', showModal: true, modalType: 'error'})
            }
        }

        setCardInputLoading(false)
    };

    const handleRedirect = (path: string) => {
        // redirect to 
    }

    return (
        <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: 16, flex: 1}}>Payment Method</Text>
                <View style={styles.secureForm}>
                    <Fontisto name='locked' size={10} />
                    <Text style={{fontSize: 12, color: colors.primary_black}}>Secure form</Text>
                </View>
            </View>
            <View style={styles.formContainer}>
                <Input
                    label='Card name'
                    onInputChange={e => setCardInfo(prev => ({...prev, name: e}))}
                    value={cardInfo.name}
                    placeHolder='Enter the name on your card'
                />
                <Input
                    label='Card number'
                    onInputChange={e => setCardInfo(prev => ({...prev, cardNumber: e}))}
                    value={cardInfo.cardNumber}
                    placeHolder='Enter the card number'
                    keyboardType="number-pad"
                />
                <View style={{flexDirection: 'row', gap: 20}}>
                    <View style={{flex: 1}}>
                        <Input
                            label='Expiry month'
                            onInputChange={e => setCardInfo(prev => ({...prev, expiryMonth: e}))}
                            value={cardInfo.expiryMonth}
                            placeHolder='MM'
                            keyboardType="number-pad"
                        />
                    </View>
                    <View style={{flex: 1}}>
                        <Input
                            label='Expiry year'
                            onInputChange={e => setCardInfo(prev => ({...prev, year: e}))}
                            value={cardInfo.year}
                            placeHolder='YYYY'
                            keyboardType="number-pad"
                        />
                    </View>
                </View>
                <Input
                    label='CVV'
                    onInputChange={e => setCardInfo(prev => ({...prev, cvv: e}))}
                    value={cardInfo.cvv}
                    placeHolder='Enter the CVV number'
                    keyboardType="number-pad"
                />
            </View>
            <LongBlackButton
                onClick={handleCardSubmit}
                value='Submit'
                isLoading={cardInputLoading}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        gap: 20,
        marginTop: 20,
        marginBottom: 30
    },
    secureForm: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    }
})