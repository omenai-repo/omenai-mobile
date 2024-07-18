import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import Input from 'components/inputs/Input'
import CustomSelectPicker from 'components/inputs/CustomSelectPicker'
import { displayPrice, preferredShippingCarrier } from 'data/uploadArtworkForm.data'
import LongBlackButton from 'components/buttons/LongBlackButton'
import { uploadArtworkStore } from 'store/gallery/uploadArtworkStore';
import { validate } from 'lib/validations/upload_artwork_input_validator/validator'
import { currencies } from './mocks'
import { getCurrencyConversion } from 'services/exchange_rate/getCurrencyConversion'
import { formatPrice } from 'utils/priceFormatter'
import { getCurrencySymbol } from 'utils/getCurrencySymbol'
import { useModalStore } from 'store/modal/modalStore'

const transformedCurrencies = currencies.map(item => ({
    value: item.code,
    label: item.name
  }));

type artworkPricingErrorsType = {
    price: string
}

export default function Pricing() {
    const {setActiveIndex, activeIndex, artworkUploadData, updateArtworkUploadData} = uploadArtworkStore();
    const {updateModal} = useModalStore()

    const [formErrors, setFormErrors] = useState<artworkPricingErrorsType>({price: ''});
    const [loadingConversion, setLoadingConversion] = useState<boolean>(false)

    const currency_symbol = getCurrencySymbol(artworkUploadData.currency);
    const usd_symbol = getCurrencySymbol("USD");

    const checkIsDisabled = () => {
        // Check if there are no error messages and all input fields are filled
        const isFormValid = Object.values(formErrors).every((error) => error === "");
        const areAllFieldsFilled = Object.values({
            pricing: artworkUploadData.price,
            showPrice: artworkUploadData.shouldShowPrice,
            usd_price: artworkUploadData.usd_price
        }).every((value, index) => {
            if (value === "") return false;

            // check if the index of pricing is zero
            if (index === 0 && value === 0) return false;

            return true;
        });

        return !(isFormValid && areAllFieldsFilled);
    }

    const handleValidationChecks = (label: string, value: string) => {        
        const {success, errors} : {success: boolean, errors: string[] | []} = validate(label, value)
        if(!success){
            setFormErrors(prev => ({...prev, [label]: errors[0]}));
        }else{
            setFormErrors(prev => ({...prev, [label]: ''}));
        }
    };

    const handleCurrencyConvert = async (value: number) => {
        updateArtworkUploadData('price', value)
        if((Number.isNaN(value))){
            updateArtworkUploadData('price', 0)
            return
        }

        setLoadingConversion(true)
        const conversion_value = await getCurrencyConversion(
            artworkUploadData.currency.toUpperCase(),
            +value
        );

        if (!conversion_value?.isOk)
            updateModal({message: "Unable to retrieve exchange rate value at this time.", modalType: 'error', showModal: true});
        else {
            updateArtworkUploadData("usd_price", conversion_value.data);
        }

        setLoadingConversion(false)
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputsContainer}>
                <View style={{flexDirection: 'row', gap: 10, zIndex: 11}}>
                <View style={{flex: 1, zIndex: 11}}>
                    <CustomSelectPicker
                        label='Currency'
                        data={transformedCurrencies}
                        placeholder='Select'
                        value={artworkUploadData.currency}
                        handleSetValue={value => {
                            updateArtworkUploadData('currency', value)
                            updateArtworkUploadData('price', 0)
                        }}
                    />
                </View>
                    <View style={{flex: 1}}>
                        <Input
                            label='Price'
                            // onInputChange={value => updateArtworkUploadData('price', parseInt(value, 10))}
                            onInputChange={value => handleCurrencyConvert(parseInt(value, 10))}
                            placeHolder='Enter your price'
                            value={artworkUploadData.price === 0 ? '' : artworkUploadData.price}
                            handleBlur={() => handleValidationChecks('price', JSON.stringify(artworkUploadData.price))}
                            errorMessage={formErrors.price}
                            keyboardType="decimal-pad"
                            disabled={artworkUploadData.currency === ""}
                        />
                    </View>
                </View>
                <View>
                {artworkUploadData.currency !== "" &&
                artworkUploadData.price !== 0 &&
                artworkUploadData.usd_price !== 0 && (
                    <Text style={{fontSize: 14, fontWeight: 500, opacity: 0.8}}>
                    Exchange rate:{" "}
                    {`${formatPrice(
                        artworkUploadData.price,
                        currency_symbol
                    )} = ${loadingConversion ? 'converting...' : formatPrice(artworkUploadData.usd_price, usd_symbol)}`}
                    </Text>
                )}
                </View>
                <View style={{zIndex: 10}}>
                    <CustomSelectPicker
                        label='Display price'
                        data={displayPrice}
                        placeholder='Select'
                        value={artworkUploadData.shouldShowPrice}
                        handleSetValue={value => updateArtworkUploadData('shouldShowPrice', value)}
                    />
                </View>
                <Text style={{fontSize: 12, color: '#ff0000'}}>Please note: To ensure consistent pricing across the platform, all uploaded prices will be displayed in US Dollar equivalents.</Text>
            </View>
            <View style={{zIndex: 2}}>
                <LongBlackButton
                    value='Proceed'
                    // onClick={() => setActiveIndex(activeIndex + 1)}
                    onClick={() => console.log(artworkUploadData.price)}
                    isLoading={false}
                    isDisabled={checkIsDisabled()}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 100
    },
    inputsContainer: {
        gap: 20,
        marginBottom: 50,
        zIndex: 3
    },
    flexInputsContainer: {
        flexDirection: 'row',
        gap: 20
    },
    label: {
        fontSize: 14, 
        color: colors.inputLabel
    }
})