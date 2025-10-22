import { StyleSheet, Text, View } from 'react-native';
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { Fontisto } from '@expo/vector-icons';
import { colors } from 'config/colors.config';
import Input from 'components/inputs/Input';
import CustomSelectPicker from 'components/inputs/CustomSelectPicker';
import { country_codes } from 'json/country_alpha_2_codes';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { State, City, IState, ICity } from 'country-state-city';
import { generateAlphaDigit } from 'utils/utils_generateToken';
import { subscriptionStepperStore } from 'store/subscriptionStepper/subscriptionStepperStore';
import { validateChargeAuthorization } from 'services/subscriptions/subscribeUser/validateChargeAuthorization';
import { useModalStore } from 'store/modal/modalStore';
import { debounce } from 'lodash';

type AvsNoauthInputProps = {
  handleNext: () => void;
  updateFinalAuthorization: Dispatch<SetStateAction<ValidateChargeTypes>>;
};

export default function AvsNoauthInput({
  handleNext,
  updateFinalAuthorization,
}: AvsNoauthInputProps) {
  const [address_info, set_address_info] = useState<{
    city: string;
    address: string;
    zipcode: string;
    state: string;
    country: string;
    countryCode: string;
  }>({
    city: '',
    address: '',
    zipcode: '',
    state: '',
    country: '',
    countryCode: '',
  });

  const [stateData, setStateData] = useState<{ label: string; value: string; isoCode?: string }[]>(
    [],
  );
  const [cityData, setCityData] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { updateModal } = useModalStore();

  const { flw_charge_payload, update_flw_charge_payload_data, setWebViewUrl, set_transaction_id } =
    subscriptionStepperStore();

  const transformedCountries = useMemo(
    () =>
      country_codes.map((item) => ({
        value: item.key, // Using alpha2 code as value
        label: item.name,
      })),
    [],
  );

  const handleCountrySelect = (item: { label: string; value: string }) => {
    set_address_info((prev) => ({
      ...prev,
      country: item.label,
      countryCode: item.value,
      state: '',
      city: '',
    }));

    // Reset state and city selections
    setStateData([]);
    setCityData([]);

    // Get the selected country's states
    const getStates = State.getStatesOfCountry(item.value);
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

  // Debounced Fetch Cities Function
  const fetchCities = debounce((countryCode: string, stateIsoCode: string) => {
    const getCities = City.getCitiesOfState(countryCode, stateIsoCode);
    setCityData(
      getCities?.map((city: ICity) => ({
        label: city.name,
        value: city.name,
      })) || [],
    );
  }, 300);

  const handleStateSelect = (item: { label: string; value: string; isoCode?: string }) => {
    set_address_info((prev) => ({
      ...prev,
      state: item.value,
      city: '',
    }));

    if (item.isoCode && address_info.countryCode) {
      fetchCities(address_info.countryCode, item.isoCode);
    }
  };

  const handleCitySelect = (item: { label: string; value: string }) => {
    set_address_info((prev) => ({
      ...prev,
      city: item.value,
    }));
  };

  const handleInputChange = ({ name, value }: { name: string; value: string }) => {
    set_address_info((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const ref = generateAlphaDigit(7);

    const data: FLWDirectChargeDataTypes & {
      authorization: AvsAuthorizationData;
    } = {
      authorization: {
        mode: 'avs_noauth',
        city: address_info.city,
        address: address_info.address,
        zipcode: address_info.zipcode,
        state: address_info.state,
        country: address_info.countryCode, // Using country code instead of name
      },
      ...flw_charge_payload,
      tx_ref: ref,
    };

    const response = await validateChargeAuthorization(data);
    if (response?.isOk) {
      if (response.data.status === 'error') {
        updateModal({
          message: response.data.message,
          showModal: true,
          modalType: 'error',
        });
      } else {
        update_flw_charge_payload_data({} as FLWDirectChargeDataTypes & { name: string });
        if (response.data.meta.authorization.mode === 'redirect') {
          set_transaction_id(response.data.data.id);
          setWebViewUrl(response.data.meta.authorization.redirect);
        } else {
          updateFinalAuthorization(response.data.meta.authorization.mode);
        }
        handleNext();
      }
    } else {
      updateModal({
        message: 'Something went wrong',
        showModal: true,
        modalType: 'error',
      });
    }

    setLoading(false);
  };

  return (
    <View style={{ zIndex: 25, paddingBottom: 100 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, flex: 1 }}>Address verification</Text>
        <View style={styles.secureForm}>
          <Fontisto name="locked" size={10} />
          <Text style={{ fontSize: 12, color: colors.primary_black }}>Secure form</Text>
        </View>
      </View>
      <View style={styles.formContainer}>
        <CustomSelectPicker
          label="Country"
          placeholder="Select country"
          value={address_info.countryCode}
          data={transformedCountries}
          handleSetValue={handleCountrySelect}
          zIndex={90}
          search={true}
          searchPlaceholder="Search country"
        />
        <CustomSelectPicker
          label="State"
          placeholder="Select state"
          value={address_info.state}
          data={stateData}
          handleSetValue={handleStateSelect}
          zIndex={80}
          disable={!address_info.country}
          search={true}
          searchPlaceholder="Search state"
        />
        <CustomSelectPicker
          label="City"
          placeholder="Select city"
          value={address_info.city}
          data={cityData}
          handleSetValue={handleCitySelect}
          zIndex={70}
          disable={!address_info.state}
          search={true}
          searchPlaceholder="Search city"
        />
        <View style={{ zIndex: 60 }}>
          <Input
            label="Address"
            onInputChange={(e) => handleInputChange({ name: 'address', value: e })}
            value={address_info.address}
            placeHolder="Enter address"
          />
        </View>
        <View style={{ zIndex: 50 }}>
          <Input
            label="Zip code"
            onInputChange={(e) => handleInputChange({ name: 'zipcode', value: e })}
            value={address_info.zipcode}
            placeHolder="e.g 12345"
          />
        </View>
      </View>
      <LongBlackButton onClick={handleSubmit} value="Submit" isLoading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: 20,
    marginTop: 20,
    marginBottom: 30,
    zIndex: 100,
  },
  secureForm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
