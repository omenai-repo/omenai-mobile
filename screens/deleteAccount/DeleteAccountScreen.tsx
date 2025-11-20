import React, { useState, useRef } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Linking,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import tw from "twrnc";
import { StatusBar } from "expo-status-bar";

import ScrollWrapper from "components/general/ScrollWrapper";
import DeleteAccountHeader from "components/deleteAccount/DeleteAccountHeader";
import DeletionProcessSteps from "components/deleteAccount/DeletionProcessSteps";
import DeletionReasonSection from "components/deleteAccount/DeletionReasonSection";
import OtherMessageInput from "components/deleteAccount/OtherMessageInput";
import DeleteAccountActions from "components/deleteAccount/DeleteAccountActions";
import BlurStatusBar from "components/general/BlurStatusBar";
import CommitmentsModal from "components/deleteAccount/CommitmentsModal";
import { PRIVACY_POLICY_URL } from "constants/deleteAccount.constants";
import { deleteAccount, type DeleteAccountResponse } from "services/requests/deleteAccount";
import { useAppStore } from "store/app/appStore";
import { useModalStore } from "store/modal/modalStore";
import type { RootNavigationProp } from "types/navigation";

export default function DeleteAccountScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { routeName } = (route.params as { routeName?: string }) || {
    routeName: "individual",
  };

  const { userSession } = useAppStore();
  const { updateModal, setRetainModal } = useModalStore();

  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherMessage, setOtherMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [commitments, setCommitments] = useState<Commitment[] | null>(null);
  const [showCommitments, setShowCommitments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleReasonSelect = (id: string) => {
    setSelectedReason(id);
    if (id !== "other") {
      setOtherMessage("");
    }
  };

  const handleContinueToDelete = () => {
    if (selectedReason) {
      confirmDeletion();
    }
  };

  const confirmDeletion = async () => {
    if (!selectedReason || !userSession?.id) {
      return;
    }

    setLoading(true);
    setError(null);
    setCommitments(null);

    try {
      const payload = {
        id: userSession.id,
        reason:
          selectedReason.toLowerCase() === "other"
            ? otherMessage
            : selectedReason,
      };

      const response: DeleteAccountResponse = await deleteAccount(
        routeName as "individual" | "gallery" | "artist",
        payload.id,
        payload.reason
      );

      if (response.status === 409) {
        const commitmentsList: Commitment[] = Array.isArray(response?.commitments)
          ? response.commitments
          : response?.commitments?.commitments ?? [];
        setCommitments(commitmentsList);
        setShowCommitments(true);
        setLoading(false);
        return;
      }

      if (response.status === 202 || response.isOk) {
        setShowCommitments(false);
        setLoading(false);

        setRetainModal({
          retainModal: "deleteAccountSuccess",
          showModal: true,
        });

        return;
      }

      setError(response.message || "Unable to process deletion request");
      updateModal({
        message: response.message || "Unable to process deletion request",
        showModal: true,
        modalType: "error",
      });
    } catch (err: any) {
      const errorMessage =
        err?.message ||
        "Network error encountered, please try again or contact support";
      setError(errorMessage);
      updateModal({
        message: errorMessage,
        showModal: true,
        modalType: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyPolicyPress = () => {
    Linking.openURL(PRIVACY_POLICY_URL);
  };

  const isContinueDisabled =
    !selectedReason || (selectedReason === "other" && !otherMessage.trim());

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-[#F7F7F7]`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <StatusBar style="dark" />
      <View style={tw`flex-1 bg-[#F7F7F7]`}>
        <BlurStatusBar scrollY={scrollY} intensity={80} tint="light" />
        <ScrollWrapper
          style={tw`flex-1`}
          contentContainerStyle={[tw`pb-4`]}
          keyboardShouldPersistTaps="handled"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: false,
            }
          )}
        >
          <View style={[tw`px-5`, { paddingTop: insets.top + 24 }]}>
            <DeleteAccountHeader />
            <DeletionProcessSteps
              onPrivacyPolicyPress={handlePrivacyPolicyPress}
            />
            <DeletionReasonSection
              selectedReason={selectedReason}
              onReasonSelect={handleReasonSelect}
            />
            {selectedReason === "other" && (
              <OtherMessageInput
                message={otherMessage}
                onMessageChange={setOtherMessage}
              />
            )}
            {error && (
              <View style={tw`px-5 mb-4`}>
                <View
                  style={tw`p-4 bg-red-50 rounded-lg border border-red-200`}
                >
                  <Text style={tw`text-red-600 text-sm`}>{error}</Text>
                </View>
              </View>
            )}
          </View>
        </ScrollWrapper>

        <DeleteAccountActions
          onCancel={() => navigation.goBack()}
          onContinue={handleContinueToDelete}
          isContinueDisabled={isContinueDisabled || loading}
        />

        <CommitmentsModal
          isVisible={showCommitments}
          commitments={commitments || []}
          onClose={() => {
            setShowCommitments(false);
            setCommitments(null);
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
