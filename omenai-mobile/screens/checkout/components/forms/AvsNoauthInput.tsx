import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Fontisto } from '@expo/vector-icons'
import { colors } from 'config/colors.config'
import Input from 'components/inputs/Input';
import CustomSelectPicker from 'components/inputs/CustomSelectPicker';
import { country_codes } from 'json/country_alpha_2_codes';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { country_and_states } from 'json/countryAndStateList';

const transformedCountries = country_codes.map(item => ({
    value: item.name,
    label: item.name
}));

export default function AvsNoauthInput() {

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

    const handleSubmit = () => {
        console.log(address_info)
    }

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