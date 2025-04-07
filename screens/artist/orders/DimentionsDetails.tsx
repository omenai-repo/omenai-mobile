import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import { uploadArtworkStore } from 'store/gallery/uploadArtworkStore';
import { validate } from 'lib/validations/upload_artwork_input_validator/validator';
import Input from 'components/inputs/Input';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { SvgXml } from 'react-native-svg';
import { warningIconSm } from 'utils/SvgImages';
import { Text } from 'react-native';

type ArtworkDimensionsErrorsType = {
  height: string;
  length: string;
  width: string;
  weight: string;
};

const DimensionsDetails = () => {
  const { width } = useWindowDimensions();
  const { activeIndex, setActiveIndex, artworkUploadData, updateArtworkUploadData } =
    uploadArtworkStore();
  const [formErrors, setFormErrors] = useState<ArtworkDimensionsErrorsType>({
    height: '',
    length: '',
    width: '',
    weight: '',
  });

  const checkIsDisabled = () => {
    // Check if there are no error messages and all input fields are filled
    const isFormValid = Object.values(formErrors).every((error) => error === '');

    const areAllFieldsFilled = Object.values({
      weight: artworkUploadData.weight,
      height: artworkUploadData.height,
      width: artworkUploadData.width,
    }).every((value) => value !== '');

    return !(isFormValid && areAllFieldsFilled);
  };

  const handleValidationChecks = (label: keyof ArtworkDimensionsErrorsType, value: string) => {
    if (value.trim() === '') {
      // If the input is empty, clear the error
      setFormErrors((prev) => ({ ...prev, [label]: '' }));
    } else {
      // Run validation and update error state
      const { success, errors } = validate(label, value);
      setFormErrors((prev) => ({ ...prev, [label]: success ? '' : errors[0] }));
    }
  };

  return (
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
                label={field.charAt(0).toUpperCase() + field.slice(1)} // Capitalize label
                keyboardType="default"
                onInputChange={(text) => {
                  updateArtworkUploadData(field, text);
                  handleValidationChecks(field as keyof ArtworkDimensionsErrorsType, text);
                }}
                placeHolder={`Enter ${field}`}
                value={artworkUploadData[field]}
                errorMessage={formErrors[field]}
                containerStyle={{ flex: 0 }}
              />
            ))}
          </View>

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
              onClick={() => setActiveIndex(activeIndex + 1)}
              isLoading={false}
              isDisabled={checkIsDisabled()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default DimensionsDetails;
