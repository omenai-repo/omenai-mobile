import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';

export const useNotifications = () => {
  const responseListener = useRef<Notifications.EventSubscription>(null);
  const receiveListener = useRef<Notifications.EventSubscription>(null);

  useEffect(() => {
    receiveListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Foreground notification:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification tapped:', response);
      // You can navigate or handle the payload here
    });

    return () => {
      receiveListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);
};
