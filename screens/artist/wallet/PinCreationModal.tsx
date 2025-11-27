import { BlurView } from "expo-blur";
import React, { useState, useRef, useEffect } from "react";
import { View, Text, Modal, Pressable, TextInput } from "react-native";
import { colors } from "config/colors.config";
import { updateWalletPin } from "services/wallet/updateWalletPin";
import { useModalStore } from "store/modal/modalStore";
import tw from "twrnc";
import { PinInputRow } from "./PinInputRow";

export const PinCreationModal = ({
  visible,
  onClose,
  setVisible,
}: {
  visible: boolean;
  onClose: () => void;
  setVisible: (visible: boolean) => void;
}) => {
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const pinRefs = useRef<(TextInput | null)[]>([]);
  const confirmPinRefs = useRef<(TextInput | null)[]>([]);
  const inputStyle = tw`w-12 h-12 border border-gray-400 rounded-[15px] bg-[#fff] text-center text-xl`;

  // ...existing code...

  const { updateModal } = useModalStore();

  useEffect(() => {
    if (!visible) {
      setPin(["", "", "", ""]);
      setConfirmPin(["", "", "", ""]);
      setError("");
    }
  }, [visible]);

  const createPinChangeHandler =
    (
      setter: React.Dispatch<React.SetStateAction<string[]>>,
      refs: React.MutableRefObject<(TextInput | null)[]>
    ) =>
    (value: string, index: number) => {
      setError(""); // Clear error on any keypress

      setter((prevPin) => {
        const newPin = [...prevPin];
        newPin[index] = value;
        return newPin;
      });

      if (value && index < 3) {
        refs.current[index + 1]?.focus();
      } else if (!value && index > 0) {
        refs.current[index - 1]?.focus();
      }
    };

  const handlePinChange = createPinChangeHandler(setPin, pinRefs);
  const handleConfirmPinChange = createPinChangeHandler(
    setConfirmPin,
    confirmPinRefs
  );

  const validatePin = (pinArray: string[]) => {
    const pinStr = pinArray.join("");

    // Reject if all digits are the same
    if (new Set(pinStr).size === 1) {
      return false;
    }

    // Check for ascending or descending sequence
    const isAscending = pinStr
      .split("")
      .every(
        (digit, i, arr) =>
          i === 0 || Number.parseInt(digit) === Number.parseInt(arr[i - 1]) + 1
      );

    const isDescending = pinStr
      .split("")
      .every(
        (digit, i, arr) =>
          i === 0 || Number.parseInt(digit) === Number.parseInt(arr[i - 1]) - 1
      );

    if (isAscending || isDescending) {
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    const pinStr = pin.join("");
    const confirmPinStr = confirmPin.join("");

    if (pinStr.length !== 4 || confirmPinStr.length !== 4) {
      setError("Please complete the PIN");
      return;
    }

    if (pinStr !== confirmPinStr) {
      setError("PINs do not match");
      return;
    }

    if (!validatePin(pin)) {
      setError("PIN cannot be consecutive or repeating numbers");
      return;
    }

    setLoading(true);
    try {
      const response = await updateWalletPin(pinStr);
      if (response?.isOk) {
        onClose();
        updateModal({
          message: "PIN set successfully",
          showModal: true,
          modalType: "success",
        });
      } else {
        setError(response?.message || "Failed to set PIN");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={[
          tw`flex-1 justify-center items-center`,
          { backgroundColor: `${colors.black}80` },
        ]}
      >
        <BlurView
          intensity={30}
          style={tw`absolute top-0 left-0 right-0 bottom-0`}
        />
        <View style={tw`bg-white rounded-2xl p-6 w-4/5`}>
          <Text style={tw`text-xl font-bold mb-4`}>Create Wallet PIN</Text>

          <Text style={tw`mb-2`}>Enter new wallet PIN:</Text>
          <View style={tw`flex-row justify-between mb-[40px]`}>
            <PinInputRow
              values={pin}
              refs={pinRefs}
              onChange={handlePinChange}
              testPrefix="pin"
              inputStyle={inputStyle}
            />
          </View>

          <Text style={tw`mb-2`}>Confirm wallet PIN:</Text>
          <View style={tw`flex-row justify-between mb-[30px]`}>
            <PinInputRow
              values={confirmPin}
              refs={confirmPinRefs}
              onChange={handleConfirmPinChange}
              testPrefix="confirm"
              inputStyle={inputStyle}
            />
          </View>

          {error ? <Text style={tw`text-red-500 mb-4`}>{error}</Text> : null}

          <Pressable
            style={[
              { backgroundColor: colors.black },
              tw`py-4 rounded-lg`,
              loading ? { opacity: 0.5 } : {},
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text
              style={[tw`text-center text-[16px]`, { color: colors.white }]}
            >
              {loading ? "Processing..." : "Submit"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
