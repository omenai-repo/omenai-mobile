import { View, Text, Pressable, Modal } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import { warningIconSm } from 'utils/SvgImages';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import LargeInput from 'components/inputs/LargeInput';
import { useModalStore } from 'store/modal/modalStore';
import { declineOrderRequest } from 'services/orders/declineOrderRequest';

const DeclineOrderModal = ({
  isModalVisible,
  setIsModalVisible,
  orderId,
  refresh,
}: {
  isModalVisible: boolean;
  setIsModalVisible: (e: boolean) => void;
  orderId: string;
  refresh: () => void;
}) => {
  const [declineReason, setDeclineReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateModal } = useModalStore();

  const declineOrder = async () => {
    if (!declineReason.trim()) {
      updateModal({
        message: "Reason required', 'Please provide a reason for declining the order.",
        showModal: true,
        modalType: 'error',
      });
      return;
    }

    setLoading(true);
    const res = await declineOrderRequest({
      order_id: orderId,
      data: {
        status: 'declined',
        reason: declineReason,
      },
    });

    setLoading(false);

    if (res.isOk) {
      updateModal({
        message: res.message || 'Order declined successfully',
        showModal: true,
        modalType: 'success',
      });
      setIsModalVisible(false);
      refresh();
      setDeclineReason('');
    } else {
      updateModal({
        message: res.message || 'Failed to decline order',
        showModal: true,
        modalType: 'error',
      });
    }
  };

  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsModalVisible(false)}
    >
      <Pressable
        onPressOut={() => setIsModalVisible(false)}
        style={tw`flex-1 bg-[#0003] justify-center items-center`}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={tw.style(`bg-white p-[30px] border border-[#0000001A] rounded-[14px] w-[80%]`)}
        >
          <LargeInput
            label="Reason for declining order"
            placeHolder="Input reason"
            value={declineReason}
            defaultValue={declineReason}
            onInputChange={(value) => setDeclineReason(value)}
            containerStyle={{
              flex: 0,
            }}
          />

          <Pressable
            onPress={declineOrder}
            disabled={loading}
            style={tw`h-[50px] justify-center items-center ${
              loading ? 'bg-gray-400' : 'bg-[#C71C16]'
            } rounded-[30px] mt-[30px]`}
          >
            <Text style={tw`text-[15px] text-[#fff] font-semibold`}>
              {loading ? 'Declining...' : 'Decline order'}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default DeclineOrderModal;
