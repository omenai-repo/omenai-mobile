import { View, Text, Modal, Pressable, useWindowDimensions, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import loaderAnimation from 'assets/other/loader-animation.json';
import { confirmOrderDelivery } from 'services/orders/confirmOrderDelivery';
import { useModalStore } from 'store/modal/modalStore';
import { useOrderStore } from 'store/orders/Orders';

type ConfirmDeliveryProps = {
  orderId: string;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

const ConfirmOrderDeliveryModal = ({
  orderId,
  modalVisible,
  setModalVisible,
}: ConfirmDeliveryProps) => {
  const { width, height } = useWindowDimensions();
  const animation = useRef(null);
  const [loading, setLoading] = useState(false);
  const { updateModal } = useModalStore();
  const { setRefreshTrigger, refreshTrigger } = useOrderStore();

  async function confirmDelivery() {
    setLoading(true);
    const response = await confirmOrderDelivery(true, orderId);
    try {
      if (!response?.isOk) {
        updateModal({
          message: response.message,
          modalType: 'error',
          showModal: true,
        });
      } else {
        updateModal({
          message: response.message,
          modalType: 'success',
          showModal: true,
        });
        setRefreshTrigger(refreshTrigger + 1);
      }
    } catch (error) {
      updateModal({
        message: 'Something went wrong, try again or contact support',
        modalType: 'success',
        showModal: true,
      });
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(!modalVisible)}
    >
      <Pressable
        onPressOut={() => setModalVisible(false)}
        style={tw`flex-1 bg-[#0003] justify-center items-center`}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={tw.style(`bg-white py-[20px] px-[10px] w-full self-center rounded-[16px]`, {
            width: width - 60,
          })}
        >
          <View style={tw`p-4`}>
            {/* Title */}
            <Text style={tw`text-[16px] font-semibold mb-4 text-black`}>
              Confirm order delivery
            </Text>

            {/* Content Box */}
            <View style={tw`flex flex-col gap-4`}>
              <View style={tw`bg-[#fafafa] p-5 flex flex-col gap-3`}>
                {/* Icon Row */}
                <View style={tw`flex flex-row items-center gap-2`}>
                  <Ionicons name="warning-outline" size={25} color="#FFA500" />
                </View>
                {/* Info Text */}
                <Text style={tw`text-[13px]`}>
                  By confirming you are acknowledging that the artwork has been delivered to you in
                  good condition. If you mistakenly confirm or encounter any issues with your order,
                  please contact customer service immediately, as this action cannot be undone.
                </Text>
              </View>
            </View>

            {/* Action Button */}
            <View style={tw`w-full mt-5 flex flex-row items-center gap-2`}>
              <TouchableOpacity
                disabled={loading}
                onPress={confirmDelivery}
                style={[
                  tw`h-[45px] rounded-[20px] px-4 w-full items-center justify-center`,
                  loading ? tw`bg-[#E0E0E0]` : tw`bg-green-600`,
                ]}
              >
                {loading ? (
                  <LottieView
                    autoPlay
                    ref={animation}
                    style={{
                      width: 100,
                      height: 100,
                    }}
                    source={loaderAnimation}
                  />
                ) : (
                  <Text style={tw`text-[14px] font-medium text-white`}>
                    I understand, confirm delivery
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ConfirmOrderDeliveryModal;
