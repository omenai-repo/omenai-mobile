import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import tw from 'twrnc';
import Input from 'components/inputs/Input';
import { useArtistAuthRegisterStore } from 'store/auth/register/ArtistAuthRegisterStore';
import { validate } from 'lib/validations/validatorGroup';
import CustomSelectPicker from 'components/inputs/CustomSelectPicker';
import { country_codes } from 'json/country_alpha_2_codes';
import BackFormButton from 'components/buttons/BackFormButton';
import { verifyAddress } from 'services/register/verifyAddress';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import { useModalStore } from 'store/modal/modalStore';
import { debounce } from 'lodash';
import AuthModal from 'components/auth/AuthModal';
import { checkMarkIcon, errorIcon } from 'utils/SvgImages';
import { useGalleryAuthRegisterStore } from 'store/auth/register/GalleryAuthRegisterStore';
import { State, City, IState, ICity } from 'country-state-city';

const transformedCountries = country_codes.map((item) => ({
  label: item.name,
  value: item.key,
}));

const GalleryAddressVerification = () => {
  const { height, width } = useWindowDimensions();
  const [formErrors, setFormErrors] = useState<Partial<AddressTypes & { phone: string }>>({
    address_line: '',
    city: '',
    country: '',
    state: '',
    zip: '',
    countryCode: '',
    phone: '',
  });
  const [showToolTip, setShowToolTip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [addressVerified, setAddressVerified] = useState(false);

  const { updateModal } = useModalStore();

  const {
    pageIndex,
    setPageIndex,
    galleryRegisterData,
    setAddress,
    setCity,
    setPhone,
    setZipCode,
    setCountry,
    setCountryCode,
    setState,
    setIsLoading,
    stateData,
    setStateData,
    isLoading,
    cityData,
    setCityData,
  } = useGalleryAuthRegisterStore();

  const handleCountrySelect = (item: { label: string; value: string }) => {
    setCountry(item.label);
    setCountryCode(item.value);

    // Reset state and city selections
    setState('');
    setCity('');

    // Clear state and city dropdown data
    setStateData([]);
    setCityData([]);

    // get the selected country's states
    const getStates = State.getStatesOfCountry(item.value);

    // Set the states dropdown data
    setStateData(
      getStates
        ? getStates.map((state: IState) => ({
            label: state.name,
            value: state.name,
            isoCode: state.isoCode,
          }))
        : [],
    );
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
  const handleStateSelect = useCallback(
    (item: { label: string; value: string; isoCode?: string }) => {
      setState(item.value);
      fetchCities(galleryRegisterData.address.countryCode, item.isoCode);
    },
    [galleryRegisterData.address.countryCode, fetchCities],
  );

  const checkIsDisabled = () => {
    // Check if there are no error messages and all input fields are filled
    const isFormValid = formErrors && Object.values(formErrors).every((error) => error === '');
    const areAllFieldsFilled = Object.values({
      address_line: galleryRegisterData?.address?.address_line,
      city: galleryRegisterData?.address?.city,
      zip: galleryRegisterData?.address?.zip,
      country: galleryRegisterData?.address?.country,
      state: galleryRegisterData?.address?.state,
      phone: galleryRegisterData?.phone,
    }).every((value) => value !== '');

    return !(isFormValid && areAllFieldsFilled);
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
    setIsLoading(true);
    try {
      const payload = {
        type: 'pickup',
        countyName: galleryRegisterData.address.city,
        cityName: galleryRegisterData.address.state,
        postalCode: galleryRegisterData.address.zip,
        countryCode: galleryRegisterData.address.countryCode,
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

  return (
    <View style={tw``}>
      <View style={tw`mb-[20px]`}>
        <CustomSelectPicker
          data={transformedCountries}
          placeholder="Select country of operation"
          value={galleryRegisterData.address.countryCode}
          handleSetValue={handleCountrySelect}
          label="Country of operation"
          search={true}
          searchPlaceholder="Search Country"
          dropdownPosition="bottom"
        />
      </View>

      <View style={tw`mb-[20px]`}>
        <CustomSelectPicker
          data={stateData}
          placeholder="Select state"
          value={galleryRegisterData.address.state}
          handleSetValue={handleStateSelect}
          disable={!galleryRegisterData.address.countryCode}
          label="State of operation"
          search={true}
          searchPlaceholder="Search State"
          dropdownPosition="top"
        />
      </View>

      <Input
        label="Gallery Address"
        keyboardType="default"
        onInputChange={(text) => {
          setAddress(text);
          handleValidationChecks('general', text);
        }}
        placeHolder="Input your gallery address here"
        value={galleryRegisterData?.address?.address_line}
        errorMessage={formErrors?.address_line}
      />

      <View style={tw`flex-row items-center gap-[30px] my-[20px]`}>
        <View style={tw`flex-1`}>
          <CustomSelectPicker
            data={cityData}
            placeholder="Select city"
            value={galleryRegisterData.address.city}
            disable={!galleryRegisterData.address.state}
            handleSetValue={(item) => {
              setCity(item.value);
            }}
            label="City"
            search={true}
            searchPlaceholder="Search City"
            dropdownPosition="top"
          />
        </View>

        <Input
          label="Zip Code"
          keyboardType="default"
          onInputChange={(text) => {
            setZipCode(text);
            handleValidationChecks('general', text);
          }}
          placeHolder="Zip Code"
          value={galleryRegisterData?.address?.zip}
          errorMessage={formErrors?.zip}
        />
      </View>

      <Input
        label="Phone number"
        keyboardType="phone-pad"
        onInputChange={(text) => {
          setPhone(text);
          handleValidationChecks('general', text);
        }}
        placeHolder="+12345678990"
        value={galleryRegisterData?.phone}
        errorMessage={formErrors?.phone}
      />

      <View style={tw`flex-row mt-[40px]`}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
        <View style={{ flex: 1 }} />
        <FittedBlackButton
          isLoading={isLoading}
          height={50}
          value="Verify Address"
          isDisabled={checkIsDisabled()}
          onClick={handleSubmit}
        />
      </View>

      <Pressable
        onPress={() => setShowToolTip(!showToolTip)}
        style={tw.style(`rounded-full h-[45px] w-[45px] justify-center items-center bg-[#000]`, {
          top: height / 18,
          alignSelf: 'flex-end',
        })}
      >
        <Text style={tw`text-[#FFFFFF] text-[20px]`}>?</Text>
      </Pressable>
      {showToolTip && (
        <View
          style={tw.style(`mr-[80px]`, {
            bottom: -8,
            width: width / 2,
            alignSelf: 'flex-end',
          })}
        >
          <View style={tw`rounded-[12px] bg-[#111111] py-[10px] px-[15px]`}>
            <Text style={tw`text-[10px] text-[#FFFFFF] text-center leading-[15px]`}>
              We need your gallery address to {`\n`} properly verify shipping designation
            </Text>
          </View>
          <View
            style={tw`w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[20px] rounded-[5px] border-l-[#111111] absolute right-[-17px] top-[15px]`}
          />
        </View>
      )}
      <AuthModal
        modalVisible={showModal}
        setModalVisible={setShowModal}
        icon={addressVerified ? checkMarkIcon : errorIcon}
        text={
          addressVerified
            ? 'Your account has been verified succesfully'
            : 'Your Address could not be verified. Try again.'
        }
        btn1Text="Go Back"
        btn2Text={addressVerified ? 'Proceed' : 'Try Again'}
        onPress1={() => {
          setShowModal(false);
          setPageIndex(pageIndex - 1);
        }}
        onPress2={() => {
          if (addressVerified) {
            setPageIndex(pageIndex + 1);
          } else {
            setShowModal(false);
            handleSubmit();
          }
        }}
      />
    </View>
  );
};

export default GalleryAddressVerification;
