export const emailConfig = {
  gmail: {
    address: process.env.EXPO_PUBLIC_GMAIL_ADDRESS,
    appPassword: process.env.EXPO_PUBLIC_GMAIL_APP_PASS,
  },
  resend: {
    apiKey: process.env.EXPO_PUBLIC_RESEND_API_KEY,
  },
} as const;

export const getEmailService = () => {
  return process.env.EXPO_PUBLIC_ENV === "production" ? "resend" : "gmail";
};

export const getEmailConfig = () => {
  const service = getEmailService();
  return service === "resend" ? emailConfig.resend : emailConfig.gmail;
};
