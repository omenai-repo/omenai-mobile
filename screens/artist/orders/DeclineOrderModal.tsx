import { useState } from "react";
import { View, Text, Pressable, Modal, ScrollView } from "react-native";
import tw from "twrnc";
import { useModalStore } from "#store/modal/modalStore";
import { declineOrderRequest } from "#services/orders/declineOrderRequest";
import { Analytics } from "#utils/analytics";
import { useAppStore } from "#store/app/appStore";
import LargeInput from "#components/inputs/LargeInput";

const declineReasonMapping: Record<string, string> = {
  // 1. Artist’s personal attachment
  "I’ve decided to keep this artwork":
    "The artist has decided to retain this piece and it’s no longer available for sale.",

  // 2. Outdated or no longer representative
  "This artwork no longer represents my current work":
    "The artist has chosen to withdraw this piece from sale.",

  // 3. Reserved for an exhibition
  "I need this artwork for an upcoming exhibition or event":
    "The artwork has been reserved for an upcoming exhibition or event.",

  // 7. Already sold elsewhere
  "This artwork has already been sold elsewhere":
    "This artwork has recently been sold and is no longer available.",

  // 8. Damaged or missing
  "The artwork is damaged or missing":
    "This artwork is currently unavailable for purchase.",

  // 10. Under exclusivity or gallery contract
  "This artwork is under an exclusivity or gallery agreement":
    "This artwork is currently under an exclusive arrangement and cannot be sold at this time.",

  // 19. Paused selling
  "I’ve paused selling on Omenai for now":
    "The artist has temporarily paused new orders on the platform.",
};

type OrderModalMetadata = {
  is_current_order_exclusive?: boolean;
  art_id?: string;
  seller_designation?: string;
};

const GalleryDeclineView = ({
  reason,
  setReason,
}: {
  reason: string;
  setReason: (val: string) => void;
}) => (
  <View style={tw`mb-4`}>
    <LargeInput
      label="Provide a reason for declining order request"
      placeHolder="e.g Artwork has been sold"
      value={reason}
      onInputChange={setReason}
      height={100}
      containerStyle={tw`flex-none`}
    />
  </View>
);

const ExclusiveDeclineView = ({
  checked,
  setChecked,
}: {
  checked: boolean;
  setChecked: (val: boolean) => void;
}) => (
  <>
    <Pressable
      onPress={() => setChecked(!checked)}
      style={tw`flex-row items-center gap-[10px] mb-3`}
    >
      <View
        style={tw`h-[20px] w-[20px] rounded-[4px] border border-[#E5E7EB] justify-center items-center ${
          checked ? "bg-[#C71C16]" : ""
        }`}
      >
        <Text style={tw`text-white font-bold`}>✓</Text>
      </View>
      <Text style={tw`text-[14px]`}>Artwork has been sold off platform</Text>
    </Pressable>

    {checked ? (
      <View
        style={tw`bg-red-50 border border-red-200 rounded-[10px] p-[12px] flex-row items-start gap-[8px] mb-2`}
      >
        <View style={tw`mt-[2px]`}>{/* icon placeholder */}</View>
        <View style={tw`flex-1`}>
          <Text style={tw`text-[13px] text-[#B91C1C]`}>
            This artwork is still subject to Omenai's 90-day exclusivity policy.
            In accordance with our Terms of Use, a 10% penalty fee will be
            deducted from your next successful sale on the platform.
          </Text>
        </View>
      </View>
    ) : null}
  </>
);

const StandardDeclineView = ({
  selectedReason,
  toggleReason,
  reasons,
}: {
  selectedReason: string | null;
  toggleReason: (r: string) => void;
  reasons: string[];
}) => (
  <>
    <Text style={tw`text-[13px] text-[#6B7280] mb-3`}>
      Please choose a reason that best explains why you're declining this order.
    </Text>
    <ScrollView style={tw`max-h-[220px] mb-4`}>
      {reasons.map((r) => (
        <Pressable
          key={r}
          onPress={() => toggleReason(r)}
          style={tw`flex-row items-start gap-[10px] mb-4`}
        >
          <View
            style={tw`h-[20px] w-[20px] rounded-[4px] border border-[#E5E7EB] justify-center items-center ${
              selectedReason === r ? "bg-[#C71C16]" : ""
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
          <Text style={tw`font-semibold`}>Client interpretation:</Text>{" "}
          {declineReasonMapping[selectedReason]}
        </Text>
      </View>
    ) : null}
  </>
);

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
  const { userSession, userType } = useAppStore();
  const userId = userSession?.id;

  // for exclusivity checkbox
  const [checked, setChecked] = useState(false);

  // for non-exclusive reasons (single-select)
  const reasons = Object.keys(declineReasonMapping);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  // for gallery reason (text input)
  const [galleryReason, setGalleryReason] = useState("");

  const [loading, setLoading] = useState(false);

  const toggleReason = (r: string) => {
    setSelectedReason((prev) => (prev === r ? null : r));
  };

  const getSubmittedReason = () => {
    if (orderModalMetadata.seller_designation === "gallery") {
      return galleryReason;
    }
    if (orderModalMetadata.is_current_order_exclusive) {
      return checked ? "Artwork is no longer available" : "";
    }
    return selectedReason ? declineReasonMapping[selectedReason] : "";
  };

  const validateExclusiveOrder = () => {
    if (!checked) {
      updateModal({
        message:
          "Please confirm that the artwork has been sold off-platform to proceed.",
        showModal: true,
        modalType: "error",
      });
      return false;
    }
    return true;
  };

  const validateNonExclusiveOrder = () => {
    const reason = getSubmittedReason();
    if (!reason) {
      updateModal({
        message: "Please select a reason for declining this order.",
        showModal: true,
        modalType: "error",
      });
      return false;
    }
    return true;
  };

  const validateGalleryOrder = () => {
    if (!galleryReason.trim()) {
      updateModal({
        message: "Please provide a reason for declining this order.",
        showModal: true,
        modalType: "error",
      });
      return false;
    }
    return true;
  };

  const submitDeclineOrder = async () => {
    const data = {
      status: "declined" as const,
      reason: getSubmittedReason(),
    };

    const seller_designation: "artist" | "gallery" =
      orderModalMetadata.seller_designation === "gallery"
        ? "gallery"
        : "artist";
    const art_id = orderModalMetadata.art_id || "";

    const res = await declineOrderRequest(
      data,
      orderId,
      seller_designation,
      art_id,
    );
    console.log("Decline order response:", res);

    if (res?.isOk) {
      Analytics.track("order_declined", {
        ids: {
          order_id: orderId,
          seller_id: userId,
          art_id,
        },
        reason: data.reason,
        seller_type: userType,
        payload: {
          data,
          orderId,
          seller_designation,
          art_id,
        },
        response: res,
      });
      updateModal({
        message: res.message || "Order declined successfully",
        showModal: true,
        modalType: "success",
      });
      setIsModalVisible(false);
      refresh();
      setChecked(false);
      setSelectedReason(null);
      setGalleryReason("");
    } else {
      Analytics.track("order_decline_failed", {
        ids: {
          order_id: orderId,
          seller_id: userId,
          art_id,
        },
        reason: data.reason,
        seller_type: userType,
        payload: {
          data,
          orderId,
          seller_designation,
          art_id,
        },
        response: res,
      });
      console.log("Decline order failed:", res);
      updateModal({
        message: res?.message || "Failed to decline order",
        showModal: true,
        modalType: "error",
      });
    }
  };

  const handleDecline = async () => {
    let isValid = false;

    if (orderModalMetadata.seller_designation === "gallery") {
      isValid = validateGalleryOrder();
    } else {
      isValid = orderModalMetadata.is_current_order_exclusive
        ? validateExclusiveOrder()
        : validateNonExclusiveOrder();
    }

    if (!isValid) return;

    setLoading(true);
    try {
      await submitDeclineOrder();
    } catch (err: any) {
      updateModal({
        message: err?.message || "Something went wrong. Try again later.",
        showModal: true,
        modalType: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getButtonBackground = () => {
    if (loading) return "bg-gray-300";
    if (orderModalMetadata.seller_designation === "gallery") {
      return galleryReason.trim().length > 0 ? "bg-[#C71C16]" : "bg-[#E5E7E7]";
    }
    if (orderModalMetadata.is_current_order_exclusive) {
      return checked ? "bg-[#C71C16]" : "bg-[#E5E7E7]";
    }
    return selectedReason ? "bg-[#C71C16]" : "bg-[#E5E7E7]";
  };

  const title =
    orderModalMetadata.seller_designation === "gallery"
      ? "Sure to decline this order request?"
      : orderModalMetadata.is_current_order_exclusive
      ? "Select reason for declining this order"
      : "Decline order request";

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
          <Text style={tw`text-[16px] font-semibold mb-4`}>{title}</Text>

          {orderModalMetadata.seller_designation === "gallery" ? (
            <GalleryDeclineView
              reason={galleryReason}
              setReason={setGalleryReason}
            />
          ) : orderModalMetadata.is_current_order_exclusive ? (
            <ExclusiveDeclineView checked={checked} setChecked={setChecked} />
          ) : (
            <StandardDeclineView
              selectedReason={selectedReason}
              toggleReason={toggleReason}
              reasons={reasons}
            />
          )}

          {/* Submit */}
          <Pressable
            onPress={handleDecline}
            disabled={loading}
            style={tw.style(
              `h-[46px] justify-center items-center rounded-[10px] mt-[16px]`,
              getButtonBackground(),
            )}
          >
            <Text style={tw`text-white text-[15px] font-semibold`}>
              {loading ? "Declining..." : "Decline order request"}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default DeclineOrderModal;
