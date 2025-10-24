import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import CloseButton from 'components/buttons/CloseButton';
import { galleryOrderModalStore } from 'store/modal/galleryModalStore';
import LongBlackButton from 'components/buttons/LongBlackButton';
import Input from 'components/inputs/Input';
import LargeInput from 'components/inputs/LargeInput';
import { validate } from 'lib/validations/provideShippingQuoteValidations/validator';
import { updateShippingQuote } from 'services/orders/updateShippingQuote';
import CompletedModal from './CompletedModal';

type shippingQouteFormErrorsType = {
  carrier: string;
  fees: string;
  taxes: string;
};

export default function ProvideShippingQuoteModal() {
  const { clear, acceptForm, updateAcceptForm, currentId } = galleryOrderModalStore();
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [formErrors, setFormErrors] = useState<shippingQouteFormErrorsType>({
    carrier: '',
    fees: '',
    taxes: '',
  });

  const checkIsDisabled = () => {
    // Check if there are no error messages and all input fields are filled
    const isFormValid = Object.values(formErrors).every((error) => error === '');
    const areAllFieldsFilled = Object.values({
      carrier: acceptForm.carrier,
      fees: acceptForm.fees,
      taxes: acceptForm.taxes,
    }).every((value) => value !== '');

    return !(isFormValid && areAllFieldsFilled);
  };

  const handleValidationChecks = (label: string, value: string) => {
    const { success, errors }: { success: boolean; errors: string[] | [] } = validate(label, value);
    if (!success) {
      setFormErrors((prev) => ({ ...prev, [label]: errors[0] }));
    } else {
      setFormErrors((prev) => ({ ...prev, [label]: '' }));
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    let data: ShippingQuoteTypes = {
      package_carrier: acceptForm.carrier,
      additional_information: acceptForm.additional_info,
      fees: acceptForm.fees,
      taxes: acceptForm.taxes,
    };

    const results = await updateShippingQuote({
      data: data,
      order_id: currentId,
    });

    if (results.isOk) {
      setCompleted(true);
      console.log(results);
    } else {
      console.log(results);
    }

    setIsLoading(false);
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text style={{ fontSize: 16, flex: 1 }}>Provide shipping quote</Text>
        <CloseButton handlePress={clear} />
      </View>
      {completed ? (
        <CompletedModal placeholder="Shipping quote provided" />
      ) : (
        <View style={styles.formContainer}>
          <Input
            value={acceptForm.carrier}
            label="Package carrier"
            onInputChange={(value) => updateAcceptForm('carrier', value)}
            placeHolder="e.g DHL, UPS, USPS e.t.c"
            handleBlur={() => handleValidationChecks('carrier', acceptForm.carrier)}
            errorMessage={formErrors.carrier}
          />
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <View style={{ flex: 1 }}>
              <Input
                value={acceptForm.fees}
                label="Shipping fees ($)"
                onInputChange={(value) => updateAcceptForm('fees', value)}
                placeHolder=""
                handleBlur={() => handleValidationChecks('fees', acceptForm.fees)}
                errorMessage={formErrors.fees}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                value={acceptForm.taxes}
                label="Taxes and other fees ($)"
                onInputChange={(value) => updateAcceptForm('taxes', value)}
                placeHolder=""
                handleBlur={() => handleValidationChecks('taxes', acceptForm.taxes)}
                errorMessage={formErrors.taxes}
              />
            </View>
          </View>
          <LargeInput
            label="Additional info (optional)"
            onInputChange={(value) => updateAcceptForm('additional_info', value)}
            placeHolder=""
            value={acceptForm.additional_info}
          />
        </View>
      )}
      <View style={{ gap: 20, marginTop: 30 }}>
        {completed ? (
          <LongBlackButton value="Dismiss" onClick={clear} />
        ) : (
          <LongBlackButton
            onClick={handleSubmit}
            value={isLoading ? 'Loading...' : 'Accept order'}
            isDisabled={checkIsDisabled()}
            isLoading={isLoading}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: 15,
    marginTop: 20,
  },
});
