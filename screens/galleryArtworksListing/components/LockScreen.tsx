import { View, Text, TouchableOpacity, ActivityIndicator, useWindowDimensions } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import BackScreenButton from 'components/buttons/BackScreenButton';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { verifyGalleryRequest } from 'services/verify/verifyGalleryRequest';
import WithModal from 'components/modal/WithModal';
import { useModalStore } from 'store/modal/modalStore';
import { useAppStore } from 'store/app/appStore';

export default function LockScreen({ name }: { name: string }) {
  const { height } = useWindowDimensions();
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const { updateModal } = useModalStore();
  const { userType } = useAppStore();

  async function handleRequestGalleryVerification() {
    setLoading(true);
    try {
      const response = await verifyGalleryRequest(name);
      if (!response?.isOk) {
        updateModal({
          message: 'Error sending verification reminder',
          modalType: 'error',
          showModal: true,
        });
      } else {
        updateModal({
          message: 'Verification reminder sent successfully',
          modalType: 'success',
          showModal: true,
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error sending verification reminder:', error);
      updateModal({
        message: 'Error sending verification reminder',
        modalType: 'error',
        showModal: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <WithModal>
      <View style={tw`flex-1 bg-[#fff] pt-[60px] android:pt-[80px] px-[25px]`}>
        <BackScreenButton handleClick={() => navigation.goBack()} />
        <View
          style={tw.style(
            `items-center justify-center bg-neutral-900 mt-10 rounded-2xl px-[30px] py-[40px]`,
            {
              marginTop: height / 5,
            },
          )}
        >
          <Ionicons name="shield" size={35} color="white" />
          <Text style={tw`text-white text-center my-4`}>
            Your account is being verified. An agent will reach out within 24 hours.
          </Text>
          {userType === 'gallery' && (
            <>
              <Text style={tw`text-white text-center mb-4`}>
                To expedite, click <Text style={tw`font-bold`}>'Send Verification Reminder'</Text>{' '}
                below.
              </Text>

              <TouchableOpacity
                style={tw`bg-white px-6 py-3 rounded-full ${loading ? 'opacity-50' : ''}`}
                disabled={loading}
                onPress={handleRequestGalleryVerification}
              >
                {loading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={tw`text-black`}>Send Verification Reminder</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </WithModal>
  );
}
