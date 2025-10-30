import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import LongBlackButton from 'components/buttons/LongBlackButton';
import Input from 'components/inputs/Input';
import PasswordInput from 'components/inputs/PasswordInput';
import WithModal from 'components/modal/WithModal';
import { useGalleryAuthLoginStore } from 'store/auth/login/GalleryAuthLoginStore';
import { useAppStore } from 'store/app/appStore';
import { useModalStore } from 'store/modal/modalStore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { screenName } from 'constants/screenNames.constants';
import { handleLogin } from 'utils/handleLogin';

export default function Gallery() {
  const { galleryLoginData, setEmail, setPassword, clearInputs, isLoading, setIsLoading } =
    useGalleryAuthLoginStore();
  const { setUserSession, setIsLoggedIn, expoPushToken } = useAppStore();
  const { updateModal } = useModalStore();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleSubmit = () =>
    handleLogin({
      accountType: 'gallery',
      navigation,
      loginData: { ...galleryLoginData, device_push_token: expoPushToken ?? '' },
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
            label="Gallery Email address"
            keyboardType="email-address"
            onInputChange={setEmail}
            placeHolder="Enter your gallery email address"
            value={galleryLoginData.email}
          />
          <PasswordInput
            label="Password"
            onInputChange={setPassword}
            placeHolder="Enter password"
            value={galleryLoginData.password}
          />
        </View>
        <LongBlackButton
          value={isLoading ? 'Loading...' : 'Sign In Gallery'}
          isDisabled={!galleryLoginData.email || !galleryLoginData.password}
          isLoading={isLoading}
          onClick={handleSubmit}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate(screenName.forgotPassword, { type: 'gallery' })}
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
