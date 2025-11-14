import { Text, View } from "react-native";
import FittedBlackButton from "../../../../components/buttons/FittedBlackButton";
import BackFormButton from "../../../../components/buttons/BackFormButton";
import { acceptTermsList } from "../../../../constants/accetTerms.constants";
import { useIndividualAuthRegisterStore } from "../../../../store/auth/register/IndividualAuthRegisterStore";
import TermsAndConditionItem from "../../../../components/general/TermsAndConditionItem";
import { useModalStore } from "store/modal/modalStore";
import LegalLinkButton from "../../../../components/general/LegalLinkButton";
import { termsAndConditionsStyles } from "../../../../components/general/TermsAndConditionsStyles";
import { useRegistrationHandler } from "hooks/useRegistrationHandler";
import { useTermsSelection } from "hooks/useTermsSelection";

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
  const { updateModal } = useModalStore();
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
    <View>
      <Text style={termsAndConditionsStyles.title}>Accept terms and conditions</Text>

      <View style={termsAndConditionsStyles.termsContainer}>
        {acceptTermsList.map((i, idx) => (
          <TermsAndConditionItem
            writeUp={i}
            key={idx}
            isSelected={selectedTerms.includes(idx)}
            handleSelect={() => handleAcceptTerms(idx)}
          />
        ))}
      </View>

      <LegalLinkButton entity="collector" updateModal={updateModal} />

      <View style={termsAndConditionsStyles.buttonsContainer}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
        <FittedBlackButton
          isLoading={isLoading}
          value="Create my account"
          isDisabled={!selectedTerms.includes(0)}
          onClick={handleSubmit}
        />
      </View>
    </View>
  );
}
