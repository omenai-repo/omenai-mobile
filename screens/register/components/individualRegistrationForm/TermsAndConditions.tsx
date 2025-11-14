import { acceptTermsList } from "../../../../constants/accetTerms.constants";
import { useIndividualAuthRegisterStore } from "../../../../store/auth/register/IndividualAuthRegisterStore";
import { useRegistrationHandler } from "hooks/useRegistrationHandler";
import { useTermsSelection } from "hooks/useTermsSelection";
import { TermsAndConditionsForm } from "components/register/TermsAndConditionsForm";

export default function TermsAndConditions() {
  const {
    preferences,
    individualRegisterData,
    pageIndex,
    setPageIndex,
    selectedTerms,
    setSelectedTerms,
    isLoading,
    setIsLoading,
    clearState,
  } = useIndividualAuthRegisterStore();

  const { handleRegister } = useRegistrationHandler("individual");
  const { handleToggleTerm } = useTermsSelection();

  const handleSubmit = () => {
    const data = {
      ...individualRegisterData,
      preferences,
    };
    handleRegister(data, clearState, setIsLoading);
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
      entity="collector"
    />
  );
}
