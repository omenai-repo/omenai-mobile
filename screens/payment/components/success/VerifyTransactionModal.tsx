import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
  Platform,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import tw from "twrnc";
import { Feather } from "@expo/vector-icons";
import {
  apiUrl,
  authorization,
  originHeader,
  userAgent,
} from "constants/apiUrl.constants";

interface VerifyTransactionModalProps {
  readonly visible: boolean;
  readonly transactionId?: string | null;
  readonly onGoToDashboard?: () => void;
  readonly onGoHome?: () => void;
  readonly onDismiss?: () => void;
}

type VerifyResponse = {
  isOk: boolean;
  message?: string;
  status?: "completed" | "pending" | "failed";
  success?: boolean;
};

const cardAnimConfig = {
  toValue: 1,
  duration: 320,
  useNativeDriver: true,
  easing: Easing.out(Easing.cubic),
} as const;

export default function VerifyTransactionModal(
  props: VerifyTransactionModalProps
) {
  const { visible, transactionId, onGoHome, onGoToDashboard, onDismiss } =
    props;

  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState<VerifyResponse | null>(null);

  // simple enter animation
  const scale = useRef(new Animated.Value(0.95)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const statusColors = useMemo(() => {
    if (!verified?.isOk)
      return { ring: "#ef4444", bg: "#fee2e2", text: "#b91c1c" }; // red
    switch (verified?.status) {
      case "completed":
        return { ring: "#22c55e", bg: "#dcfce7", text: "#166534" }; // green
      case "pending":
        return { ring: "#f59e0b", bg: "#fef3c7", text: "#92400e" }; // amber
      case "failed":
      default:
        return { ring: "#ef4444", bg: "#fee2e2", text: "#b91c1c" }; // red
    }
  }, [verified]);

  function getPaymentStatusText(verified: VerifyResponse | null): string {
    if (verified?.success) return "Payment Verified!";
    switch (verified?.status) {
      case "pending":
        return "Payment Pending";
      case "completed":
        return "Payment Verified!";
      case "failed":
      default:
        return "Payment Verification Failed";
    }
  }

  useEffect(() => {
    if (!visible) return;

    // reset state + animate in
    setVerified(null);
    setLoading(true);
    Animated.parallel([
      Animated.timing(scale, { ...cardAnimConfig, toValue: 1 }),
      Animated.timing(opacity, { ...cardAnimConfig, toValue: 1 }),
    ]).start();

    // verify
    const run = async () => {
      try {
        if (!transactionId) throw new Error("Missing transaction id");
        const res = await fetch(
          `${apiUrl}/api/transactions/verify_FLW_transaction`,
          {
            method: "POST",
            headers: {
              Origin: originHeader,
              "User-Agent": userAgent,
              Authorization: authorization,
            },
            body: JSON.stringify({ transaction_id: transactionId }),
          }
        );

        if (!res.ok) {
          setVerified({
            isOk: false,
            message: "Could not verify your payment at the moment.",
          });
          return;
        }

        const result = await res.json();
        setVerified({
          isOk: !!result?.ok,
          message: result?.message,
          status: result?.status,
          success: result?.success,
        });
      } catch {
        setVerified({
          isOk: false,
          message: "Network error while verifying payment.",
        });
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [visible, transactionId, scale, opacity]);

  const Icon = () => {
    if (!verified?.isOk)
      return <Feather name="x-circle" size={48} color={statusColors.text} />;
    if (verified.status === "completed")
      return (
        <Feather name="check-circle" size={48} color={statusColors.text} />
      );
    if (verified.status === "pending")
      return <Feather name="clock" size={48} color={statusColors.text} />;
    return <Feather name="x-circle" size={48} color={statusColors.text} />;
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onDismiss}
    >
      {/* Dimmed backdrop */}
      <View style={tw`flex-1 bg-[#00000066] justify-center items-center px-5`}>
        <Animated.View
          style={[
            tw`w-full max-w-[360px] rounded-3xl p-6`,
            {
              backgroundColor: "#FFFFFFE6",
              transform: [{ scale }],
              opacity,
              ...(Platform.OS === "android"
                ? { elevation: 4 }
                : {
                    shadowColor: "#000",
                    shadowOpacity: 0.12,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 6 },
                  }),
            },
          ]}
        >
          {/* Header / Loader */}
          {loading ? (
            <View style={tw`items-center justify-center py-6`}>
              <View style={tw`mb-5`}>
                {/* concentric loader vibe */}
                <View
                  style={tw`w-16 h-16 rounded-full border-4 border-blue-200`}
                />
                <View
                  style={tw`absolute w-16 h-16 rounded-full border-4 border-transparent border-t-blue-500`}
                />
              </View>
              <Text style={tw`text-base font-semibold text-blue-700`}>
                Verifying Transaction
              </Text>
              <Text style={tw`text-xs text-gray-600 mt-1`}>
                Please wait while we confirm your payment…
              </Text>
              <ActivityIndicator style={tw`mt-5`} />
            </View>
          ) : (
            <View style={tw`items-center`}>
              {/* Status Icon + subtle ring */}
              <View
                style={[
                  tw`w-20 h-20 rounded-full items-center justify-center`,
                  { backgroundColor: statusColors.bg },
                ]}
              >
                <Icon />
              </View>

              <Text
                style={[
                  tw`mt-5 text-lg font-semibold`,
                  { color: statusColors.text },
                ]}
              >
                {getPaymentStatusText(verified)}
              </Text>

              {!!verified?.message && (
                <Text
                  style={tw`mt-2 text-center text-gray-600 text-xs leading-5`}
                >
                  {verified.message}
                </Text>
              )}

              {/* Actions */}
              <View style={tw`w-full mt-6`}>
                <TouchableOpacity
                  onPress={onGoToDashboard}
                  style={tw`h-12 rounded-2xl bg-[#1a1a1a] items-center justify-center flex-row`}
                >
                  <Feather name="eye" size={18} color="#fff" style={tw`mr-2`} />
                  <Text style={tw`text-white font-medium`}>View my orders</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onGoHome}
                  style={tw`h-12 rounded-2xl bg-white items-center justify-center flex-row mt-3 border border-gray-200`}
                >
                  <Feather
                    name="arrow-left"
                    size={18}
                    color="#111"
                    style={tw`mr-2`}
                  />
                  <Text style={tw`text-gray-900 font-medium`}>Go to home</Text>
                </TouchableOpacity>

                {/* Security badge */}
                <View style={tw`mt-5 flex-row items-center justify-center`}>
                  <View style={tw`w-2 h-2 bg-green-400 rounded-full mr-2`} />
                  <Text style={tw`text-[11px] text-gray-500`}>
                    Secure SSL Encrypted Transaction
                  </Text>
                </View>
              </View>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}
