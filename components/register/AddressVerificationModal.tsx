import AuthModal from "components/auth/AuthModal";
import { checkMarkIcon, errorIcon } from "utils/SvgImages";

type AddressVerificationModalProps = {
  readonly showModal: boolean;
  readonly setShowModal: (value: boolean) => void;
  readonly addressVerified: boolean;
  readonly handleModalGoBack: () => void;
  readonly handleModalProceed: () => void;
  readonly handleSubmit: () => void;
  readonly successMessage?: string;
  readonly errorMessage?: string;
};

export const AddressVerificationModal = ({
  showModal,
  setShowModal,
  addressVerified,
  handleModalGoBack,
  handleModalProceed,
  handleSubmit,
  successMessage = "Your Address has been verified succesfully",
  errorMessage = "Your Address could not be verified. Try again.",
}: Readonly<AddressVerificationModalProps>) => {
  return (
    <AuthModal
      modalVisible={showModal}
      setModalVisible={setShowModal}
      icon={addressVerified ? checkMarkIcon : errorIcon}
      text={addressVerified ? successMessage : errorMessage}
      btn1Text="Go Back"
      btn2Text={addressVerified ? "Proceed" : "Try Again"}
      onPress1={handleModalGoBack}
      onPress2={() => {
        if (addressVerified) {
          handleModalProceed();
        } else {
          setShowModal(false);
          handleSubmit();
        }
      }}
    />
  );
};
