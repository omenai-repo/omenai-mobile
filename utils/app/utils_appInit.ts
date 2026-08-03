import { useAppStore } from "#store/app/appStore";
import { logout } from "#utils/auth/logout.utils";
import { getSecureItem } from "#utils/auth/secureStore";
import { utils_getAsyncData, utils_storeAsyncData } from "#utils/app/utils_asyncStorage";
import { apiRequest } from "#utils/network/apiRequest";
import { apiUrl } from "#constants/apiUrl.constants";

const sanitizeSessionLogo = (logo: unknown): string => {
  if (typeof logo !== "string") return "";

  const trimmed = logo.trim();
  if (!trimmed) return "";

  // blob: urls are ephemeral and cannot be restored from persisted storage.
  if (trimmed.toLowerCase().startsWith("blob:")) {
    return "";
  }

  return trimmed;
};

const sanitizePersistedSession = (session: any) => {
  if (!session || typeof session !== "object") return session;

  return {
    ...session,
    logo: sanitizeSessionLogo(session.logo),
  };
};

export const utils_appInit = async () => {
  const token = await getSecureItem("session_token");
  if (!token) {
    await logout();
    return;
  }

  const userData = await utils_getAsyncData("userSession");
  const loginDate = await utils_getAsyncData("loginTimeStamp");

  if (!loginDate?.value) {
    await logout();
    return;
  }

  const isSessionValid = sessionValidator(JSON.parse(loginDate.value));

  if (isSessionValid) {
    if (userData?.value) {
      try {
        const value = sanitizePersistedSession(JSON.parse(userData.value));
        useAppStore.setState({
          isLoggedIn: true,
          userSession: value,
          userType: value.role === "individual" ? "user" : value.role,
        });

        // Sync with API in background
        apiRequest(`${apiUrl}/api/auth/session/user`)
          .then(async (res) => {
            console.log(JSON.stringify(res, null, 2));
            if (res.ok) {
              const { user } = await res.json();
              if (user && user.userData) {
                const updatedSession = sanitizePersistedSession({
                  ...value,
                  ...user.userData,
                  id: user.userId || value.id,
                });
                console.log(updatedSession);
                useAppStore.setState({ userSession: updatedSession });
                await utils_storeAsyncData(
                  "userSession",
                  JSON.stringify(updatedSession),
                );
              }
            }
          })
          .catch((err) => {
            console.error("Failed to sync profile on app load:", err);
          });
      } catch (error) {
        console.error("Failed to parse user data:", error);
        await logout();
      }
    } else {
      await logout();
    }
  } else {
    await logout();
  }
};

const sessionValidator = (loginDate: string) => {
  if (!loginDate) return false;

  try {
    const currentDate = new Date();
    const parsedLoginData = new Date(loginDate);

    // Check if date is valid
    if (Number.isNaN(parsedLoginData.getTime())) {
      return false;
    }

    const timeDifference = Math.abs(
      currentDate.getTime() - parsedLoginData.getTime(),
    );
    const oneHour = 60 * 60 * 1000;

    return timeDifference <= oneHour;
  } catch (error) {
    console.error("Session validation error:", error);
    return false;
  }
};
