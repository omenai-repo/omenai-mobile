import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import * as Sentry from '@sentry/react-native';
import LongBlackButton from '../../../../components/buttons/LongBlackButton';
import Input from '../../../../components/inputs/Input';
import { useArtistAuthLoginStore } from 'store/auth/login/ArtistAuthLoginStore';
import PasswordInput from 'components/inputs/PasswordInput';
import WithModal from 'components/modal/WithModal';
import { useAppStore } from 'store/app/appStore';
import { useModalStore } from 'store/modal/modalStore';
import { loginAccount } from 'services/login/loginAccount';
import { utils_storeAsyncData } from 'utils/utils_asyncStorage';
import { screenName } from 'constants/screenNames.constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

export default function Artist() {
  const { artistLoginData, setEmail, setPassword, clearInputs, isLoading, setIsLoading } =
    useArtistAuthLoginStore();
  const { setUserSession, setIsLoggedIn, expoPushToken } = useAppStore();
  const { updateModal } = useModalStore();

  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleSubmit = async () => {
    setIsLoading(true);

    Sentry.addBreadcrumb({
      category: 'auth',
      message: 'artist login attempt',
      level: 'info',
    });

    try {
      const results = await loginAccount(
        { ...artistLoginData, device_push_token: expoPushToken ?? '' },
        'artist',
      );

      if (!results?.isOk) {
        Sentry.setContext('artistLoginResponse', {
          body: results?.body ?? null,
          status: results?.isOk ?? null,
        });
        Sentry.captureMessage('artist loginAccount returned non-ok response', 'error');

        updateModal({
          message: results?.body?.message,
          showModal: true,
          modalType: 'error',
        });
        return;
      }

      const resultsBody = results?.body?.data;

      if (!resultsBody) {
        Sentry.setContext('artistLoginMissingBody', { response: results });
        Sentry.captureMessage('artist login returned ok but missing body.data', 'error');
        setIsLoading(false);
        return;
      }

      const isVerified = Boolean(resultsBody.verified);

      if (!isVerified) {
        Sentry.addBreadcrumb({
          category: 'auth',
          message: 'artist unverified - navigating to verifyEmail',
          level: 'info',
        });

        setIsLoading(false);
        navigation.navigate(screenName.verifyEmail, {
          account: { id: resultsBody.artist_id, type: 'artist' },
        });
        return;
      }

      const data = {
        id: resultsBody.artist_id,
        email: resultsBody.email,
        name: resultsBody.name,
        role: resultsBody.role,
        artist_verified: resultsBody.artist_verified,
        verified: resultsBody.verified,
        isOnboardingCompleted: resultsBody.isOnboardingCompleted,
        address: resultsBody.address,
        base_currency: resultsBody.base_currency,
        walletId: resultsBody.wallet_id,
        categorization: resultsBody.categorization,
        logo: resultsBody.logo,
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
          message: 'artist login succeeded',
          level: 'info',
        });
      } else {
        Sentry.setContext('artistLoginStorage', {
          isStored,
          isLoginTimeStampStored,
        });
        Sentry.captureMessage('Failed to persist artist login session to async storage', 'error');

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
        message: 'exception during artist login',
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
        <View>
          <LongBlackButton
            value={isLoading ? 'Loading ...' : 'Sign In Artist'}
            isDisabled={artistLoginData.email && artistLoginData.password ? false : true}
            isLoading={isLoading}
            onClick={handleSubmit}
          />
        </View>
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
