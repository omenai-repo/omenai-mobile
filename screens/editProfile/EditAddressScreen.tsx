import {
  View,
  Text,
  Pressable,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import tw from 'twrnc';
import Input from 'components/inputs/Input';
import { validate } from 'lib/validations/validatorGroup';
import CustomSelectPicker from 'components/inputs/CustomSelectPicker';
import BackFormButton from 'components/buttons/BackFormButton';
import { verifyAddress } from 'services/register/verifyAddress';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import { useModalStore } from 'store/modal/modalStore';
import { debounce } from 'lodash';
import AuthModal from 'components/auth/AuthModal';
import { checkMarkIcon, errorIcon } from 'utils/SvgImages';
import { useIndividualAuthRegisterStore } from 'store/auth/register/IndividualAuthRegisterStore';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';
import { useAppStore } from 'store/app/appStore';
import { useNavigation } from '@react-navigation/native';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import { updateProfile } from 'services/update/updateProfile';
import { logout } from 'utils/logout.utils';

const EditAddressScreen = () => {
  const navigation = useNavigation<any>();
  const { height, width } = useWindowDimensions();
  const { userSession } = useAppStore();
  const [formErrors, setFormErrors] = useState<Partial<AddressTypes & { phone: string }>>({
    address_line: '',
    city: '',
    country: '',
    state: '',
    zip: '',
    countryCode: '',
    phone: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [addressVerified, setAddressVerified] = useState(false);
  const [countryCode, setCountryCode] = useState(userSession.address.countryCode || '');
  const [country, setCountry] = useState(userSession.address.country || '');
  const [stateName, setStateName] = useState(userSession.address.state || '');
  const [stateCode, setStateCode] = useState(userSession.address.stateCode || '');
  const [city, setCity] = useState(userSession.address.city || '');
  const [addressLine, setAddressLine] = useState(userSession.address.address_line || '');
  const [zipCode, setZipCode] = useState(userSession.address.zip || '');
  const [stateData, setStateData] = useState<{ label: string; value: string; isoCode?: string }[]>(
    [],
  );
  const [cityData, setCityData] = useState<{ label: string; value: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { updateModal } = useModalStore();

  const originalAddress = useMemo(
    () => ({
      addressLine: userSession.address.address_line || '',
      city: userSession.address.city || '',
      zipCode: userSession.address.zip || '',
      country: userSession.address.country || '',
      countryCode: userSession.address.countryCode || '',
      state: userSession.address.state || '',
      stateCode: userSession.address.stateCode || '',
    }),
    [userSession],
  );

  const hasAddressChanged = useMemo(() => {
    return (
      addressLine !== originalAddress.addressLine ||
      city !== originalAddress.city ||
      zipCode !== originalAddress.zipCode ||
      country !== originalAddress.country ||
      countryCode !== originalAddress.countryCode ||
      stateName !== originalAddress.state ||
      stateCode !== originalAddress.stateCode
    );
  }, [addressLine, city, zipCode, country, countryCode, stateName, stateCode, originalAddress]);

  useEffect(() => {
    if (countryCode) {
      const states = State.getStatesOfCountry(countryCode) || [];
      const mappedStates = states.map((s) => ({
        label: s.name,
        value: s.name,
        isoCode: s.isoCode,
      }));
      setStateData(mappedStates);

      const selectedState = mappedStates.find(
        (s) => s.value === stateName || s.isoCode === stateCode,
      );
      if (selectedState?.isoCode) {
        fetchCities(countryCode, selectedState.isoCode);
      }
    }
  }, [countryCode]);

  const transformedCountries = useMemo(
    () =>
      Country.getAllCountries().map((item: ICountry) => ({
        value: item.isoCode,
        label: item.name,
      })),
    [],
  );

  const handleCountrySelect = (item: { label: string; value: string }) => {
    setCountry(item.label);
    setCountryCode(item.value);
    setStateName('');
    setStateCode('');
    setCity('');
    setZipCode('');
    setAddressLine('');
    setStateData([]);
    setCityData([]);

    const getStates = State.getStatesOfCountry(item.value);
    if (getStates) {
      setStateData(
        getStates.map((s: IState) => ({
          label: s.name,
          value: s.name,
          isoCode: s.isoCode,
        })),
      );
    }
  };

  // 🚀 **Debounced Fetch Cities Function**
  const fetchCities = useCallback(
    debounce((countryCode, stateValue) => {
      const getCities = City.getCitiesOfState(countryCode, stateValue);
      setCityData(
        getCities?.map((city: ICity) => ({
          label: city.name,
          value: city.name,
        })) || [],
      );
    }, 300),
    [],
  );

  // 🚀 **Handle State Selection**
  const handleStateSelect = (item: { label: string; value: string; isoCode?: string }) => {
    if (item.value !== stateName) {
      setStateName(item.value);
      if (item.isoCode) {
        setStateCode(item.isoCode);
      }

      // Clear only dependent city + zip + address line
      setAddressLine('');
      setCity('');
      setZipCode('');
      setCityData([]);

      fetchCities(countryCode, item.isoCode || '');
    }
  };

  const checkIsDisabled = () => {
    const isFormValid = formErrors && Object.values(formErrors).every((error) => error === '');
    const areAllFieldsFilled = Object.values({
      address_line: addressLine,
      city: city,
      zip: zipCode,
      country: country,
      state: stateName,
    }).every((value) => value !== '');

    return !(isFormValid && areAllFieldsFilled && hasAddressChanged);
  };

  const handleValidationChecks = debounce((label: string, value: string, confirm?: string) => {
    // Clear error if the input is empty
    if (value.trim() === '') {
      setFormErrors((prev) => ({ ...prev, [label]: '' }));
      return;
    }

    const { success, errors } = validate(value, label, confirm);
    setFormErrors((prev) => ({
      ...prev,
      [label]: errors.length > 0 ? errors[0] : '',
    }));
  }, 500); // ✅ Delay validation by 500ms

  const handleSubmit = async () => {
    if (!hasAddressChanged) return;
    setIsLoading(true);
    try {
      const payload = {
        type: 'delivery',
        countyName: city,
        cityName: stateName,
        postalCode: zipCode,
        countryCode: countryCode,
      };

      const response = await verifyAddress(payload);

      setIsLoading(false);

      if (response?.isOk) {
        if (response?.body?.data?.address && response.body.data.address.length !== 0) {
          setShowModal(true);
          setAddressVerified(true);
        } else {
          setShowModal(true);
          setAddressVerified(false);
        }
      } else {
        setShowModal(true);
        setAddressVerified(false);
      }
    } catch (error) {
      console.error('Error verifying address:', error);
      updateModal({
        message: 'Network error, please check your connection and try again.',
        modalType: 'error',
        showModal: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setTimeout(() => {
      logout();
    }, 3500);
  };

  const handleUpdate = async () => {
    setIsLoading(true);

    const data = {
      address: {
        address_line: addressLine,
        city: city,
        state: stateName,
        country: country,
        zip: zipCode,
        countryCode: countryCode,
        stateCode: stateCode,
      },
    };
    const result = await updateProfile('individual', data, userSession.id);

    if (result.isOk) {
      setIsLoading(false);
      updateModal({
        message: 'Address updated successfully, sign in to view update',
        modalType: 'success',
        showModal: true,
      });
      signOut();
    } else {
      setIsLoading(false);
      updateModal({
        message: result.body.message,
        modalType: 'error',
        showModal: true,
      });
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackHeaderTitle title="Edit Address" />
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
          <View style={tw`px-[20px] mt-[20px] flex-1 gap-[20px]`}>
            <CustomSelectPicker
              data={transformedCountries}
              placeholder="Select country of residence"
              value={countryCode}
              handleSetValue={handleCountrySelect}
              label="Country of residence"
              search={true}
              searchPlaceholder="Search Country"
              dropdownPosition="bottom"
            />

            <CustomSelectPicker
              data={stateData}
              placeholder="Select state of residence"
              value={stateName}
              handleSetValue={handleStateSelect}
              disable={!countryCode}
              label="State of residence"
              search={true}
              searchPlaceholder="Search State"
              dropdownPosition="bottom"
            />

            <View style={tw`flex-row`}>
              <Input
                label="Address"
                keyboardType="default"
                onInputChange={(text) => {
                  setAddressLine(text);
                  handleValidationChecks('general', text);
                }}
                placeHolder="Input your gallery address here"
                value={addressLine}
                errorMessage={formErrors?.address_line}
              />
            </View>

            <View style={tw`flex-row items-center gap-[30px]`}>
              <View style={tw`flex-1`}>
                <CustomSelectPicker
                  data={cityData}
                  placeholder="Select city"
                  value={city}
                  disable={!stateName}
                  handleSetValue={(item) => {
                    if (item.value !== city) {
                      setCity(item.value);
                      setZipCode('');
                    }
                  }}
                  label="City"
                  search={true}
                  searchPlaceholder="Search City"
                  dropdownPosition="top"
                />
              </View>
              <View style={tw`flex-1`}>
                <Input
                  label="Zip Code"
                  keyboardType="number-pad"
                  onInputChange={(text) => {
                    setZipCode(text);
                    handleValidationChecks('general', text);
                  }}
                  placeHolder="Zip Code"
                  value={zipCode}
                  errorMessage={formErrors?.zip}
                />
              </View>
            </View>

            <View style={tw`flex-1 mt-[20px]`}>
              <FittedBlackButton
                isLoading={isLoading}
                height={50}
                value="Verify Address"
                isDisabled={checkIsDisabled()}
                onClick={handleSubmit}
              />
            </View>

            <AuthModal
              modalVisible={showModal}
              setModalVisible={setShowModal}
              icon={addressVerified ? checkMarkIcon : errorIcon}
              text={
                addressVerified
                  ? 'Your Address has been verified succesfully'
                  : 'Your Address could not be verified. Try again.'
              }
              btn1Text="Cancel"
              btn2Text={addressVerified ? 'Update Address' : 'Try Again'}
              onPress1={() => {
                setShowModal(false);
              }}
              onPress2={() => {
                if (addressVerified) {
                  setShowModal(false);
                  handleUpdate();
                } else {
                  setShowModal(false);
                  handleSubmit();
                }
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditAddressScreen;
