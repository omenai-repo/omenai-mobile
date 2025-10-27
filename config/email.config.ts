import {
  EXPO_PUBLIC_GMAIL_ADDRESS,
  EXPO_PUBLIC_GMAIL_APP_PASS,
  EXPO_PUBLIC_RESEND_API_KEY,
  EXPO_PUBLIC_ENV,
} from '@env';

export const emailConfig = {
  gmail: {
    address: EXPO_PUBLIC_GMAIL_ADDRESS,
    appPassword: EXPO_PUBLIC_GMAIL_APP_PASS,
  },
  resend: {
    apiKey: EXPO_PUBLIC_RESEND_API_KEY,
  },
} as const;

export const getEmailService = () => {
  return EXPO_PUBLIC_ENV === 'production' ? 'resend' : 'gmail';
};

export const getEmailConfig = () => {
  const service = getEmailService();
  return service === 'resend' ? emailConfig.resend : emailConfig.gmail;
};
