import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import * as Sentry from '@sentry/react-native';
import { useIndividualAuthLoginStore } from '../../../../store/auth/login/IndividualAuthLoginStore';
import PasswordInput from '../../../../components/inputs/PasswordInput';
import Input from '../../../../components/inputs/Input';
import LongBlackButton from '../../../../components/buttons/LongBlackButton';
import { loginAccount } from '../../../../services/login/loginAccount';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { screenName } from '../../../../constants/screenNames.constants';
import { utils_storeAsyncData } from 'utils/utils_asyncStorage';
import { useAppStore } from 'store/app/appStore';
import { useModalStore } from 'store/modal/modalStore';

export default function Individual() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { individualLoginData, setEmail, setPassword, clearInputs, isLoading, setIsLoading } =
    useIndividualAuthLoginStore();
  const { setUserSession, setIsLoggedIn, expoPushToken } = useAppStore();
  const { updateModal } = useModalStore();

  const handleSubmit = async () => {
    setIsLoading(true);

    Sentry.addBreadcrumb({
      category: 'auth',
      message: 'collector login attempt',
      level: 'info',
    });

    try {
      const results = await loginAccount(
        { ...individualLoginData, device_push_token: expoPushToken ?? '' },
        'individual',
      );

      if (!results?.isOk) {
        Sentry.setContext('loginAccountResponse', {
          body: results?.body ?? null,
          status: results?.isOk ?? null,
        });
        Sentry.captureMessage('loginAccount returned non-ok response', 'error');

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
          message: 'user unverified - navigating to verifyEmail',
          level: 'info',
        });

        setIsLoading(false);
        navigation.navigate(screenName.verifyEmail, {
          account: { id: resultsBody.user_id, type: 'individual' },
        });
        return;
      }

      const data = {
        id: resultsBody.user_id,
        email: resultsBody.email,
        name: resultsBody.name,
        role: resultsBody.role,
        preferences: resultsBody.preferences,
        verified: resultsBody.verified,
        address: resultsBody.address,
        phone: resultsBody.phone,
        logo: resultsBody.logo,
      };

      // Store session
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
          message: 'collector login succeeded',
          level: 'info',
        });
      } else {
        Sentry.setContext('loginStorage', {
          isStored,
          isLoginTimeStampStored,
        });
        Sentry.captureMessage('Failed to persist login session to async storage', 'error');

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
        message: 'exception during individual login',
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
    <View style={styles.container}>
      <View style={{ gap: 20 }}>
        <Input
          label="Email address"
          keyboardType="email-address"
          onInputChange={setEmail}
          placeHolder="Enter your email address"
          value={individualLoginData.email}
        />
        <PasswordInput
          label="Password"
          onInputChange={setPassword}
          placeHolder="Enter password"
          value={individualLoginData.password}
        />
      </View>
      <View style={{ gap: 40 }}>
        <LongBlackButton
          value={isLoading ? 'Loading...' : 'Log In'}
          isDisabled={individualLoginData.email && individualLoginData.password ? false : true}
          onClick={handleSubmit}
          isLoading={isLoading}
        />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(screenName.forgotPassword, {
              type: 'individual',
            })
          }
        >
          <Text style={styles.resetText}>Forgot password? Click here</Text>
        </TouchableOpacity>
      </View>
    </View>
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
