import { useMemo } from "react";
import { screenName } from "constants/screenNames.constants";
import { changePasswsordIcon, getDeleteIcon } from "utils/SvgImages";
import { ProfileMenuItem } from "components/profile/ProfileMenuItems";

type UserType = "gallery" | "artist" | "individual";

export const useProfileMenuOptions = (
  navigation: any,
  userType: UserType
): ProfileMenuItem[] => {
  return useMemo(
    () => [
      {
        name: "Change password",
        subText: "Change the password to your account",
        handlePress: () =>
          navigation.navigate(screenName.gallery.changePassword, {
            routeName: userType,
          }),
        svgIcon: changePasswsordIcon,
      },
      {
        name: "Delete account",
        subText: `Delete your omenai ${
          userType === "gallery" ? "gallery " : ""
        }account`,
        handlePress: () => {
          navigation.navigate(screenName.deleteAccount, {
            routeName: userType,
          });
        },
        svgIcon: getDeleteIcon("#DC2626"),
        variant: "danger" as const,
      },
    ],
    [navigation, userType]
  );
};
