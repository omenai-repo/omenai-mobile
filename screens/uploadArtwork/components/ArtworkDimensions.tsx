import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from 'config/colors.config';
import Input from 'components/inputs/Input';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { uploadArtworkStore } from 'store/gallery/uploadArtworkStore';
import NoLabelInput from 'components/inputs/NoLabelInput';
import { validate } from 'lib/validations/upload_artwork_input_validator/validator';
import tw from 'twrnc';
import { useAppStore } from 'store/app/appStore';
import UnitDropdown from 'screens/artist/orders/UnitDropdown';
import { validateOrderMeasurement } from 'lib/validations/upload_artwork_input_validator/validateOrderMeasurement';
import { convertToCm, convertToKg } from 'utils/convertUnits';

type artworkDimensionsErrorsType = {
  height: string;
  depth: string;
  width: string;
  weight: string;
};

export default function ArtworkDimensions() {
  const { userType } = useAppStore();
  const { setActiveIndex, activeIndex, updateArtworkUploadData } = uploadArtworkStore();
  const [units, setUnits] = useState<{
    height: 'cm' | 'mm' | 'm' | 'in' | 'ft';
    width: 'cm' | 'mm' | 'm' | 'in' | 'ft';
    depth: 'cm' | 'mm' | 'm' | 'in' | 'ft';
    weight: 'kg' | 'g' | 'lb';
  }>({
    height: 'cm',
    width: 'cm',
    depth: 'cm',
    weight: 'kg',
  });
  const [dimentions, setDimentions] = useState({
    depth: '',
    width: '',
    height: '',
    weight: '',
  });
  const [formErrors, setFormErrors] = useState<artworkDimensionsErrorsType>({
    weight: '',
    depth: '',
    height: '',
    width: '',
  });

  const checkIsDisabled = () => {
    // Check if there are no error messages and all input fields are filled
    const isFormValid = Object.values({
      weight: formErrors.weight,
      height: formErrors.height,
      width: formErrors.width,
    }).every((error) => error === '');
    const areAllFieldsFilled = Object.values({
      weight: dimentions.weight,
      height: dimentions.height,
      width: dimentions.width,
    }).every((value) => value !== '');

    return !(isFormValid && areAllFieldsFilled);
  };

  const handleValidationChecks = (label: keyof artworkDimensionsErrorsType, value: string) => {
    if (value.trim() === '') {
      // If the input is empty, clear the error
      setFormErrors((prev) => ({ ...prev, [label]: '' }));
    } else {
      // Run validation and update error state
      const errors = validateOrderMeasurement(value);
      setFormErrors((prev) => ({ ...prev, [label]: errors.length === 0 ? '' : errors }));
    }
  };

  useEffect(() => {
    if (dimentions.height) {
      handleValidationChecks('height', dimentions.height);
    }
  }, [dimentions.height]);

  useEffect(() => {
    if (dimentions.width) {
      handleValidationChecks('width', dimentions.width);
    }
  }, [dimentions.width]);

  useEffect(() => {
    if (dimentions.depth) {
      handleValidationChecks('depth', dimentions.depth || '');
    }
  }, [dimentions.depth]);

  useEffect(() => {
    if (dimentions.weight) {
      handleValidationChecks('weight', dimentions.weight);
    }
  }, [dimentions.weight]);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={tw`flex-1`}
      >
        <ScrollView
          nestedScrollEnabled={true}
          style={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={tw`gap-[30px]`}>
            {(['height', 'width', 'depth'] as Array<keyof typeof dimentions>).map((field) => (
              <View key={field} style={tw`flex-row gap-3`}>
                <View style={tw`flex-5`}>
                  <Input
                    label={`${field.charAt(0).toUpperCase() + field.slice(1)} (${units[field]})`}
                    keyboardType="numeric"
                    onInputChange={(text) => {
                      setDimentions((prev) => ({ ...prev, [field]: text }));
                      handleValidationChecks(field, text);
                    }}
                    placeHolder={`Enter ${field}`}
                    value={dimentions[field]}
                    errorMessage={formErrors[field]}
                  />
                </View>
                <UnitDropdown
                  units={['cm', 'mm', 'm', 'in', 'ft']}
                  selectedUnit={units[field]}
                  onSelect={(val) => setUnits((prev) => ({ ...prev, [field]: val }))}
                />
              </View>
            ))}

            {/* Weight field separately */}
            <View style={tw`flex-row items-center gap-3`}>
              <View style={tw`flex-5`}>
                <Input
                  label={`Weight (${units.weight})`}
                  keyboardType="numeric"
                  onInputChange={(text) => {
                    setDimentions((prev) => ({ ...prev, weight: text }));
                    handleValidationChecks('weight', text);
                  }}
                  placeHolder="Enter weight"
                  value={dimentions.weight}
                  errorMessage={formErrors.weight}
                />
              </View>
              <UnitDropdown
                units={['kg', 'g', 'lb']}
                selectedUnit={units.weight}
                onSelect={(val: string) =>
                  setUnits((prev) => ({ ...prev, weight: val as 'kg' | 'g' | 'lb' }))
                }
              />
            </View>
          </View>
          <View style={tw`mt-[60px] mb-[150px]`}>
            <LongBlackButton
              value="Proceed"
              onClick={() => {
                const heightInCm = convertToCm(dimentions.height, units.height);
                const widthInCm = convertToCm(dimentions.width, units.width);
                const depthInCm = convertToCm(dimentions.depth, units.depth);
                const weightInKg = convertToKg(dimentions.weight, units.weight);

                updateArtworkUploadData('height', `${heightInCm}cm`);
                updateArtworkUploadData('width', `${widthInCm}cm`);
                updateArtworkUploadData('depth', `${depthInCm}cm`);
                updateArtworkUploadData('weight', `${weightInKg}kg`);

                setActiveIndex(activeIndex + 1);
              }}
              isLoading={false}
              isDisabled={checkIsDisabled()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
  },
  inputsContainer: {
    gap: 20,
    marginBottom: 50,
  },
  flexInputsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  label: {
    fontSize: 14,
    color: colors.inputLabel,
  },
});
