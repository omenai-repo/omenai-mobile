import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import LongBlackButton from '../../../../components/buttons/LongBlackButton';
import Input from '../../../../components/inputs/Input';
import PasswordInput from 'components/inputs/PasswordInput';
import WithModal from 'components/modal/WithModal';
import { useArtistAuthLoginStore } from 'store/auth/login/ArtistAuthLoginStore';
import { useAppStore } from 'store/app/appStore';
import { useModalStore } from 'store/modal/modalStore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { screenName } from 'constants/screenNames.constants';
import { handleLogin } from 'utils/handleLogin';

export default function Artist() {
  const { artistLoginData, setEmail, setPassword, clearInputs, isLoading, setIsLoading } =
    useArtistAuthLoginStore();
  const { setUserSession, setIsLoggedIn, expoPushToken } = useAppStore();
  const { updateModal } = useModalStore();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleSubmit = () =>
    handleLogin({
      accountType: 'artist',
      navigation,
      loginData: { ...artistLoginData, device_push_token: expoPushToken ?? '' },
      setIsLoading,
      updateModal,
      setUserSession,
      setIsLoggedIn,
      clearInputs,
    });

  return (
    <WithModal>
      <View style={styles.container}>
        <View style={{ gap: 20 }}>
          <Input
            label="Artist Email address"
            keyboardType="email-address"
            onInputChange={setEmail}
            placeHolder="Enter your email address"
            value={artistLoginData.email}
          />
          <PasswordInput
            label="Password"
            onInputChange={setPassword}
            placeHolder="Enter password"
            value={artistLoginData.password}
          />
        </View>
        <LongBlackButton
          value={isLoading ? 'Loading...' : 'Sign In Artist'}
          isDisabled={!artistLoginData.email || !artistLoginData.password}
          isLoading={isLoading}
          onClick={handleSubmit}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate(screenName.forgotPassword, { type: 'artist' })}
        >
          <Text style={styles.resetText}>Forgot password? Click here</Text>
        </TouchableOpacity>
      </View>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    gap: 40,
  },
  resetText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
