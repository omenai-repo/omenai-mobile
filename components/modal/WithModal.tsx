import { View } from "react-native";
import React, { useEffect } from "react";
import CustomModal from "./CustomModal";
import { useModalStore } from "#store/account/modal/modalStore";
import { colors } from "#config/colors.config";
import ConfirmationModal from "./ConfirmationModal";
import WebViewModal from "./WebViewModal";

export type WithModalProps = {
  children: React.ReactNode;
};

export default function WithModal({ children }: WithModalProps) {
  const {
    showModal,
    updateModal,
    confirmationModal,
    showConfirmationModal,
    retainModal,
    modalMessage,
    modalType,
    modalStyle,
    webViewUrl,
    clear,
  } = useModalStore();

  useEffect(() => {
    if (showModal && retainModal === null && modalStyle === "toast") {
      const closeModal = () => {
        // Standard toast timeout
        const timeout = 2500;
        const timer = setTimeout(() => {
          updateModal({ message: "", showModal: false, modalType: "" });
        }, timeout);
        return () => clearTimeout(timer);
      };
      return closeModal();
    }
  }, [showModal, retainModal, updateModal, modalStyle]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      {children}
      <ConfirmationModal
        isVisible={showConfirmationModal}
        onClose={clear}
        child={confirmationModal}
      />
      <CustomModal />
      <WebViewModal url={webViewUrl} />
    </View>
  );
}
