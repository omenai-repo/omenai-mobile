import * as Sentry from '@sentry/react-native';
import { utils_storeAsyncData } from 'utils/utils_asyncStorage';
import { loginAccount } from 'services/login/loginAccount';
import { screenName } from 'constants/screenNames.constants';
import { StackNavigationProp } from '@react-navigation/stack';

interface HandleLoginParams {
  accountType: 'artist' | 'gallery' | 'individual';
  navigation: StackNavigationProp<any>;
  loginData: {
    email: string;
    password: string;
    device_push_token: string;
  };
  setIsLoading: (val: boolean) => void;
  updateModal: (e: updateModalProps) => void;
  setUserSession: (data: any) => void;
  setIsLoggedIn: (val: boolean) => void;
  clearInputs: () => void;
}

export const handleLogin = async ({
  accountType,
  navigation,
  loginData,
  setIsLoading,
  updateModal,
  setUserSession,
  setIsLoggedIn,
  clearInputs,
}: HandleLoginParams) => {
  setIsLoading(true);

  Sentry.addBreadcrumb({
    category: 'auth',
    message: `${accountType} login attempt`,
    level: 'info',
  });

  try {
    const results = await loginAccount({ ...loginData }, accountType);

    if (!results?.isOk) {
      Sentry.setContext(`${accountType}LoginResponse`, {
        body: results?.body ?? null,
        status: results?.isOk ?? null,
      });
      Sentry.captureMessage(`${accountType} loginAccount returned non-ok response`, 'error');

      updateModal({
        message: results?.body?.message ?? 'Login failed',
        showModal: true,
        modalType: 'error',
      });
      return;
    }

    const body = results?.body?.data;
    if (!body) {
      Sentry.captureMessage(`${accountType} login returned ok but missing data`, 'error');
      return;
    }

    if (body.verified === false) {
      Sentry.addBreadcrumb({
        category: 'auth',
        message: `${accountType} unverified - navigating to verifyEmail`,
        level: 'info',
      });

      navigation.navigate(screenName.verifyEmail, {
        account: { id: body[`${accountType}_id`] ?? body.user_id, type: accountType },
      });
      return;
    }

    const id = body[`${accountType}_id`] ?? body.user_id;
    const data = {
      id,
      email: body.email,
      name: body.name,
      role: body.role,
      verified: body.verified,
      ...(accountType === 'artist' && {
        artist_verified: body.artist_verified,
        isOnboardingCompleted: body.isOnboardingCompleted,
        base_currency: body.base_currency,
        walletId: body.wallet_id,
        categorization: body.categorization,
      }),
      ...(accountType === 'gallery' && {
        gallery_verified: body.gallery_verified,
        subscription_active: body.subscription_active,
        description: body.description,
        admin: body.admin,
      }),
      address: body.address,
      phone: body.phone,
      logo: body.logo,
    };

    // Persist session
    const [isStored, isLoginTimeStampStored] = await Promise.all([
      utils_storeAsyncData('userSession', JSON.stringify(data)),
      utils_storeAsyncData('loginTimeStamp', JSON.stringify(new Date())),
    ]);

    if (!isStored || !isLoginTimeStampStored) {
      Sentry.setContext(`${accountType}LoginStorage`, {
        isStored,
        isLoginTimeStampStored,
      });
      Sentry.captureMessage(
        `Failed to persist ${accountType} login session to async storage`,
        'error',
      );
    }

    // Sentry user setup
    const sentryUser = __DEV__
      ? { id: String(data.id), email: data.email, username: data.name }
      : { id: String(data.id) };

    Sentry.setUser(sentryUser);

    setUserSession(data);
    setIsLoggedIn(true);
    clearInputs();

    Sentry.addBreadcrumb({
      category: 'auth',
      message: `${accountType} login succeeded`,
      level: 'info',
    });
  } catch (error: any) {
    Sentry.addBreadcrumb({
      category: 'exception',
      message: `exception during ${accountType} login`,
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
