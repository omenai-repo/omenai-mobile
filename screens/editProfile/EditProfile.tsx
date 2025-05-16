import { StyleSheet, View, Text } from 'react-native';
import React, { useState } from 'react';
import WithModal from 'components/modal/WithModal';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import Input from 'components/inputs/Input';
import { useAppStore } from 'store/app/appStore';
import Preferences from './components/Preferences';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { validate } from 'lib/validations/validatorGroup';
import { updateProfile } from 'services/update/updateProfile';
import { useModalStore } from 'store/modal/modalStore';
import { logout } from 'utils/logout.utils';
import ScrollWrapper from 'components/general/ScrollWrapper';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

type EditProfileErrorsTypes = {
  name: string;
};

export default function EditProfile() {
  const { userSession } = useAppStore();
  const navigation = useNavigation<any>();

  const { updateModal } = useModalStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [fullname, setFullName] = useState<string>(userSession.name);
  const [email, setEmail] = useState<string>(userSession.email);
  const [phoneNumber, setPhoneNumber] = useState<string>(userSession.phone);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<EditProfileErrorsTypes>({
    name: '',
  });

  const [isChanged, setIsChanged] = useState<boolean>(false);

  const handleValidationChecks = (label: string, value: string) => {
    const { success, errors }: { success: boolean; errors: string[] | [] } = validate(value, label);
    if (!success) {
      setFormErrors((prev) => ({ ...prev, [label]: errors[0] }));
    } else {
      setFormErrors((prev) => ({ ...prev, [label]: '' }));
    }
  };

  const handleChange = (value: string) => {
    setFullName(value);
    setIsChanged(true);
    handleValidationChecks('name', value);
  };

  const checkIsDisabled = () => {
    // Check if there are no error messages and all input fields are filled
    const isFormValid = Object.values(formErrors).every((error) => error === '');
    const areAllFieldsFilled = Object.values({
      name: fullname,
      phoneNumber,
    }).every((value) => {
      if (value === '') return false;

      return true;
    });

    return !(isFormValid && areAllFieldsFilled && isChanged);
  };

  const handleUpdate = async () => {
    setIsLoading(true);

    if (!userSession.id) return;

    if (selectedPreferences.length < 5) {
      setIsLoading(false);
      updateModal({
        message: 'Please select up to 5 preferences',
        modalType: 'error',
        showModal: true,
      });
      return;
    }

    const data = {
      name: fullname,
      preferences: selectedPreferences,
    };
    const result = await updateProfile('individual', data, userSession.id);

    if (result.isOk) {
      setIsLoading(false);
      updateModal({
        message: 'Profile updated successfully, sign in to view update',
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

  const signOut = () => {
    setTimeout(() => {
      logout();
    }, 3500);
  };

  return (
    <WithModal>
      <BackHeaderTitle title="Edit profile" />
      <ScrollWrapper style={styles.container}>
        <View style={{ gap: 20, marginBottom: 40 }}>
          <Input
            label="Full name"
            value={fullname}
            onInputChange={handleChange}
            errorMessage={formErrors.name}
          />
          <Input
            label="Email address"
            value={email}
            disabled
            onInputChange={(text) => {
              setEmail(text);
              handleValidationChecks('email', text);
            }}
          />
          <Input
            label="Phone number"
            value={phoneNumber}
            keyboardType="phone-pad"
            onInputChange={(text) => {
              setPhoneNumber(text);
              setIsChanged(true);
            }}
          />
          <View style={{ marginTop: 10, gap: 10 }}>
            <View style={tw`mb-2`}>
              <Text style={tw`text-sm font-semibold text-[#858585] mb-1`}>Full Address</Text>
              <View style={tw`bg-gray-100 p-4 rounded-lg border border-gray-300`}>
                {userSession.address.address_line ? (
                  <Text style={tw`text-gray-800`}>
                    <Text style={tw`font-semibold`}>Address: </Text>
                    {userSession.address.address_line}
                    {'\n'}
                  </Text>
                ) : null}

                {userSession.address.city ? (
                  <Text style={tw`text-gray-800`}>
                    <Text style={tw`font-semibold`}>City: </Text>
                    {userSession.address.city}
                    {'\n'}
                  </Text>
                ) : null}

                {userSession.address.state ? (
                  <Text style={tw`text-gray-800`}>
                    <Text style={tw`font-semibold`}>State: </Text>
                    {userSession.address.state}
                    {'\n'}
                  </Text>
                ) : null}

                {userSession.address.zip ? (
                  <Text style={tw`text-gray-800`}>
                    <Text style={tw`font-semibold`}>Zip Code: </Text>
                    {userSession.address.zip}
                    {'\n'}
                  </Text>
                ) : null}

                {userSession.address.country ? (
                  <Text style={tw`text-gray-800`}>
                    <Text style={tw`font-semibold`}>Country: </Text>
                    {userSession.address.country}
                  </Text>
                ) : null}
              </View>
            </View>

            <LongBlackButton
              value="Edit address"
              onClick={() =>
                navigation.navigate('EditAddressScreen', { currentAddress: userSession.address })
              }
              isDisabled={false}
            />
          </View>

          <Preferences
            label="Preferences"
            selectedPreferences={selectedPreferences}
            setSelectedPreferences={(preferences) => {
              setSelectedPreferences(preferences);
              setIsChanged(true);
            }}
          />
        </View>
        <View style={tw`mb-[100px]`}>
          <LongBlackButton
            value="Update profile"
            onClick={handleUpdate}
            isDisabled={checkIsDisabled()}
            isLoading={isLoading}
          />
        </View>
      </ScrollWrapper>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    marginTop: 10,
  },
});
