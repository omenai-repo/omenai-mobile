import { Linking, StyleSheet, Text, View } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Fontisto } from '@expo/vector-icons'
import { colors } from 'config/colors.config'
import Input from 'components/inputs/Input';
import CustomSelectPicker from 'components/inputs/CustomSelectPicker';
import { country_codes } from 'json/country_alpha_2_codes';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { country_and_states } from 'json/countryAndStateList';
import { generateAlphaDigit } from 'utils/utils_generateToken';
import { subscriptionStepperStore } from 'store/subscriptionStepper/subscriptionStepperStore';
import { validateChargeAuthorization } from 'services/subscriptions/subscribeUser/validateChargeAuthorization';
import { useModalStore } from 'store/modal/modalStore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { screenName } from 'constants/screenNames.constants';

const transformedCountries = country_codes.map(item => ({
    value: item.name,
    label: item.name
}));

type AvsNoauthInputProps = {
    handleNext: () => void;
    updateFinalAuthorization: Dispatch<SetStateAction<ValidateChargeTypes>>;
}

export default function AvsNoauthInput({handleNext, updateFinalAuthorization}: AvsNoauthInputProps) {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const [address_info, set_address_info] = useState<{
        city: string;
        address: string;
        zipcode: string;
        state: string;
        country: string;
    }>({
        city: "",
        address: "",
        zipcode: "",
        state: "",
        country: "",
    });

    const [selectStates, setSelectStates] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { updateModal } = useModalStore();

    const { flw_charge_payload, update_flw_charge_payload_data, setWebViewUrl, set_transaction_id } = subscriptionStepperStore()

    useEffect(() => {
        const states = country_and_states.find(
          (country) => address_info.country === country.country
        );
        
        const transformedStates = states?.states.map(state => ({
            value: state,
            label: state
        }))

        if (transformedStates) setSelectStates(transformedStates);
        else setSelectStates([]);
    }, [address_info.country]);

    const handleInputChange = ({name, value}: {name: string, value: string}) => {
        set_address_info((prev) => {
          return {
            ...prev,
            [name]: value,
          };
        });
    };

    const handleSubmit = async () => {
        setLoading(true)

        const countryCode = country_codes.find(
            (country) => country.name === address_info.country
        );

        const updated_address_info = { ...address_info, country: countryCode?.key };
        const ref = generateAlphaDigit(7);

        const data: FLWDirectChargeDataTypes & {
            authorization: AvsAuthorizationData;
        } = {
            authorization: {
              mode: "avs_noauth",
              ...updated_address_info,
              state: "LA",
            },
            ...flw_charge_payload,
            tx_ref: ref,
        };

        const response = await validateChargeAuthorization(data);
        if (response?.isOk) {
            if (response.data.status === "error") {
                console.log(response.data);
                updateModal({message: response.data.message, showModal: true, modalType: 'error'})
            } else {
                    // console.log(response.data);
                    update_flw_charge_payload_data(
                    {} as FLWDirectChargeDataTypes & { name: string }
                );
                if (response.data.meta.authorization.mode === "redirect") {
                    // redirect user
                    set_transaction_id(response.data.data.id);
                    setWebViewUrl(response.data.meta.authorization.redirect)
                } else {
                    updateFinalAuthorization(response.data.meta.authorization.mode);
                }
                handleNext();
            }
        } else {
            updateModal({message: "Something went wrong", showModal: true, modalType: 'error'})
        }


        setLoading(false)
    };

    return (
        <View style={{zIndex: 25}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: 16, flex: 1}}>Address verification</Text>
                <View style={styles.secureForm}>
                    <Fontisto name='locked' size={10} />
                    <Text style={{fontSize: 12, color: colors.primary_black}}>Secure form</Text>
                </View>
            </View>
            <View style={styles.formContainer}>
                <CustomSelectPicker
                    label='Country'
                    placeholder='Select country'
                    value={address_info.country}
                    data={transformedCountries}
                    handleSetValue={e => handleInputChange({name: 'country', value: e})}
                    zIndex={90}
                />
                <CustomSelectPicker
                    label='State'
                    placeholder='Select state'
                    value={address_info.state}
                    data={selectStates}
                    handleSetValue={e => handleInputChange({name: 'state', value: e})}
                    zIndex={50}
                />
                <View style={{zIndex: 10}}>
                <Input
                    label='City'
                    onInputChange={e => handleInputChange({name: 'city', value: e})}
                    value={address_info.city}
                    placeHolder='e.g Lisbon'
                />
                </View>
                <View style={{zIndex: 10}}>
                <Input
                    label='Address'
                    onInputChange={e => handleInputChange({name: 'address', value: e})}
                    value={address_info.address}
                    placeHolder='Enter address'
                />
                </View>
                <View style={{zIndex: 10}}>
                <Input
                    label='Zip code'
                    onInputChange={e => handleInputChange({name: 'zipcode', value: e})}
                    value={address_info.zipcode}
                    placeHolder='e.g 12345'
                />
                </View>
            </View>
            <LongBlackButton
                onClick={handleSubmit}
                value='Submit'
                isLoading={loading}
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
    }
})