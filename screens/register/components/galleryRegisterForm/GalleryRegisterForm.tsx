import { useGalleryAuthRegisterStore } from "../../../../store/auth/register/GalleryAuthRegisterStore";
import TermsAndConditions from "./TermsAndConditions";

export default function GalleryRegisterForm() {
  const { pageIndex } = useGalleryAuthRegisterStore();

  const forms = [<TermsAndConditions key="terms" hideBackButton={true} />];

  return forms[pageIndex];
}
