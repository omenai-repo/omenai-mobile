import { BlurView } from "expo-blur";
import React, { useState, useRef, useEffect } from "react";
import { View, Text, Modal, Pressable, TextInput } from "react-native";
import { colors } from "#config/colors.config";
import { updateWalletPin } from "#services/commerce/wallet/updateWalletPin";
import { useModalStore } from "#store/account/modal/modalStore";
import tw from "twrnc";
import { PinInputRow } from "./PinInputRow";
import { validatePin } from "#utils/core/validatePin";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import LongBlackButton from "#components/buttons/LongBlackButton";

export const PinCreationModal = ({
  visible,
  onClose,
  setVisible,
  walletId,
}: {
  visible: boolean;
  onClose: () => void;
  setVisible: (visible: boolean) => void;
  walletId: string;
}) => {
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const pinRefs = useRef<(TextInput | null)[]>([]);
  const confirmPinRefs = useRef<(TextInput | null)[]>([]);
  const inputStyle = tw`w-12 h-12 border border-gray-400 rounded-sm bg-[#fff] text-center text-xl`;

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
      refs: React.MutableRefObject<(TextInput | null)[]>,
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
    confirmPinRefs,
  );

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
      const response = await updateWalletPin(pinStr, walletId);
      if (response?.isOk) {
        await queryClient.invalidateQueries({ queryKey: ["wallet", "artist"] });
        onClose();
        updateModal({
          message: "PIN set successfully",
          showModal: true,
          modalType: "success",
        });
      } else {
        setError(response?.body?.message || "Failed to set PIN");
      }
    } catch (error: any) {
      setError(
        error?.message || error?.response?.data?.message || "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={tw`flex-1`}>
        <BlurView
          intensity={30}
          style={tw`absolute top-0 left-0 right-0 bottom-0`}
        />
        <Pressable
          style={[
            tw`flex-1 justify-center items-center`,
            { backgroundColor: `${colors.black}80` },
          ]}
          onPress={onClose}
        >
          <Pressable style={tw`bg-white rounded-sm p-6 w-4/5`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-xl font-bold`}>Create Wallet PIN</Text>
              <Pressable onPress={onClose}>
                <Ionicons name="close" size={24} color={colors.black} />
              </Pressable>
            </View>

            <Text style={tw`mb-2`}>Enter new wallet PIN:</Text>
            <View style={tw`w-full mb-[40px]`}>
              <PinInputRow
                values={pin}
                refs={pinRefs}
                onChange={handlePinChange}
                testPrefix="pin"
                inputStyle={inputStyle}
              />
            </View>

            <Text style={tw`mb-2`}>Confirm wallet PIN:</Text>
            <View style={tw`w-full mb-[30px]`}>
              <PinInputRow
                values={confirmPin}
                refs={confirmPinRefs}
                onChange={handleConfirmPinChange}
                testPrefix="confirm"
                inputStyle={inputStyle}
              />
            </View>

            {error ? <Text style={tw`text-red-500 mb-4`}>{error}</Text> : null}

            <LongBlackButton
              value="Submit"
              onClick={handleSubmit}
              isLoading={loading}
            />
          </Pressable>
        </Pressable>
      </View>
    </Modal>
  );
};
