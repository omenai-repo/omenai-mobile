import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Input from 'components/inputs/Input';
import LargeInput from 'components/inputs/LargeInput';
import UploadImageInput from 'components/inputs/UploadImageInput';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { uploadArtworkStore } from 'store/gallery/uploadArtworkStore';
import CustomSelectPicker from 'components/inputs/CustomSelectPicker';
import {
  certificateOfAuthenticitySelectOptions,
  framingList,
  mediumListing,
  rarityList,
  signatureArtistSelectOptions,
  signatureSelectOptions,
} from 'data/uploadArtworkForm.data';
import { validate } from 'lib/validations/upload_artwork_input_validator/validator';
import { useAppStore } from 'store/app/appStore';

type artworkDetailsErrorsType = {
  title: string;
  description: string;
  materials: string;
  year: string;
};

export default function ArtworkDetails() {
  const { userType } = useAppStore();
  const { setActiveIndex, activeIndex, updateArtworkUploadData, artworkUploadData } =
    uploadArtworkStore();

  const [formErrors, setFormErrors] = useState<artworkDetailsErrorsType>({
    title: '',
    description: '',
    materials: '',
    year: '',
  });

  const checkIsDisabled = () => {
    // Check if there are no error messages and all input fields are filled
    const isFormValid = Object.values(formErrors).every((error) => error === '');
    const areAllFieldsFilled = Object.values({
      title: artworkUploadData.title,
      materials: artworkUploadData.materials,
      year: artworkUploadData.year,
      medium: artworkUploadData.medium,
      rarity: artworkUploadData.rarity,
      certificate_of_auth: artworkUploadData.certificate_of_authenticity,
      signature: artworkUploadData.signature,
      framing: artworkUploadData.framing,
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

  useEffect(() => {
    if (artworkUploadData.title) {
      handleValidationChecks('title', artworkUploadData.title);
    }
  }, [artworkUploadData.title]);

  useEffect(() => {
    if (artworkUploadData.artwork_description) {
      handleValidationChecks('description', artworkUploadData.artwork_description || '');
    }
  }, [artworkUploadData.artwork_description]);

  useEffect(() => {
    if (artworkUploadData.year) {
      handleValidationChecks('year', artworkUploadData.year.toString());
    }
  }, [artworkUploadData.year]);

  useEffect(() => {
    if (artworkUploadData.materials) {
      handleValidationChecks('materials', artworkUploadData.materials);
    }
  }, [artworkUploadData.materials]);

  return (
    <View style={styles.container}>
      <View style={styles.inputsContainer}>
        <Input
          label="Artwork title"
          onInputChange={(value) => updateArtworkUploadData('title', value)}
          placeHolder="Enter the name of your artwork"
          value={artworkUploadData.title}
          errorMessage={formErrors.title}
        />
        <LargeInput
          label="Artwork description"
          onInputChange={(value) => updateArtworkUploadData('artwork_description', value)}
          placeHolder="Write a description of your artwork (not more than 100 words)"
          value={artworkUploadData.artwork_description || ''}
          errorMessage={formErrors.description}
        />
        <View style={[styles.flexInputsContainer]}>
          <View style={{ flex: 1 }}>
            <Input
              label="Year"
              placeHolder="Enter year of creation"
              value={artworkUploadData.year.toString()}
              onInputChange={(value) => updateArtworkUploadData('year', value)}
              errorMessage={formErrors.year}
            />
          </View>
          <View style={{ flex: 1 }}>
            <CustomSelectPicker
              label="Medium"
              data={mediumListing}
              placeholder="Select medium"
              value={artworkUploadData.medium}
              handleSetValue={(item) => updateArtworkUploadData('medium', item.value)}
            />
          </View>
        </View>
        <View style={[styles.flexInputsContainer, { zIndex: 5 }]}>
          <View style={{ flex: 1 }}>
            <CustomSelectPicker
              label="Rarity"
              data={rarityList}
              placeholder="Select rarity"
              value={artworkUploadData.rarity}
              handleSetValue={(item) => updateArtworkUploadData('rarity', item.value)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <CustomSelectPicker
              label="Certificate of authenticity"
              data={certificateOfAuthenticitySelectOptions}
              placeholder="Select"
              value={artworkUploadData.certificate_of_authenticity}
              handleSetValue={(item) =>
                updateArtworkUploadData('certificate_of_authenticity', item.value)
              }
            />
          </View>
        </View>
        <View style={{ zIndex: 3 }}>
          <Input
            label="Materials"
            onInputChange={(value) => updateArtworkUploadData('materials', value)}
            placeHolder="Enter the materials used (separate each with a comma)"
            value={artworkUploadData.materials}
            errorMessage={formErrors.materials}
          />
        </View>
        <View style={[styles.flexInputsContainer, { zIndex: 4 }]}>
          <View style={{ flex: 1 }}>
            <CustomSelectPicker
              label="Signature"
              data={userType === 'gallery' ? signatureSelectOptions : signatureArtistSelectOptions}
              placeholder="Select"
              value={artworkUploadData.signature}
              dropdownPosition="top"
              handleSetValue={(item) => updateArtworkUploadData('signature', item.value)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <CustomSelectPicker
              label="Framing"
              data={framingList}
              placeholder="Choose frame"
              value={artworkUploadData.framing}
              dropdownPosition="top"
              handleSetValue={(item) => updateArtworkUploadData('framing', item.value)}
            />
          </View>
        </View>
      </View>
      <LongBlackButton
        value="Proceed"
        onClick={() => setActiveIndex(activeIndex + 1)}
        isLoading={false}
        isDisabled={checkIsDisabled()}
      />
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
});
