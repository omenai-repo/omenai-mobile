import Modal from "react-native-modal";
import React from "react";
import { useModalStore } from "#store/account/modal/modalStore";
import CancelSubscriptionModal from "./modals/CancelSubscriptionModal";
import DeleteAccountSuccessModal from "./modals/DeleteAccountSuccessModal";
import tw from "twrnc";
import { ToastView } from "./ToastView";
import { BottomSheetView } from "./BottomSheetView";

interface CustomModalProps {
  modalStyleOption?: "toast" | "bottomSheet";
  visible?: boolean;
  message?: string;
  type?: "error" | "success";
  onDismiss?: () => void;
  buttonText?: string;
}

export default function CustomModal({
  modalStyleOption,
  visible,
  message,
  type,
  onDismiss,
  buttonText,
}: Readonly<CustomModalProps>) {
  const {
    showModal,
    modalMessage,
    modalType,
    retainModal,
    updateModal,
    setRetainModal,
    modalStyle,
    onDismiss: storeOnDismiss,
  } = useModalStore();

  const modals: { [key: string]: React.ReactElement } = {
    cancleSubscription: <CancelSubscriptionModal />,
    deleteAccountSuccess: <DeleteAccountSuccessModal />,
  };

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    } else {
      if (storeOnDismiss) storeOnDismiss();
      if (retainModal) {
        setRetainModal({ showModal: false, retainModal: null });
      } else {
        updateModal({
          message: modalMessage,
          showModal: false,
          modalType: modalType,
          modalStyle: modalStyle,
        });
      }
    }
  };

  const activeShowModal = visible ?? showModal;
  const activeModalMessage = message || modalMessage;
  const activeModalType = type || modalType;
  const activeModalStyle = modalStyleOption || modalStyle;

  const isError = activeModalType === "error";
  const title = isError ? "Error" : "Success";
  const iconName = isError ? "error-outline" : "check-circle-outline";
  const iconColor = isError ? "#ff0000" : "#008000";
  const iconBg = isError ? "#ffe6e6" : "#e6ffe6";

  const isToast = activeModalStyle === "toast";

  // Logic to determine animation
  let animationIn: "slideInUp" | "slideInDown" = "slideInUp";
  let animationOut: "slideOutUp" | "slideOutDown" = "slideOutDown";

  if (!retainModal && isToast) {
    animationIn = "slideInDown";
    animationOut = "slideOutUp";
  }

  let modalContent;

  if (retainModal) {
    modalContent = <>{modals[retainModal]}</>;
  } else if (isToast) {
    modalContent = (
      <ToastView
        title={title}
        message={activeModalMessage}
        iconName={iconName}
        iconColor={iconColor}
        iconBg={iconBg}
        onDismiss={handleDismiss}
      />
    );
  } else {
    modalContent = (
      <BottomSheetView
        title={title}
        message={activeModalMessage}
        iconName={iconName}
        iconColor={iconColor}
        iconBg={iconBg}
        onDismiss={handleDismiss}
        buttonText={buttonText}
      />
    );
  }

  return (
    <Modal
      isVisible={activeShowModal}
      backdropOpacity={isToast ? 0 : 0.4}
      onBackdropPress={handleDismiss}
      onBackButtonPress={handleDismiss}
      animationIn={animationIn}
      animationOut={animationOut}
      style={isToast ? tw`m-0 justify-start` : tw`m-0 justify-end`}
      coverScreen={!isToast}
      hasBackdrop={!isToast}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
    >
      {modalContent}
    </Modal>
  );
}
