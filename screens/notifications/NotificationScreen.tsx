import { View, Text, Pressable, FlatList } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import { formatEventDate } from 'utils/utils_formatEventDate';
import NotificationDetailsModal from './NotificationDetailsModal';

const initialNotifications = [
  {
    id: 1,
    title: 'New Artwork Approved',
    body: 'Your artwork “Mother’s Hope” has been approved.',
    date: '2025-08-05T10:00:00Z',
    type: 'approval',
    read: false,
  },
  {
    id: 2,
    title: 'New Withdrawal Request',
    body: 'You requested a withdrawal of ₦50,000.',
    date: '2025-08-04T15:30:00Z',
    type: 'wallet',
    read: true,
  },
  {
    id: 3,
    title: 'Account Verified',
    body: 'Your artist account has been verified. Welcome!',
    date: '2025-08-01T08:20:00Z',
    type: 'system',
    read: true,
  },
];

const NotificationScreen = () => {
  const navigation = useNavigation<any>();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const handlePress = (item: any) => {
    // Mark as read
    setNotifications((prev) => prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)));
    setSelectedNotification(item);
    setModalVisible(true);
  };

  const renderNotificationItem = ({ item }: { item: any }) => {
    const isUnread = !item.read;

    return (
      <Pressable
        onPress={() => handlePress(item)}
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
        <Text style={tw`text-[11px] text-[#999999] mt-[8px]`}>{formatEventDate(item.date)}</Text>
      </Pressable>
    );
  };

  return (
    <View style={tw`flex-1 bg-[#F7F7F7] pt-[60px] android:pt-[40px]`}>
      <BackHeaderTitle title="Notifications" />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotificationItem}
        contentContainerStyle={tw`pt-[20px] pb-[40px]`}
        showsVerticalScrollIndicator={false}
      />
      <NotificationDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        notification={selectedNotification}
      />
    </View>
  );
};

export default NotificationScreen;
