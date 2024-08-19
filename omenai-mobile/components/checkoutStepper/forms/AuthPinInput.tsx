import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { Fontisto } from '@expo/vector-icons'
import { colors } from 'config/colors.config'
import LongBlackButton from 'components/buttons/LongBlackButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { subscriptionStepperStore } from 'store/subscriptionStepper/subscriptionStepperStore';
import { useModalStore } from 'store/modal/modalStore';
import { generateAlphaDigit } from 'utils/utils_generateToken';
import { validateChargeAuthorization } from 'services/subscriptions/subscribeUser/validateChargeAuthorization';

type AuthPinInputProps = {
    handleNext: () => void;
    updateFinalAuthorization: Dispatch<SetStateAction<ValidateChargeTypes>>;
}

export default function AuthPinInput({handleNext, updateFinalAuthorization}:AuthPinInputProps) {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const [pin, setpin] = useState('');

    const [auth_data, set_auth_data] = useState<{
        mode: "pin" | "avs_noauth" | "otp";
        pin: string;
    }>({
        mode: "pin",
        pin: "",
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { flw_charge_payload, update_flw_charge_payload_data, set_flw_ref, setWebViewUrl, set_transaction_id } = subscriptionStepperStore();
    const { updateModal } = useModalStore();

    const handlePinChange = (value: string) => {
        const numbersOnly = value.replace(/\D/g, ""); // Remove non-numeric characters

        set_auth_data((prev) => ({ ...prev, pin: numbersOnly }));
    };

    const handleSubmit = async () => {
        if (auth_data.pin === "" || auth_data.pin.length < 4) {
            updateModal({message: 'Invalid input parameter', modalType: 'error', showModal: true})
            return;
        }

        setIsLoading(true);

        const ref = generateAlphaDigit(7);

        const data: FLWDirectChargeDataTypes & {
            authorization: PinAuthorizationData;
        } = {
            authorization: {
                mode: "pin",
                pin: auth_data.pin,
            },
            ...flw_charge_payload,
            tx_ref: ref,
        };

        const response = await validateChargeAuthorization(data);
        if (response?.isOk) {
        if (response.data.status === "error") {
            console.log('error' + response.data);
            updateModal({message: response.data.message, modalType: 'error', showModal: true})
        } else {
            update_flw_charge_payload_data(
                {} as FLWDirectChargeDataTypes & { name: string }
            );
            if (response.data.meta.authorization.mode === "redirect") {
                // redirect user
                set_transaction_id(response.data.data.id);
                setWebViewUrl(response.data.meta.authorization.redirect)
            } else {
                set_flw_ref(response.data.data.flw_ref);
                updateFinalAuthorization(response.data.meta.authorization.mode);
            }
            handleNext();
        }
        } else {
            updateModal({message: 'Something went wrong', modalType: 'error', showModal: true})
        }

        setIsLoading(false);

    }
      
    return (
        <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: 16, flex: 1}}>Pin verification</Text>
                <View style={styles.secureForm}>
                    <Fontisto name='locked' size={10} />
                    <Text style={{fontSize: 12, color: colors.primary_black}}>Secure form</Text>
                </View>
            </View>
            <View style={{marginTop: 30, marginBottom: 50}}>
                <Text style={styles.label}>Enter 4 digit pit</Text>
                <TextInput
                    onChangeText={handlePinChange} 
                    placeholder={'1234'} 
                    style={styles.inputContainer}
                    keyboardType={'number-pad'}
                    secureTextEntry={true}
                    autoCapitalize="none"
                    value={auth_data.pin} 
                />
            </View>
            <LongBlackButton
                value='Submit'
                onClick={handleSubmit}
                isLoading={isLoading}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        gap: 20,
        marginTop: 20,
        marginBottom: 30,
        zIndex: 100
    },
    secureForm: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    label: {
        fontSize: 14,
        color: colors.inputLabel
    },
    inputContainer: {
        height: 60,
        width: '100%',
        borderWidth: 1,
        borderColor: colors.inputBorder,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10
    },
})