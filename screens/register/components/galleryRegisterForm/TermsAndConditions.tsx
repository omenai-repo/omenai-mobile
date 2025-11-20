import { acceptTermsList } from "../../../../constants/accetTerms.constants";
import { useGalleryAuthRegisterStore } from "../../../../store/auth/register/GalleryAuthRegisterStore";
import { useRegistrationHandler } from "hooks/useRegistrationHandler";
import { useTermsSelection } from "hooks/useTermsSelection";
import { TermsAndConditionsForm } from "components/register/TermsAndConditionsForm";

export default function TermsAndConditions({
  hideBackButton = false,
}: Readonly<{
  hideBackButton?: boolean;
}>) {
  const {
    selectedTerms,
    setSelectedTerms,
    pageIndex,
    setPageIndex,
    isLoading,
    setIsLoading,
    galleryRegisterData,
    clearState,
  } = useGalleryAuthRegisterStore();

  const { handleRegister } = useRegistrationHandler("gallery");
  const { handleToggleTerm } = useTermsSelection();

  const handleSubmit = () => {
    handleRegister(galleryRegisterData, clearState, setIsLoading);
  };

  const handleAcceptTerms = (index: number) => {
    handleToggleTerm(index, selectedTerms, setSelectedTerms);
  };

  return (
    <TermsAndConditionsForm
      termsList={acceptTermsList}
      selectedTerms={selectedTerms}
      onToggleTerm={handleAcceptTerms}
      onSubmit={handleSubmit}
      onBack={() => setPageIndex(pageIndex - 1)}
      isLoading={isLoading}
      isDisabled={!selectedTerms.includes(0)}
      entity="gallery"
      hideBackButton={hideBackButton}
    />
  );
}
