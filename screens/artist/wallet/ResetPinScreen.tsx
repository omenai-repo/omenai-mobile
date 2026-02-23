import React, { useRef, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import tw from "twrnc";
import { updateWalletPin } from "#services/wallet/updateWalletPin";
import { useModalStore } from "#store/modal/modalStore";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { validatePin } from "#utils/validatePin";
import { OtpInput } from "#components/inputs/OtpInput";
import type { OtpInputRef } from "#types/otp";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { Ionicons } from "@expo/vector-icons";

const PIN_GUIDELINES = [
  "Must be exactly 4 digits",
  "Cannot be all the same digit (e.g. 1111)",
  "Cannot be consecutive ascending digits (e.g. 1234)",
  "Cannot be consecutive descending digits (e.g. 4321)",
  "No Omenai staff will ever ask for your wallet PIN — never share it with anyone",
];

export const ResetPinScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const walletId: string = route?.params?.walletId ?? "";
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateModal } = useModalStore();

  const newPinRef = useRef<OtpInputRef | null>(null);
  const confirmPinRef = useRef<OtpInputRef | null>(null);

  const handleResetPin = async () => {
    if (newPin.length !== 4 || confirmPin.length !== 4) {
      updateModal({
        message: "Please complete both PIN fields",
        showModal: true,
        modalType: "error",
      });
      return;
    }

    if (newPin !== confirmPin) {
      updateModal({
        message: "PINs do not match",
        showModal: true,
        modalType: "error",
      });
      newPinRef.current?.clear();
      confirmPinRef.current?.clear();
      return;
    }

    if (!validatePin(newPin.split(""))) {
      updateModal({
        message: "PIN cannot be consecutive or repeating numbers",
        showModal: true,
        modalType: "error",
      });
      newPinRef.current?.clear();
      confirmPinRef.current?.clear();
      return;
    }

    setLoading(true);
    try {
      const response = await updateWalletPin(newPin, walletId);
      console.log("walletId", walletId);
      if (response?.isOk) {
        updateModal({
          message: "PIN reset successfully",
          showModal: true,
          modalType: "success",
        });
        setTimeout(() => navigation.pop(2), 2000);
      } else {
        updateModal({
          message: (response as any)?.message || "Failed to reset PIN",
          showModal: true,
          modalType: "error",
        });
      }
    } catch {
      updateModal({
        message: "An error occurred while resetting PIN",
        showModal: true,
        modalType: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = newPin.length !== 4 || confirmPin.length !== 4 || loading;

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title="Reset Wallet PIN" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`px-[25px] pb-[120px]`}
      >
        {/* Enter new PIN */}
        <Text style={tw`mb-2 mt-5 font-semibold text-[15px]`}>
          Enter new wallet PIN:
        </Text>
        <View style={tw`mb-8`}>
          <OtpInput
            ref={newPinRef}
            numberOfDigits={4}
            onTextChange={setNewPin}
            onFilled={(text) => setNewPin(text)}
            type="numeric"
            secureTextEntry={true}
            secureTextEntryDelay={1000}
            focusColor="#000000"
            theme={{
              pinCodeContainerStyle: tw`w-14 h-14 border border-gray-400 rounded-md bg-white`,
              pinCodeTextStyle: tw`text-xl text-center`,
              focusedPinCodeContainerStyle: tw`border-black border-2`,
            }}
            disabled={loading}
          />
        </View>

        {/* Confirm new PIN */}
        <Text style={tw`mb-2 font-semibold text-[15px]`}>
          Confirm new wallet PIN:
        </Text>
        <View style={tw`mb-6`}>
          <OtpInput
            ref={confirmPinRef}
            numberOfDigits={4}
            onTextChange={setConfirmPin}
            onFilled={(text) => setConfirmPin(text)}
            type="numeric"
            secureTextEntry={true}
            secureTextEntryDelay={1000}
            focusColor="#000000"
            theme={{
              pinCodeContainerStyle: tw`w-14 h-14 border border-gray-400 rounded-md bg-white`,
              pinCodeTextStyle: tw`text-xl text-center`,
              focusedPinCodeContainerStyle: tw`border-black border-2`,
            }}
            disabled={loading}
          />
        </View>

        {/* PIN Guidelines */}
        <View
          style={tw`bg-white border border-[#E7E7E7] rounded-md px-4 py-4 mt-2`}
        >
          <Text style={tw`font-semibold text-[13px] mb-3 text-[#1A1A1A]`}>
            PIN requirements:
          </Text>
          {PIN_GUIDELINES.map((rule, i) => (
            <View key={i} style={tw`flex-row items-start gap-2 mb-2`}>
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color="#6b7280"
                style={tw`mt-[1px]`}
              />
              <Text style={tw`text-[12px] text-gray-500 flex-1`}>{rule}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={tw`absolute bottom-0 left-0 right-0 px-[25px] pb-[40px]`}>
        <LongBlackButton
          value="Reset PIN"
          onClick={handleResetPin}
          isLoading={loading}
          isDisabled={isDisabled}
        />
      </View>
    </View>
  );
};
