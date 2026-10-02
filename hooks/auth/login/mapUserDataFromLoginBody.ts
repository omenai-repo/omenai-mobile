const sanitizeSessionLogo = (logo: unknown): string => {
  if (typeof logo !== "string") return "";

  const trimmed = logo.trim();
  if (!trimmed) return "";

  if (trimmed.toLowerCase().startsWith("blob:")) {
    return "";
  }

  return trimmed;
};

export function mapUserDataFromLoginBody(resultsBody: any, userType: UserType) {
  const baseData = {
    email: resultsBody.email,
    name: resultsBody.name,
    role: resultsBody.role,
    verified: resultsBody.verified,
    address: resultsBody.address,
    phone: resultsBody.phone,
    logo: sanitizeSessionLogo(resultsBody.logo),
  };

  switch (userType) {
    case "individual":
      return {
        ...baseData,
        id: resultsBody.user_id,
        preferences: resultsBody.preferences,
      };
    case "gallery":
      return {
        ...baseData,
        id: resultsBody.gallery_id,
        gallery_verified: resultsBody.gallery_verified,
        description: resultsBody.description,
        admin: resultsBody.admin,
        subscription_active: resultsBody.subscription_active,
      };
    case "artist":
      return {
        ...baseData,
        id: resultsBody.artist_id,
        artist_verified: resultsBody.artist_verified,
        isOnboardingCompleted: resultsBody.isOnboardingCompleted,
        base_currency: resultsBody.base_currency,
        walletId: resultsBody.wallet_id,
        categorization: resultsBody.categorization,
      };
  }
}
