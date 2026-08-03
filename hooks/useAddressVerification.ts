import { verifyAddress } from "#services/auth/verifyAddress";
import { useModalStore } from "#store/account/modal/modalStore";

type VerifyType = "delivery" | "pickup";

interface AddressData {
  city: string;
  state: string;
  zip: string;
  countryCode?: string;
  country?: string;
}

export const useAddressVerification = (
  setIsLoading: (value: boolean) => void,
  pageIndex: number,
  setPageIndex: (value: number) => void,
) => {
  const { updateModal } = useModalStore();

  const handleVerifyAddress = async (
    addressData: AddressData,
    phone: string,
    type: VerifyType = "delivery",
  ) => {
    setIsLoading(true);
    try {
      const payload = {
        type,
        countyName: addressData.city,
        cityName: addressData.state,
        postalCode: addressData.zip,
        countryCode: addressData.countryCode ?? addressData.country ?? "",
        phone,
      };

      const response = await verifyAddress(payload);

      const isVerified =
        response?.isOk &&
        response?.body?.data?.address &&
        response.body.data.address.length !== 0;

      if (isVerified) {
        updateModal({
          message: "Your Address has been verified succesfully",
          modalType: "success",
          showModal: true,
          onDismiss: () => setPageIndex(pageIndex + 1),
        });
      } else {
        updateModal({
          message: "Your Address could not be verified. Try again.",
          modalType: "error",
          showModal: true,
        });
      }
    } catch (error: any) {
      console.error("Error verifying address:", error);
      updateModal({
        message:
          error?.message ||
          error?.body?.message ||
          "Network error, please check your connection and try again.",
        modalType: "error",
        showModal: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleVerifyAddress,
  };
};
