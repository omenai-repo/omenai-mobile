import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import { formatEventDate } from 'utils/utils_formatEventDate';
import NotificationDetailsModal from './NotificationDetailsModal';
import { useAppStore } from 'store/app/appStore';
import { getNotificationHistory } from 'services/notification/getNotificationHistory';
import { updateNotification } from 'services/notification/updateNotification';
import SkeletonLoaderContainer from './SkeletonLoaderContainer';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

type Notification = {
  id: string;
  title: string;
  body: string;
  sentAt: string;
  type: string;
  read: boolean;
  readAt?: string;
};

type Props = {
  item: Notification;
  index: number;
  onPress: () => void;
};

const AnimatedNotificationItem = ({ item, index, onPress }: Props) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(
      index * 100,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) }),
    );
    translateY.value = withDelay(
      index * 100,
      withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) }),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const isUnread = !item.read;

  return (
    <Animated.View style={[animatedStyle]}>
      <Pressable
        onPress={onPress}
        style={tw.style(
          `border border-[#00000033] rounded-[20px] px-[20px] py-[15px] mx-[20px] mb-[15px]`,
          isUnread ? `bg-[#E6F0FF]` : `bg-white`,
        )}
      >
        <View style={tw`flex-row justify-between items-center`}>
          <Text
            style={tw.style(
              `text-[15px]`,
              isUnread ? `font-extrabold text-[#1A1A1A]` : `font-semibold text-[#3D3D3D]`,
            )}
          >
            {item.title}
          </Text>
          {isUnread && <View style={tw`w-[8px] h-[8px] bg-[#007AFF] rounded-full`} />}
        </View>

        <Text numberOfLines={2} style={tw`text-[13px] text-[#3D3D3D] mt-[5px]`}>
          {item.body}
        </Text>
        <Text style={tw`text-[11px] text-[#999999] mt-[8px]`}>{formatEventDate(item.sentAt)}</Text>
      </Pressable>
    </Animated.View>
  );
};

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userType } = useAppStore();

  const fetchNotifications = async () => {
    try {
      const response = await getNotificationHistory({
        access_type: userType === 'user' ? 'collector' : userType,
      });
      setNotifications(response?.data ?? []);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, []);

  const handlePress = async (item: Notification) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === item.id ? { ...n, read: true, readAt: new Date().toISOString() } : n,
      ),
    );
    setSelectedNotification(item);
    setModalVisible(true);

    try {
      await updateNotification({
        read: true,
        readAt: new Date(),
        access_type: userType === 'user' ? 'collector' : userType,
        notification_id: item.id,
      });
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const renderNotificationItem = ({ item, index }: { item: Notification; index: number }) => (
    <AnimatedNotificationItem item={item} index={index} onPress={() => handlePress(item)} />
  );

  const renderEmptyComponent = () => {
    if (loading) return null;

    return (
      <View style={tw`flex-1 justify-center items-center mt-[100px] px-[100px]`}>
        <Image
          source={require('../../assets/icons/empty-artworks.png')}
          style={tw`w-[120px] h-[120px] mb-4`}
          resizeMode="contain"
        />
        <Text style={tw`text-center text-[#3D3D3D] font-semibold text-[16px] mb-2`}>
          No Notifications
        </Text>
        <Text style={tw`text-center text-[#999] text-[13px]`}>
          You don’t have any notifications right now. We’ll keep you posted!
        </Text>
      </View>
    );
  };

  return (
    <View style={tw`flex-1 bg-[#F7F7F7] pt-[60px] android:pt-[40px]`}>
      <BackHeaderTitle title="Notifications" />

      {loading ? (
        <SkeletonLoaderContainer count={8} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => renderNotificationItem({ item, index })}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={tw`pt-[20px] pb-[40px]`}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />
          }
        />
      )}

      <NotificationDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        notification={selectedNotification}
      />
    </View>
  );
};

export default NotificationScreen;
