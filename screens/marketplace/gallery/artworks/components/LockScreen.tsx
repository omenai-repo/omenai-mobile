import { Text, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { verifyGalleryRequest } from "#services/auth/verifyGalleryRequest";

import { useModalStore } from "#store/account/modal/modalStore";
import { useAppStore } from "#store/app/appStore";
import { colors } from "#config/colors.config";
import LongWhiteButton from "#components/buttons/LongWhiteButton";
import PremiumStateCard from "#components/general/PremiumStateCard";

export default function LockScreen({ name }: { name: string }) {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const { updateModal } = useModalStore();
  const { userType } = useAppStore();

  async function handleRequestGalleryVerification() {
    setLoading(true);
    try {
      const response = await verifyGalleryRequest(name);
      if (response?.isOk) {
        updateModal({
          message: "Verification reminder sent successfully",
          modalType: "success",
          showModal: true,
        });
        navigation.goBack();
      } else {
        updateModal({
          message:
            response?.body?.message ||
            response?.message ||
            "Error sending verification reminder",
          modalType: "error",
          showModal: true,
        });
      }
    } catch (error: any) {
      updateModal({
        message: error?.message || error?.body?.message || "Error sending verification reminder",
        modalType: "error",
        showModal: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <PremiumStateCard
      icon="shield"
      title="Account Verification Required"
      description={
        <Text style={tw`text-center text-sm mb-8 text-neutral-300`}>
          Your account is being verified. An agent will reach out within 24
          hours.
          {userType === "gallery" ? (
            <Text>
              {"\n\n"}To expedite, click{" "}
              <Text style={tw`font-bold text-white`}>
                Send Verification Reminder
              </Text>{" "}
              below.
            </Text>
          ) : null}
        </Text>
      }
      onBack={() => navigation.goBack()}
      actionButton={
        userType === "gallery" ? (
          <LongWhiteButton
            value="Send Verification Reminder"
            onClick={handleRequestGalleryVerification}
            outline={false}
            style={{
              height: 48,
              backgroundColor: colors.white,
              opacity: loading ? 0.7 : 1,
            }}
            textStyle={{
              color: colors.primary_black,
              fontSize: 14,
              fontWeight: "bold",
            }}
            icon={
              loading ? (
                <ActivityIndicator size="small" color={colors.primary_black} />
              ) : null
            }
          />
        ) : undefined
      }
    />
  );
}
