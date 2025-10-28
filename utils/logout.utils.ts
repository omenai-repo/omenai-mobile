import * as Sentry from '@sentry/react-native';
import { useAppStore } from '../store/app/appStore';
import { utils_clearLocalStorage } from './utils_asyncStorage';

export const logout = async () => {
  try {
    Sentry.addBreadcrumb({
      category: 'auth',
      message: 'User logout initiated',
      level: 'info',
    });

    await utils_clearLocalStorage();

    useAppStore.setState({ isLoggedIn: false, userSession: null });
    Sentry.setUser(null);

    Sentry.addBreadcrumb({
      category: 'auth',
      message: 'User logout completed',
      level: 'info',
    });
  } catch (error: any) {
    Sentry.captureException(error);
  }
};
