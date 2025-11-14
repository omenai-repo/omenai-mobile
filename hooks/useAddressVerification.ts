import { useState } from "react";
import { verifyAddress } from "services/register/verifyAddress";
import { useModalStore } from "store/modal/modalStore";

type VerifyType = "delivery" | "pickup";

interface AddressData {
  city: string;
  state: string;
  zip: string;
  countryCode: string;
}

export const useAddressVerification = (
  setIsLoading: (value: boolean) => void,
  pageIndex: number,
  setPageIndex: (value: number) => void
) => {
  const [showModal, setShowModal] = useState(false);
  const [addressVerified, setAddressVerified] = useState(false);

  const { updateModal } = useModalStore();

  const handleVerifyAddress = async (
    addressData: AddressData,
    phone: string,
    type: VerifyType = "delivery"
  ) => {
    setIsLoading(true);
    try {
      const payload = {
        type,
        countyName: addressData.city,
        cityName: addressData.state,
        postalCode: addressData.zip,
        countryCode: addressData.countryCode,
        phone,
      };

      const response = await verifyAddress(payload);

      setIsLoading(false);

      if (response?.isOk) {
        if (response?.body?.data?.address && response.body.data.address.length !== 0) {
          setShowModal(true);
          setAddressVerified(true);
        } else {
          setShowModal(true);
          setAddressVerified(false);
        }
      } else {
        setShowModal(true);
        setAddressVerified(false);
      }
    } catch (error) {
      console.error("Error verifying address:", error);
      updateModal({
        message: "Network error, please check your connection and try again.",
        modalType: "error",
        showModal: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalProceed = () => {
    if (addressVerified) {
      setPageIndex(pageIndex + 1);
    } else {
      setShowModal(false);
    }
  };

  const handleModalGoBack = () => {
    setShowModal(false);
    setPageIndex(pageIndex - 1);
  };

  return {
    showModal,
    setShowModal,
    addressVerified,
    handleVerifyAddress,
    handleModalProceed,
    handleModalGoBack,
  };
};
