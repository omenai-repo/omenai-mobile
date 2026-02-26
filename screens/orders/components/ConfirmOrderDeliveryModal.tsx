import {
  View,
  Text,
  Modal,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useState } from "react";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { confirmOrderDelivery } from "#services/orders/confirmOrderDelivery";
import { useModalStore } from "#store/modal/modalStore";
import { useCollectorOrders } from "#hooks/useCollectorOrders";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { Analytics } from "#utils/analytics";
import { useAppStore } from "#store/app/appStore";

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
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const { updateModal } = useModalStore();
  const { invalidate } = useCollectorOrders();
  const userId = useAppStore((state) => state.userSession.id);

  async function confirmDelivery() {
    setLoading(true);
    const response = await confirmOrderDelivery(true, orderId);
    try {
      if (response?.isOk) {
        Analytics.track("order_delivered", {
          order_id: orderId,
          user_id: userId,
          response: response,
        });

        await invalidate();
        updateModal({
          message: response.message,
          modalType: "success",
          showModal: true,
        });
      } else {
        Analytics.track("order_delivery_confirm_failed", {
          order_id: orderId,
          user_id: userId,
          error: (response as any).error,
          message: response.message,
          response: response,
        });

        updateModal({
          message: response.message,
          modalType: "error",
          showModal: true,
        });
      }
    } catch (error: any) {
      Analytics.track("order_delivery_confirm_failed", {
        order_id: orderId,
        user_id: userId,
        error: error,
        message: error.message,
        failure_stage: "exception",
      });

      updateModal({
        message: "Something went wrong, try again or contact support",
        modalType: "success",
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
          style={tw.style(
            `bg-white py-[20px] px-[10px] w-full self-center rounded-md`,
            {
              width: width - 60,
            },
          )}
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
                <Text style={tw`text-sm`}>
                  By confirming you are acknowledging that the artwork has been
                  delivered to you in good condition. If you mistakenly confirm
                  or encounter any issues with your order, please contact
                  customer service immediately, as this action cannot be undone.
                </Text>
              </View>
            </View>

            {/* Action Button */}
            <View style={tw`w-full mt-5 flex flex-row items-center gap-2`}>
              <LongBlackButton
                value="I understand, confirm delivery"
                isLoading={loading}
                onClick={confirmDelivery}
                style={{
                  backgroundColor: loading ? "#E0E0E0" : "#16A34A",
                }}
                textStyle={{ fontSize: 14, fontWeight: "500" }}
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ConfirmOrderDeliveryModal;
