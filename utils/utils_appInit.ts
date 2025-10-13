import { useAppStore } from '../store/app/appStore';
import { logout } from './logout.utils';
import { utils_getAsyncData } from './utils_asyncStorage';

export const utils_appInit = async () => {
  const userData = await utils_getAsyncData('userSession');
  const loginDate = await utils_getAsyncData('loginTimeStamp');

  if (!loginDate?.value) {
    logout();
    return;
  }

  const isSessionValid = sessionValidator(JSON.parse(loginDate.value));

  if (isSessionValid) {
    if (userData?.value) {
      try {
        const value = JSON.parse(userData.value);
        useAppStore.setState({
          isLoggedIn: true,
          userSession: value,
          userType: value.role,
        });
      } catch (error) {
        console.error('Failed to parse user data:', error);
        logout();
      }
    } else {
      logout();
    }
  } else {
    logout();
  }
};

const sessionValidator = (loginDate: string) => {
  if (!loginDate) return false;

  try {
    const currentDate = new Date();
    const parsedLoginData = new Date(loginDate);

    // Check if date is valid
    if (isNaN(parsedLoginData.getTime())) {
      return false;
    }

    const timeDifference = Math.abs(currentDate.getTime() - parsedLoginData.getTime());
    const oneHour = 60 * 60 * 1000;

    return timeDifference <= oneHour;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
};
