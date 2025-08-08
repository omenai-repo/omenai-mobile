import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { formatEventDate } from 'utils/utils_formatEventDate';

type NotificationDetailsModalProps = {
  visible: boolean;
  onClose: () => void;
  notification: {
    title: string;
    body: string;
    sentAt: string;
  } | null;
};

const NotificationDetailsModal = ({
  visible,
  onClose,
  notification,
}: NotificationDetailsModalProps) => {
  if (!notification) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={tw`flex-1 bg-black bg-opacity-40 justify-center items-center px-[20px]`}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={tw`w-full max-w-[400px]`}
          >
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={tw`bg-white rounded-[20px] p-[20px] shadow-lg`}>
                {/* Close Button */}
                <TouchableOpacity
                  onPress={onClose}
                  style={tw`absolute top-[10px] right-[10px] z-10 p-[4px]`}
                >
                  <Ionicons name="close" size={22} color="#1A1A1A" />
                </TouchableOpacity>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={tw`pt-[10px] pb-[10px]`}
                >
                  <Text style={tw`text-[18px] font-bold text-[#1A1A1A] mb-[10px]`}>
                    {notification.title}
                  </Text>

                  <Text style={tw`text-[13px] text-[#999] mb-[15px]`}>
                    {formatEventDate(notification.sentAt)}
                  </Text>

                  <Text style={tw`text-[15px] text-[#3D3D3D] leading-[22px]`}>
                    {notification.body}
                  </Text>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default NotificationDetailsModal;
