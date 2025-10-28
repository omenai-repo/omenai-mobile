import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import * as Sentry from '@sentry/react-native';
import LongBlackButton from '../../../../components/buttons/LongBlackButton';
import Input from '../../../../components/inputs/Input';
import { useGalleryAuthLoginStore } from 'store/auth/login/GalleryAuthLoginStore';
import PasswordInput from 'components/inputs/PasswordInput';
import WithModal from 'components/modal/WithModal';
import { useAppStore } from 'store/app/appStore';
import { useModalStore } from 'store/modal/modalStore';
import { loginAccount } from 'services/login/loginAccount';
import { utils_storeAsyncData } from 'utils/utils_asyncStorage';
import { screenName } from 'constants/screenNames.constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

export default function Gallery() {
  const { galleryLoginData, setEmail, setPassword, clearInputs, isLoading, setIsLoading } =
    useGalleryAuthLoginStore();
  const { setUserSession, setIsLoggedIn, expoPushToken } = useAppStore();
  const { updateModal } = useModalStore();

  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleSubmit = async () => {
    setIsLoading(true);

    Sentry.addBreadcrumb({
      category: 'auth',
      message: 'gallery login attempt',
      level: 'info',
    });

    try {
      const results = await loginAccount(
        { ...galleryLoginData, device_push_token: expoPushToken ?? '' },
        'gallery',
      );

      if (!results?.isOk) {
        Sentry.setContext('galleryLoginResponse', {
          body: results?.body ?? null,
          status: results?.isOk ?? null,
        });
        Sentry.captureMessage('gallery loginAccount returned non-ok response', 'error');

        updateModal({
          message: results?.body?.message,
          showModal: true,
          modalType: 'error',
        });
        return;
      }

      const resultsBody = results?.body?.data;

      if (resultsBody.verified === false) {
        Sentry.addBreadcrumb({
          category: 'auth',
          message: 'gallery unverified - navigating to verifyEmail',
          level: 'info',
        });

        setIsLoading(false);
        navigation.navigate(screenName.verifyEmail, {
          account: { id: resultsBody.gallery_id, type: 'gallery' },
        });
        return;
      }

      const data = {
        id: resultsBody.gallery_id,
        email: resultsBody.email,
        name: resultsBody.name,
        role: resultsBody.role,
        gallery_verified: resultsBody.gallery_verified,
        description: resultsBody.description,
        verified: resultsBody.verified,
        admin: resultsBody.admin,
        logo: resultsBody.logo,
        subscription_active: resultsBody.subscription_active,
        address: resultsBody.address,
        phone: resultsBody.phone,
      };

      const isStored = await utils_storeAsyncData('userSession', JSON.stringify(data));

      const loginTimeStamp = new Date();
      const isLoginTimeStampStored = await utils_storeAsyncData(
        'loginTimeStamp',
        JSON.stringify(loginTimeStamp),
      );

      if (isStored && isLoginTimeStampStored) {
        if (__DEV__) {
          Sentry.setUser({
            id: String(data.id),
            email: data.email,
            username: data.name,
          });
        } else {
          Sentry.setUser({ id: String(data.id) });
        }

        setUserSession(data);
        setIsLoggedIn(true);
        clearInputs();

        Sentry.addBreadcrumb({
          category: 'auth',
          message: 'gallery login succeeded',
          level: 'info',
        });
      } else {
        Sentry.setContext('galleryLoginStorage', {
          isStored,
          isLoginTimeStampStored,
        });
        Sentry.captureMessage('Failed to persist gallery login session to async storage', 'error');

        if (__DEV__) {
          Sentry.setUser({
            id: String(data.id),
            email: data.email,
            username: data.name,
          });
        } else {
          Sentry.setUser({ id: String(data.id) });
        }

        setUserSession(data);
        setIsLoggedIn(true);
        clearInputs();
      }
    } catch (error: any) {
      Sentry.addBreadcrumb({
        category: 'exception',
        message: 'exception during gallery login',
        level: 'error',
      });
      Sentry.captureException(error);

      updateModal({
        message: error?.message ?? 'An unexpected error occurred. Please try again.',
        showModal: true,
        modalType: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        <View>
          <LongBlackButton
            value={isLoading ? 'Loading ...' : 'Sign In Gallery'}
            isDisabled={galleryLoginData.email && galleryLoginData.password ? false : true}
            isLoading={isLoading}
            onClick={handleSubmit}
          />
        </View>
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
