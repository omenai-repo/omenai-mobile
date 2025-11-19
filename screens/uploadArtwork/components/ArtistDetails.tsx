import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import Input from 'components/inputs/Input';
import CustomSelectPicker from 'components/inputs/CustomSelectPicker';
import { uploadArtworkStore } from 'store/gallery/uploadArtworkStore';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { countriesListing } from 'data/uploadArtworkForm.data';
import { validate } from 'lib/validations/upload_artwork_input_validator/validator';
import { useAppStore } from 'store/app/appStore';
import { Country, ICountry } from 'country-state-city';
import { debounce } from 'lodash';

type artistDetailsErrorsType = {
  artist: string;
  artist_birthyear: string;
};

export default function ArtistDetails() {
  const { userSession } = useAppStore();
  const { setActiveIndex, activeIndex, updateArtworkUploadData, artworkUploadData } =
    uploadArtworkStore();

  const [formErrors, setFormErrors] = useState<artistDetailsErrorsType>({
    artist: '',
    artist_birthyear: '',
  });

  const transformedCountries = useMemo(
    () =>
      Country.getAllCountries().map((item: ICountry) => ({
        value: item.isoCode,
        label: item.name,
      })),
    [],
  );

  const checkIsDisabled = () => {
    // Check if there are no error messages and all input fields are filled
    const isFormValid = Object.values(formErrors).every((error) => error === '');
    const areAllFieldsFilled = Object.values({
      artist: artworkUploadData.artist,
      birth_year: artworkUploadData.artist_birthyear,
    }).every((value) => value !== '');

    return !(isFormValid && areAllFieldsFilled);
  };

  const handleValidationChecks = debounce((label: string, value: string) => {
    // Clear error if the input is empty
    if (value.trim() === '') {
      setFormErrors((prev) => ({ ...prev, [label]: '' }));
      return;
    }

    const { success, errors }: { success: boolean; errors: string[] | [] } = validate(label, value);
    if (!success) {
      setFormErrors((prev) => ({ ...prev, [label]: errors[0] }));
    } else {
      setFormErrors((prev) => ({ ...prev, [label]: '' }));
    }
  }, 500);

  useEffect(() => {
    if (userSession) {
      updateArtworkUploadData('artist', userSession.name);
    }
  }, [userSession]);

  return (
    <View style={styles.container}>
      <View style={styles.inputsContainer}>
        <Input
          label="Artist full name"
          onInputChange={(value) => updateArtworkUploadData('artist', value)}
          placeHolder="Enter artist full name"
          value={artworkUploadData.artist}
          errorMessage={formErrors.artist}
          disabled
        />
        <Input
          label="Artist Birth year"
          onInputChange={(value) => {
            updateArtworkUploadData('artist_birthyear', value);
            handleValidationChecks('artist_birthyear', value);
          }}
          placeHolder="Enter artist birth year"
          value={artworkUploadData.artist_birthyear}
          errorMessage={formErrors.artist_birthyear}
          keyboardType="decimal-pad"
        />
        <View>
          <CustomSelectPicker
            label="Artist Country of origin"
            handleSetValue={(item) => updateArtworkUploadData('artist_country_origin', item.value)}
            placeholder="Select country"
            value={artworkUploadData.artist_country_origin}
            data={transformedCountries}
            search={true}
            searchPlaceholder="Search country"
          />
        </View>
      </View>
      <View style={{ zIndex: 2 }}>
        <LongBlackButton
          value="Proceed"
          onClick={() => setActiveIndex(activeIndex + 1)}
          isLoading={false}
          isDisabled={checkIsDisabled()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputsContainer: {
    gap: 20,
    marginBottom: 50,
    zIndex: 5,
  },
  flexInputsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
});
