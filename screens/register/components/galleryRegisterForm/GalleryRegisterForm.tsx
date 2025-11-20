import { useGalleryAuthRegisterStore } from "../../../../store/auth/register/GalleryAuthRegisterStore";
import AccountDetailsInput from "./AccountDetailsInput";
import ExtraGalleryDetailsInput from "./ExtraGalleryDetailsInput";
import GalleryAddressVerification from "./GalleryAddressVerification";
import UploadLogo from "./UploadLogo";
import TermsAndConditions from "./TermsAndConditions";

export default function GalleryRegisterForm() {
  const { pageIndex } = useGalleryAuthRegisterStore();

  const forms = [
    <AccountDetailsInput key="account" />,
    <ExtraGalleryDetailsInput key="extra" />,
    <GalleryAddressVerification key="address" />,
    <UploadLogo key="logo" />,
    <TermsAndConditions key="terms" hideBackButton={true} />,
  ];

  return forms[pageIndex];
}
