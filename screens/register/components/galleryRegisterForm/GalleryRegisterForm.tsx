import { useGalleryAuthRegisterStore } from '../../../../store/auth/register/GalleryAuthRegisterStore';
import AccountDetailsInput from './AccountDetailsInput';
import ExtraGalleryDetailsInput from './ExtraGalleryDetailsInput';
import GalleryAddressVerification from './GalleryAddressVerification';
import TermsAndConditions from './TermsAndConditions';
import UploadLogo from './UploadLogo';

export default function GalleryRegisterForm() {
  const { pageIndex } = useGalleryAuthRegisterStore();

  const forms = [
    <AccountDetailsInput />,
    <GalleryAddressVerification />,
    <ExtraGalleryDetailsInput />,
    <UploadLogo />,
    <TermsAndConditions />,
  ];

  return forms[pageIndex];
}
