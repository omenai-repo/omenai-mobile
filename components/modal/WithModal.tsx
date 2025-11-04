import { View } from "react-native";
import React, { useEffect } from "react";
import CustomModal from "./CustomModal";
import { useModalStore } from "store/modal/modalStore";
import { colors } from "config/colors.config";
import ConfirmationModal from "./ConfirmationModal";

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
  } = useModalStore();

  useEffect(() => {
    if (showModal && retainModal === null) {
      const isDeleteAccountSuccess =
        modalType === "success" &&
        (modalMessage.toLowerCase().includes("deletion") ||
          modalMessage.toLowerCase().includes("delete account"));

      const closeModal = () => {
        const timeout = isDeleteAccountSuccess ? 10_000 : 2_500;
        setTimeout(() => {
          updateModal({ message: "", showModal: false, modalType: "" });
        }, timeout);
      };
      closeModal();
    }
  }, [showModal, retainModal, updateModal, modalMessage, modalType]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      {children}
      <CustomModal />
      <ConfirmationModal
        isVisible={showConfirmationModal}
        child={confirmationModal}
      />
    </View>
  );
}
