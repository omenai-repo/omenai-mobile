import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import * as Sentry from '@sentry/react-native';
import tw from 'twrnc';
import { useModalStore } from 'store/modal/modalStore';
import { declineOrderRequest } from 'services/orders/declineOrderRequest';

const declineReasonMapping: Record<string, string> = {
  // 1. Artist’s personal attachment
  'I’ve decided to keep this artwork':
    'The artist has decided to retain this piece and it’s no longer available for sale.',

  // 2. Outdated or no longer representative
  'This artwork no longer represents my current work':
    'The artist has chosen to withdraw this piece from sale.',

  // 3. Reserved for an exhibition
  'I need this artwork for an upcoming exhibition or event':
    'The artwork has been reserved for an upcoming exhibition or event.',

  // 7. Already sold elsewhere
  'This artwork has already been sold elsewhere':
    'This artwork has recently been sold and is no longer available.',

  // 8. Damaged or missing
  'The artwork is damaged or missing': 'This artwork is currently unavailable for purchase.',

  // 10. Under exclusivity or gallery contract
  'This artwork is under an exclusivity or gallery agreement':
    'This artwork is currently under an exclusive arrangement and cannot be sold at this time.',

  // 19. Paused selling
  'I’ve paused selling on Omenai for now':
    'The artist has temporarily paused new orders on the platform.',
};

type OrderModalMetadata = {
  is_current_order_exclusive?: boolean;
  art_id?: string;
  seller_designation?: string;
};

const DeclineOrderModal = ({
  isModalVisible,
  setIsModalVisible,
  orderId,
  refresh,
  orderModalMetadata = {},
}: {
  isModalVisible: boolean;
  setIsModalVisible: (v: boolean) => void;
  orderId: string;
  refresh: () => void;
  orderModalMetadata?: OrderModalMetadata;
}) => {
  const { updateModal } = useModalStore();

  // for exclusivity checkbox
  const [checked, setChecked] = useState(false);

  // for non-exclusive reasons (single-select)
  const reasons = Object.keys(declineReasonMapping);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const toggleReason = (r: string) => {
    setSelectedReason((prev) => (prev === r ? null : r));
  };

  const getSubmittedReason = () => {
    if (orderModalMetadata.is_current_order_exclusive) {
      // when exclusive & checkbox checked we override reason
      return checked ? 'Artwork is no longer available' : '';
    }
    return selectedReason ? declineReasonMapping[selectedReason] : '';
  };

  useEffect(() => {
    if (isModalVisible) {
      Sentry.addBreadcrumb({
        category: 'ui.modal',
        message: 'DeclineOrderModal opened',
        level: 'info',
      });
    }
  }, [isModalVisible]);

  const handleDecline = async () => {
    // Validation
    if (orderModalMetadata.is_current_order_exclusive) {
      if (!checked) {
        updateModal({
          message: 'Please confirm that the artwork has been sold off-platform to proceed.',
          showModal: true,
          modalType: 'error',
        });
        return;
      }
    } else {
      const reason = getSubmittedReason();
      if (!reason) {
        updateModal({
          message: 'Please select a reason for declining this order.',
          showModal: true,
          modalType: 'error',
        });
        return;
      }
    }

    setLoading(true);

    Sentry.addBreadcrumb({
      category: 'user.action',
      message: 'User confirmed decline order',
      level: 'info',
    });

    try {
      const data = {
        status: 'declined' as 'declined',
        reason: getSubmittedReason(),
      };
      const seller_designation: 'artist' | 'gallery' =
        orderModalMetadata.seller_designation === 'gallery' ? 'gallery' : 'artist';
      const art_id = orderModalMetadata.art_id || '';

      Sentry.setContext('declineOrderRequest', {
        payload: data,
        orderId,
        seller_designation,
        art_id,
      });

      const res = await declineOrderRequest(data, orderId, seller_designation, art_id);

      setLoading(false);

      if (res?.isOk) {
        Sentry.addBreadcrumb({
          category: 'network',
          message: `declineOrderRequest succeeded for order ${orderId}`,
          level: 'info',
        });

        updateModal({
          message: res.message || 'Order declined successfully',
          showModal: true,
          modalType: 'success',
        });
        setIsModalVisible(false);
        refresh();
        // reset internal state
        setChecked(false);
        setSelectedReason(null);
      } else {
        Sentry.setContext('declineOrderResponse', { response: res, orderId });
        Sentry.captureMessage(`declineOrderRequest returned non-ok for order ${orderId}`, 'error');

        updateModal({
          message: res?.message || 'Failed to decline order',
          showModal: true,
          modalType: 'error',
        });
      }
    } catch (err: any) {
      setLoading(false);

      Sentry.addBreadcrumb({
        category: 'exception',
        message: 'declineOrderRequest threw exception',
        level: 'error',
      });
      Sentry.setContext('declineOrderCatch', { orderId, metadata: orderModalMetadata });
      Sentry.captureException(err);

      updateModal({
        message: err?.message || 'Something went wrong. Try again later.',
        showModal: true,
        modalType: 'error',
      });
    }
  };

  return (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setIsModalVisible(false)}
    >
      <Pressable
        onPressOut={() => setIsModalVisible(false)}
        style={tw`flex-1 bg-[#0003] justify-center items-center`}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={tw`bg-white p-[20px] rounded-[14px] w-[90%] max-h-[80%]`}
        >
          <Text style={tw`text-[16px] font-semibold mb-4`}>
            {orderModalMetadata.is_current_order_exclusive
              ? 'Select reason for declining this order'
              : 'Decline order request'}
          </Text>

          {orderModalMetadata.is_current_order_exclusive ? (
            <>
              <Pressable
                onPress={() => setChecked(!checked)}
                style={tw`flex-row items-center gap-[10px] mb-3`}
              >
                <View
                  style={tw`h-[20px] w-[20px] rounded-[4px] border border-[#E5E7EB] justify-center items-center ${
                    checked ? 'bg-[#C71C16]' : ''
                  }`}
                >
                  <Text style={tw`text-white font-bold`}>✓</Text>
                </View>
                <Text style={tw`text-[14px]`}>Artwork has been sold off platform</Text>
              </Pressable>

              {/* Collapsible warning */}
              {checked ? (
                <View
                  style={tw`bg-red-50 border border-red-200 rounded-[10px] p-[12px] flex-row items-start gap-[8px] mb-2`}
                >
                  <View style={tw`mt-[2px]`}>{/* icon placeholder */}</View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-[13px] text-[#B91C1C]`}>
                      This artwork is still subject to Omenai's 90-day exclusivity policy. In
                      accordance with our Terms of Use, a 10% penalty fee will be deducted from your
                      next successful sale on the platform.
                    </Text>
                  </View>
                </View>
              ) : null}
            </>
          ) : (
            <>
              <Text style={tw`text-[13px] text-[#6B7280] mb-3`}>
                Please choose a reason that best explains why you're declining this order.
              </Text>
              <ScrollView style={tw`max-h-[220px] mb-4`}>
                {reasons.map((r, idx) => (
                  <Pressable
                    key={idx}
                    onPress={() => toggleReason(r)}
                    style={tw`flex-row items-start gap-[10px] mb-4`}
                  >
                    <View
                      style={tw`h-[20px] w-[20px] rounded-[4px] border border-[#E5E7EB] justify-center items-center ${
                        selectedReason === r ? 'bg-[#C71C16]' : ''
                      }`}
                    >
                      <Text style={tw`text-white font-bold`}>✓</Text>
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-[14px]`}>{r}</Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>

              {selectedReason ? (
                <View style={tw`p-[10px] bg-red-50 border border-red-100 rounded-[8px]`}>
                  <Text style={tw`text-[13px] text-[#B91C1C]`}>
                    <Text style={tw`font-semibold`}>Client interpretation:</Text>{' '}
                    {declineReasonMapping[selectedReason]}
                  </Text>
                </View>
              ) : null}
            </>
          )}

          {/* Submit */}
          <Pressable
            onPress={handleDecline}
            disabled={loading}
            style={tw.style(
              `h-[46px] justify-center items-center rounded-[10px] mt-[16px]`,
              loading
                ? 'bg-gray-300'
                : orderModalMetadata.is_current_order_exclusive
                ? checked
                  ? 'bg-[#C71C16]'
                  : 'bg-[#E5E7E7]'
                : selectedReason
                ? 'bg-[#C71C16]'
                : 'bg-[#E5E7E7]',
            )}
          >
            <Text style={tw`text-white text-[15px] font-semibold`}>
              {loading ? 'Declining...' : 'Decline order request'}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default DeclineOrderModal;
