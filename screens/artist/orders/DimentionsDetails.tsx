import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import { validate } from 'lib/validations/upload_artwork_input_validator/validator';
import Input from 'components/inputs/Input';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { SvgXml } from 'react-native-svg';
import { warningIconSm } from 'utils/SvgImages';
import { Text } from 'react-native';
import { updateShippingQuote } from 'services/orders/updateShippingQuote';
import { useModalStore } from 'store/modal/modalStore';
import { useNavigation, useRoute } from '@react-navigation/native';
import WithModal from 'components/modal/WithModal';
import { validateOrderMeasurement } from 'lib/validations/upload_artwork_input_validator/validateOrderMeasurement';
import { useAppStore } from 'store/app/appStore';
import DateTimePicker from '@react-native-community/datetimepicker';

type ArtworkDimensionsErrorsType = {
  height: string;
  length: string;
  width: string;
  weight: string;
};

const DimensionsDetails = () => {
  const { width } = useWindowDimensions();
  const { userType } = useAppStore();
  const { orderId } = useRoute<any>().params;
  const navigation = useNavigation();
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
  const [isLoading, setIsLoading] = useState(false);
  const [isOnExhibition, setIsOnExhibition] = useState(false);
  const [expoEndDate, setExpoEndDate] = useState<string>('');

  const { updateModal } = useModalStore();

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

  const handleValidationChecks = (label: keyof ArtworkDimensionsErrorsType, value: string) => {
    if (value.trim() === '') {
      // If the input is empty, clear the error
      setFormErrors((prev) => ({ ...prev, [label]: '' }));
    } else {
      // Run validation and update error state
      const errors = validateOrderMeasurement(value);
      setFormErrors((prev) => ({ ...prev, [label]: errors.length === 0 ? '' : errors }));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const payload = {
        order_id: orderId,
        dimensions: {
          length: parseFloat(dimentions.length),
          width: parseFloat(dimentions.width),
          height: parseFloat(dimentions.height),
          weight: parseFloat(dimentions.weight),
        },
        exhibition_status:
          userType === 'gallery'
            ? {
                is_on_exhibition: isOnExhibition,
                exhibition_end_date: expoEndDate ? new Date(expoEndDate) : '',
              }
            : null,
        hold_status: null,
      };
      const response = await updateShippingQuote(payload);
      console.log(response);
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
            <View style={tw`mt-[30px] mx-[25px] gap-[30px]`}>
              {(
                ['height', 'length', 'width', 'weight'] as Array<keyof ArtworkDimensionsErrorsType>
              ).map((field) => (
                <Input
                  key={field}
                  label={
                    field === 'weight'
                      ? field.charAt(0).toUpperCase() + field.slice(1) + ' ' + '(kg)'
                      : field.charAt(0).toUpperCase() + field.slice(1) + ' ' + '(cm)'
                  } // Capitalize label
                  keyboardType="default"
                  onInputChange={(text) => {
                    setDimentions((prev) => ({ ...prev, [field]: text }));
                    handleValidationChecks(field as keyof ArtworkDimensionsErrorsType, text);
                  }}
                  placeHolder={`Enter ${field}`}
                  value={dimentions[field]}
                  errorMessage={formErrors[field]}
                  containerStyle={{ flex: 0 }}
                />
              ))}
            </View>

            {userType === 'gallery' && (
              <View style={tw`mt-5 mx-[25px]`}>
                <Text style={tw`text-[14px] text-[#858585] mb-[15px]`}>
                  Is artwork on exhibition?
                </Text>
                <View style={tw`flex-row gap-4`}>
                  <Pressable
                    onPress={() => setIsOnExhibition(true)}
                    style={tw.style(
                      `h-[51px] rounded-full bg-[#F7F7F7] justify-center items-center flex-1 border-2 border-[#000000]`,
                    )}
                    disabled={isOnExhibition}
                  >
                    <Text style={tw`text-[#1A1A1A]] font-bold text-[14px]`}>Yes</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      setIsOnExhibition(false);
                      setExpoEndDate('');
                    }}
                    disabled={!isOnExhibition}
                    style={tw.style(
                      `h-[51px] rounded-full justify-center bg-[#1A1A1A] items-center flex-1`,
                    )}
                  >
                    <Text style={tw`text-white font-bold text-[14px]`}>No</Text>
                  </Pressable>
                </View>

                {isOnExhibition && (
                  <View style={tw`mt-4`}>
                    <Text style={tw`text-[14px] text-[#858585] mb-[15px]`}>
                      Select Exhibition End Date:
                    </Text>
                    <DateTimePicker
                      value={expoEndDate ? new Date(expoEndDate) : new Date()}
                      mode="datetime"
                      display="default"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) {
                          setExpoEndDate(selectedDate.toISOString());
                        }
                      }}
                    />
                  </View>
                )}
              </View>
            )}

            <View
              style={tw.style(
                `border border-[#FFA500] mt-[30px] flex-row items-center gap-[10px] bg-[#FFF3E0] rounded-[8px] p-[15px]`,
                {
                  marginHorizontal: width / 12,
                },
              )}
            >
              <SvgXml xml={warningIconSm} />
              <Text style={tw`text-[14px] text-[#FFA500] font-medium pr-[30px]`}>
                By accepting this order, you have agreed to have this piece ready for shipping &
                pickup
              </Text>
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
