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

type DimensionUnit = 'cm' | 'mm' | 'm' | 'in' | 'ft';
type WeightUnit = 'kg' | 'g' | 'lb';

export default function ArtworkDimensions() {
  const { setActiveIndex, activeIndex, updateArtworkUploadData } = uploadArtworkStore();
  const [dimensionUnit, setDimensionUnit] = useState<DimensionUnit>('cm');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [dimentions, setDimentions] = useState({
    depth: '',
    width: '',
    height: '',
    weight: '',
  });

  const [formErrors, setFormErrors] = useState<artworkDimensionsErrorsType>({
    height: '',
    depth: '',
    width: '',
    weight: '',
  });

  const checkIsDisabled = () => {
    // Check if there are no error messages and all input fields are filled
    const isFormValid = Object.values({
      weight: formErrors.weight,
      height: formErrors.height,
      width: formErrors.width,
      depth: formErrors.depth,
    }).every((error) => error === '');
    const areAllFieldsFilled = Object.values({
      weight: dimentions.weight,
      height: dimentions.height,
      width: dimentions.width,
      depth: dimentions.depth,
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
          <View style={tw`gap-[10px]`}>
            {/* Unit selection dropdowns at the top */}
            <View style={tw`flex-row gap-4 mb-4`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-[14px] text-[#858585] mb-2`}>Dimension Unit</Text>
                <UnitDropdown
                  units={['cm', 'mm', 'm', 'in', 'ft']}
                  selectedUnit={dimensionUnit}
                  onSelect={(val) => setDimensionUnit(val)}
                />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-[14px] text-[#858585] mb-2`}>Weight Unit</Text>
                <UnitDropdown
                  units={['kg', 'g', 'lb']}
                  selectedUnit={weightUnit}
                  onSelect={(val) => setWeightUnit(val)}
                />
              </View>
            </View>

            {(['height', 'width', 'depth'] as Array<keyof typeof dimentions>).map((field) => (
              <View key={field}>
                <Input
                  label={`${field.charAt(0).toUpperCase() + field.slice(1)} (${dimensionUnit})`}
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
            ))}

            {/* Weight field */}
            <View>
              <Input
                label={`Weight (${weightUnit})`}
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
          </View>
          <View style={tw`mt-[60px] mb-[150px]`}>
            <LongBlackButton
              value="Proceed"
              onClick={() => {
                const heightInCm = convertToCm(dimentions.height, dimensionUnit);
                const widthInCm = convertToCm(dimentions.width, dimensionUnit);
                const depthInCm = convertToCm(dimentions.depth, dimensionUnit);
                const weightInKg = convertToKg(dimentions.weight, weightUnit);

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
