import { useGalleryAuthRegisterStore } from '../../../../store/auth/register/GalleryAuthRegisterStore';
import TermsAndConditions from './TermsAndConditions';

export default function GalleryRegisterForm() {
  const { pageIndex } = useGalleryAuthRegisterStore();

  const forms = [
    <TermsAndConditions />,
  ];

  return forms[pageIndex];
}
