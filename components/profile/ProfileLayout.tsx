import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import tw from "twrnc";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "#utils/logout.utils";
import LongBlackButton from "#components/buttons/LongBlackButton";
import FittedBlackButton from "#components/buttons/FittedBlackButton";
import ProfileMenuItems, {
  ProfileMenuItem,
} from "#components/profile/ProfileMenuItems";
import NotificationPermissionPrompt from "#components/profile/NotificationPermissionPrompt";
import { useSafeBottomSpacing } from "#hooks/useSafeBottomSpacing";
import { useNotificationPermission } from "#hooks/useNotificationPermission";
import { useDevice } from "#hooks/useDevice";

type Props = {
  menuItems: ProfileMenuItem[];
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  headerComponent?: React.ReactNode;
};

export default function ProfileLayout({
  menuItems,
  children,
  style,
  headerComponent,
}: Readonly<Props>) {
  const queryClient = useQueryClient();
  const { contentBottomPadding, buttonBottomMargin } = useSafeBottomSpacing();
  const { permissionStatus, requestPermission, openSettings } =
    useNotificationPermission();
  const { isTablet } = useDevice();

  const isNotificationDisabled =
    permissionStatus !== null && permissionStatus !== "granted";

  const handleLogout = () => {
    queryClient.clear();
    logout();
  };

  return (
    <View style={style}>
      {headerComponent}
      {children}

      {/* Notification Permission Prompt */}
      {isNotificationDisabled && (
        <NotificationPermissionPrompt
          permissionStatus={permissionStatus}
          requestPermission={requestPermission}
          openSettings={openSettings}
          style={tw`mx-0`} // Reset margin if needed or control via prop
        />
      )}

      <View
        style={[
          !isNotificationDisabled && tw`pt-10`,
          { paddingBottom: contentBottomPadding },
        ]}
      >
        <ProfileMenuItems items={menuItems} />
      </View>

      <View style={{ marginBottom: buttonBottomMargin }}>
        {isTablet ? (
          <View style={tw`items-start`}>
            <FittedBlackButton
              value="Log Out"
              style={tw`mx-auto px-12`}
              onClick={handleLogout}
            />
          </View>
        ) : (
          <LongBlackButton value="Log Out" onClick={handleLogout} />
        )}
      </View>
    </View>
  );
}
