import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
  Text
} from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { updateShippingQuote } from 'services/orders/updateShippingQuote';
import { useModalStore } from 'store/modal/modalStore';
import { useNavigation, useRoute } from '@react-navigation/native';
import WithModal from 'components/modal/WithModal';
import { validateOrderMeasurement } from 'lib/validations/upload_artwork_input_validator/validateOrderMeasurement';
import { useAppStore } from 'store/app/appStore';
import { convertDimensionsToStandard } from 'utils/convertUnits';
import { format } from 'date-fns';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ToggleButton from 'components/forms/ToggleButton';
import DimensionInput from 'components/forms/DimensionInput';
import UnitDropdownField from 'components/forms/UnitDropdownField';

type ArtworkDimensionsErrorsType = {
  height: string;
  length: string;
  width: string;
  weight: string;
};

type DimensionUnit = 'cm' | 'm' | 'in' | 'ft';
type WeightUnit = 'kg' | 'g' | 'lb';

const DimensionsDetails = () => {
  const { userType } = useAppStore();
  const { orderId } = useRoute<any>().params;
  const navigation = useNavigation();
  const [dimensionUnit, setDimensionUnit] = useState<DimensionUnit>('cm');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [dimentions, setDimentions] = useState({
    length: '',
    width: '',
    height: '',
    weight: '',
  });

  const [formErrors, setFormErrors] = useState<ArtworkDimensionsErrorsType>({
    height: '',
    length: '',
    width: '',
    weight: '',
  });

  const dimensionUnits = [
    { label: 'centimeter (cm)', value: 'cm' },
    { label: 'meter (m)', value: 'm' },
    { label: 'inch (in)', value: 'in' },
    { label: 'feet (ft)', value: 'ft' },
  ];

  const weightUnits = [
    { label: 'kilogram (kg)', value: 'kg' },
    { label: 'gram (g)', value: 'g' },
    { label: 'pound (lb)', value: 'lb' },
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [isOnExhibition, setIsOnExhibition] = useState(false);
  const [expoEndDate, setExpoEndDate] = useState<Date | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const { updateModal } = useModalStore();

  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const handleConfirm = (date: Date) => {
    setExpoEndDate(date);
    hideDatePicker();
  };

  const checkIsDisabled = () => {
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

    return !(isFormValid && areAllFieldsFilled && isChecked);
  };

  const handleValidationChecks = (label: keyof ArtworkDimensionsErrorsType, value: string) => {
    if (value.trim() === '') {
      setFormErrors((prev) => ({ ...prev, [label]: '' }));
    } else {
      const errors = validateOrderMeasurement(value);
      setFormErrors((prev) => ({ ...prev, [label]: errors.length === 0 ? '' : errors }));
    }
  };

  const handleSubmit = async () => {
    const units = {
      height: dimensionUnit,
      width: dimensionUnit,
      length: dimensionUnit,
      weight: weightUnit,
    };
    const converted = convertDimensionsToStandard(dimentions, units);
    try {
      setIsLoading(true);
      const payload = {
        order_id: orderId,
        dimensions: converted,
        exhibition_status:
          userType === 'gallery'
            ? {
                is_on_exhibition: isOnExhibition,
                exhibition_end_date: expoEndDate || '',
              }
            : null,
        hold_status: null,
      };
      const response = await updateShippingQuote(payload);
      if (response.isOk) {
        updateModal({
          message: 'Order accepted successfully',
          modalType: 'success',
          showModal: true,
        });
        setTimeout(() => {
          setDimentions({
            length: '',
            width: '',
            height: '',
            weight: '',
          });
          navigation.goBack();
        }, 2000);
      } else {
        updateModal({
          message: response.message,
          modalType: 'error',
          showModal: true,
        });
      }
    } catch (error: any) {
      updateModal({
        message: error.message,
        modalType: 'error',
        showModal: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WithModal>
      <View style={tw`flex-1 bg-[#F7F7F7]`}>
        <BackHeaderTitle title="Dimensions (Including Packaging)" />

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
            <View style={tw`mt-[30px] mx-[25px] gap-[10px] z-50`}>
              {/* Unit selection dropdowns at the top */}
              <View style={tw`flex-row gap-4 mb-4`}>
                <UnitDropdownField
                  label="Dimension Unit"
                  units={dimensionUnits}
                  selectedUnit={dimensionUnit}
                  onSelect={(unit) => setDimensionUnit(unit as DimensionUnit)}
                />
                <UnitDropdownField
                  label="Weight Unit"
                  units={weightUnits}
                  selectedUnit={weightUnit}
                  onSelect={(unit) => setWeightUnit(unit as WeightUnit)}
                />
              </View>

              {(['height', 'length', 'width'] as Array<keyof typeof dimentions>).map((field) => (
                <DimensionInput
                  key={field}
                  field={field}
                  unit={dimensionUnit}
                  value={dimentions[field]}
                  errorMessage={formErrors[field]}
                  onInputChange={(text) => setDimentions((prev) => ({ ...prev, [field]: text }))}
                  onValidation={(text) => handleValidationChecks(field, text)}
                />
              ))}

              <DimensionInput
                field="weight"
                unit={weightUnit}
                value={dimentions.weight}
                errorMessage={formErrors.weight}
                onInputChange={(text) => setDimentions((prev) => ({ ...prev, weight: text }))}
                onValidation={(text) => handleValidationChecks('weight', text)}
              />
            </View>

            {userType === 'gallery' && (
              <View style={tw`mt-5 mx-[25px]`}>
                <Text style={tw`text-[14px] text-[#858585] mb-[15px]`}>
                  Is artwork on exhibition?
                </Text>
                <View style={tw`flex-row gap-4`}>
                  <ToggleButton
                    label="Yes"
                    isSelected={isOnExhibition}
                    onPress={() => setIsOnExhibition(true)}
                  />
                  <ToggleButton
                    label="No"
                    isSelected={!isOnExhibition}
                    onPress={() => {
                      setIsOnExhibition(false);
                      setExpoEndDate(null);
                    }}
                  />
                </View>

                {isOnExhibition && (
                  <View style={tw`mt-4`}>
                    <Text style={tw`text-[14px] text-[#858585] mb-[15px]`}>
                      Select Exhibition End Date:
                    </Text>

                    <Pressable
                      onPress={showDatePicker}
                      style={tw`bg-white border border-[#D1D5DB] rounded-lg px-4 py-3`}
                    >
                      <Text style={tw`text-[#1A1A1A]`}>
                        {expoEndDate
                          ? format(expoEndDate, 'MMM dd, yyyy - hh:mm a')
                          : 'Select date and time'}
                      </Text>
                    </Pressable>

                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="datetime"
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                      minimumDate={new Date()}
                      display={Platform.OS === 'ios' ? 'inline' : 'default'}
                      confirmTextIOS="Confirm"
                      cancelTextIOS="Cancel"
                    />
                  </View>
                )}
              </View>
            )}

            <View style={tw`mt-[30px] mx-[25px]`}>
              {/* Warning Container */}
              <View style={tw`bg-[#FFF4E5] border border-[#FFA500] p-[14px] rounded-[8px]`}>
                <Text style={tw`text-[#A65B00] text-[14px] font-medium`}>
                  By accepting this order, you have agreed to have this piece ready for shipping &
                  pickup.
                </Text>
              </View>

              {/* Agree and Continue Checkbox */}
              <Pressable
                onPress={() => setIsChecked(!isChecked)}
                style={tw`mt-[18px] flex-row items-center gap-[12px]`}
              >
                <View
                  style={tw`w-[20px] h-[20px] rounded-full border-2 border-[#858585] items-center justify-center`}
                >
                  {isChecked && <View style={tw`w-[12px] h-[12px] rounded-full bg-[#1a1a1a]`} />}
                </View>
                <Text style={tw`text-[14px] text-[#858585] font-medium`}>I agree and continue</Text>
              </Pressable>
            </View>

            <View style={tw`mt-[60px] mx-[25px] mb-[150px]`}>
              <LongBlackButton
                value="Submit"
                onClick={handleSubmit}
                isLoading={isLoading}
                isDisabled={checkIsDisabled()}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </WithModal>
  );
};

export default DimensionsDetails;
