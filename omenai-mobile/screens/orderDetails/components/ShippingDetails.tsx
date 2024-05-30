import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from 'config/colors.config'
import CustomPicker from 'components/general/CustomPicker';
import Input from 'components/inputs/Input';
import CustomChecker from 'components/inputs/CustomChecker';
import CustomSelectPicker from 'components/inputs/CustomSelectPicker';
import { countriesListing } from 'constants/countries.constants';
import SummaryContainer from './SummaryContainer';
import { useOrderSummaryStore } from 'store/orders/OrderSummaryStore';

const deliveryOptions = [
    'Shipping',
    'Pickup'
]

type deliveryModeTypes = "Shipping" | "Pickup"

export default function ShippingDetails() {
    const [selectedDeliveryoption, setSelectedDeliveryOption] = useState(deliveryOptions[0]);
    const [saveDeliveryAddress, setSaveDeliveryAddress] = useState(false);

    const { deliveryMode, setDeliveryMode, fullname, setFullname, email, setEmail, deliveryAddress, setDeliveryAddress, country, setCountry, city, setCity, zipCode, setZipCode, state, setState } = useOrderSummaryStore();

    return (
        <View style={styles.container}>
            <Text style={styles.titleHeader}>Shipping Details</Text>
            <View style={styles.shippingDetailsContainer}>
                <Text style={{fontSize: 16, fontWeight: 500, color: colors.grey}}>Delivery Mode</Text>
                <View style={styles.pickerContainer}>
                    {deliveryOptions.map((option, index) => (
                        <CustomPicker name={option} onPress={() => setDeliveryMode(option as deliveryModeTypes)}  isSelected={option === deliveryMode} key={index} />
                    ))}
                </View>
                <View style={styles.formContainer}>
                    <Input
                        label='Full name'
                        value={fullname}
                        placeHolder='Enter your full name'
                        onInputChange={setFullname}
                    />
                    <Input
                        label='Email address'
                        value={email}
                        placeHolder='Enter your email address'
                        onInputChange={setEmail}
                        keyboardType="email-address"
                    />
                    <View>
                        <Input
                            label='Delivery address'
                            value={deliveryAddress}
                            placeHolder='Enter your delivery address'
                            onInputChange={setDeliveryAddress}
                        />
                        <CustomChecker isSelected={saveDeliveryAddress} label='Save my delivery address' onPress={() => setSaveDeliveryAddress(prev => !prev)} />
                    </View>
                    <CustomSelectPicker
                        placeholder='🇺🇸 Select your country'
                        data={countriesListing}
                        label='Country'
                        value={country}
                        handleSetValue={setCountry}
                    />
                    <Input
                        label='State'
                        value={state}
                        placeHolder='Enter your state'
                        onInputChange={setState}
                    />
                    <Input
                        label='City'
                        value={city}
                        placeHolder='Enter your city'
                        onInputChange={setCity}
                    />
                    <Input
                        label='Zip Code'
                        value={zipCode}
                        placeHolder='123456'
                        onInputChange={setZipCode}
                        keyboardType="number-pad"
                    />
                </View>
            </View>
            <SummaryContainer buttonTypes="Request price quote" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    titleHeader: {
        fontSize: 20,
        fontWeight: 500,
        color: colors.primary_black
    },
    shippingDetailsContainer: {
        borderWidth: 1,
        borderColor: colors.inputBorder,
        marginTop: 25,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 40,
        marginTop: 20
    },
    formContainer: {
        gap: 20,
        borderTopWidth: 1,
        borderTopColor: colors.grey50,
        marginTop: 30,
        paddingTop: 20
    }
})