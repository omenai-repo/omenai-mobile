import Modal from "react-native-modal";
import React from "react";
import { useModalStore } from "#store/modal/modalStore";
import CancelSubscriptionModal from "./modals/CancelSubscriptionModal";
import DeleteAccountSuccessModal from "./modals/DeleteAccountSuccessModal";
import tw from "twrnc";
import { ToastView } from "./ToastView";
import { BottomSheetView } from "./BottomSheetView";

export default function CustomModal() {
  const {
    showModal,
    modalMessage,
    modalType,
    retainModal,
    updateModal,
    modalStyle,
  } = useModalStore();

  const modals: { [key: string]: React.ReactElement } = {
    cancleSubscription: <CancelSubscriptionModal />,
    deleteAccountSuccess: <DeleteAccountSuccessModal />,
  };

  const handleDismiss = () => {
    updateModal({ message: "", showModal: false, modalType: "" });
  };

  const isError = modalType === "error";
  const title = isError ? "Error" : "Success";
  const iconName = isError ? "error-outline" : "check-circle-outline";
  const iconColor = isError ? "#ff0000" : "#008000";
  const iconBg = isError ? "#ffe6e6" : "#e6ffe6";

  const isToast = modalStyle === "toast";

  // Logic to determine animation
  let animationIn: "slideInUp" | "slideInDown" = "slideInUp";
  let animationOut: "slideOutUp" | "slideOutDown" = "slideOutDown";

  if (retainModal) {
    animationIn = "slideInUp";
    animationOut = "slideOutDown";
  } else if (isToast) {
    animationIn = "slideInDown";
    animationOut = "slideOutUp";
  }

  return (
    <Modal
      isVisible={showModal}
      backdropOpacity={isToast ? 0 : 0.4}
      onBackdropPress={handleDismiss}
      onBackButtonPress={handleDismiss}
      animationIn={animationIn}
      animationOut={animationOut}
      style={isToast ? tw`m-0 justify-start` : tw`m-0 justify-end`}
      coverScreen={!isToast}
      hasBackdrop={!isToast}
    >
      {retainModal ? (
        <>{modals[retainModal]}</>
      ) : isToast ? (
        <ToastView
          title={title}
          message={modalMessage}
          iconName={iconName}
          iconColor={iconColor}
          iconBg={iconBg}
          onDismiss={handleDismiss}
        />
      ) : (
        <BottomSheetView
          title={title}
          message={modalMessage}
          iconName={iconName}
          iconColor={iconColor}
          iconBg={iconBg}
          onDismiss={handleDismiss}
        />
      )}
    </Modal>
  );
}
