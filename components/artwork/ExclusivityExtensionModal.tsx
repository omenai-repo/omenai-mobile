import React, { useState } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import { useModalStore } from "#store/modal/modalStore";
import { extendArtworkExclusivity } from "#services/artworks/extendArtworkExclusivity";

interface ExclusivityExtensionModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly art_id: string;
  readonly onSuccess: () => void;
}

const CheckboxItem = ({
  checked,
  onPress,
  children,
}: {
  checked: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.9}
    style={[
      tw`bg-white border rounded-sm p-3 mb-2`,
      checked ? tw`border-[#1A1A1A] shadow-md` : tw`border-gray-200`,
    ]}
  >
    <View style={tw`flex-row items-start gap-3`}>
      <View style={tw`mt-1`}>
        <View
          style={[
            tw`w-5 h-5 rounded-sm border items-center justify-center`,
            checked ? tw`bg-[#1A1A1A] border-[#1A1A1A]` : tw`border-gray-300`,
          ]}
        >
          {checked && <Text style={tw`text-white`}>✓</Text>}
        </View>
      </View>
      <View style={tw`flex-1`}>{children}</View>
    </View>
  </TouchableOpacity>
);

const StatusIndicator = ({
  checked,
  label,
}: {
  checked: boolean;
  label: string;
}) => (
  <View style={tw`flex-row items-center gap-1`}>
    <Text style={[tw`${checked ? "text-green-600" : "text-gray-400"}`]}>✓</Text>
    <Text style={tw`${checked ? "text-green-600" : "text-gray-400"} font-sans`}>
      {label}
    </Text>
  </View>
);

export default function ExclusivityExtensionModal({
  visible,
  onClose,
  art_id,
  onSuccess,
}: Readonly<ExclusivityExtensionModalProps>) {
  const [acknowledgment, setAcknowledgment] = useState(false);
  const [penaltyConsent, setPenaltyConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updateModal } = useModalStore();

  const isFormValid = acknowledgment && penaltyConsent;

  const handleExtension = async () => {
    if (!isFormValid) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: "Please accept both terms to continue.",
      });
      return;
    }

    setLoading(true);
    try {
      if (!art_id) {
        updateModal({
          showModal: true,
          modalType: "error",
          message: "Invalid artwork ID. Please try again.",
        });
        return;
      }

      const result = await extendArtworkExclusivity(art_id);

      if (!result?.isOk) {
        updateModal({
          showModal: true,
          modalType: "error",
          message:
            result?.message ||
            "Failed to extend exclusivity. Please try again later.",
        });
        return;
      }

      updateModal({
        showModal: true,
        modalType: "success",
        message: "Exclusivity period successfully extended by 90 days.",
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("extendContract error", error);
      updateModal({
        showModal: true,
        modalType: "error",
        message: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!loading) onClose();
      }}
    >
      <View
        style={[
          tw`flex-1 justify-center items-center px-5`,
          { backgroundColor: `${colors.black}80` },
        ]}
      >
        <View style={tw`bg-white rounded-sm p-5 w-full max-w-md`}>
          {/* Header */}
          <View style={tw`mb-3`}>
            <Text style={tw`text-lg text-[#1A1A1A] mb-1 font-sans-bold`}>
              Extend Artwork Exclusivity Contract
            </Text>
            <Text style={tw`text-sm text-[#1A1A1A]/70 font-sans`}>
              Review and accept the terms below to renew your artwork&apos;s
              90-day exclusivity period.
            </Text>
          </View>

          {/* Notice Card */}
          <View
            style={[
              tw`relative rounded-sm p-4 mb-4`,
              { backgroundColor: colors.black_light },
            ]}
          >
            <View
              style={tw`absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16`}
            />
            <View
              style={tw`absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12`}
            />
            <View style={tw`flex-row items-start gap-3`}>
              <View
                style={[
                  tw`w-10 h-10 rounded-sm items-center justify-center`,
                  { backgroundColor: `${colors.white}33` },
                ]}
              >
                <Text style={[tw``, { color: colors.white }]}>i</Text>
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-white mb-1 font-sans-medium`}>
                  Contract Extension
                </Text>
                <Text style={tw`text-sm text-white/90 font-sans`}>
                  This action will renew the 90-day exclusivity period, starting
                  from today.
                </Text>
              </View>
            </View>
          </View>

          {/* Terms Section */}
          <View style={tw`mb-3`}>
            <View style={tw`flex-row items-center gap-3 mb-2`}>
              <View
                style={[
                  tw`w-1 h-5 rounded-full`,
                  { backgroundColor: colors.black_light },
                ]}
              />
              <Text style={tw`text-base font-sans-medium`}>
                Agreement Terms
              </Text>
            </View>

            <CheckboxItem
              checked={acknowledgment}
              onPress={() => setAcknowledgment((v) => !v)}
            >
              <Text style={tw`text-sm font-sans`}>
                I acknowledge that this artwork will be subject to a{" "}
                <Text style={tw`font-sans-bold`}>
                  90-day exclusivity period
                </Text>{" "}
                with Omenai and cannot be sold through external channels during
                this time.
              </Text>
            </CheckboxItem>

            <CheckboxItem
              checked={penaltyConsent}
              onPress={() => setPenaltyConsent((v) => !v)}
            >
              <Text style={tw`text-sm font-sans`}>
                I understand that any breach of this exclusivity agreement will
                result in a{" "}
                <Text style={tw`font-sans-bold`}>10% penalty fee</Text> deducted
                from my next successful sale on the platform.
              </Text>
            </CheckboxItem>
          </View>

          {/* Status Row */}
          <View
            style={tw`flex-row items-center justify-center text-xs text-gray-500 gap-3 mb-3`}
          >
            <StatusIndicator checked={acknowledgment} label="Acknowledged" />
            <Text style={tw`text-gray-300`}>|</Text>
            <StatusIndicator checked={penaltyConsent} label="Penalty Consent" />
          </View>

          {/* Action Button */}
          <View>
            <TouchableOpacity
              disabled={!isFormValid || loading}
              onPress={handleExtension}
              activeOpacity={0.9}
              style={[
                tw`w-full h-11 rounded-sm items-center justify-center`,
                isFormValid && !loading
                  ? { backgroundColor: colors.black }
                  : tw`bg-gray-300`,
              ]}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text
                  style={[
                    tw`font-sans-medium`,
                    {
                      color: colors.white,
                    },
                  ]}
                >
                  Confirm & Extend Contract
                </Text>
              )}
            </TouchableOpacity>

            {!isFormValid && (
              <Text
                style={tw`text-center text-sm text-[#1A1A1A]/70 mt-3 font-sans`}
              >
                Please accept both terms to continue
              </Text>
            )}

            <TouchableOpacity
              disabled={loading}
              onPress={() => !loading && onClose()}
              style={tw`mt-3 items-center`}
            >
              <Text style={tw`text-sm text-[#1A1A1A]/70 font-sans-medium`}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
