import { Text, View } from "react-native";
import { acceptTermsList } from "../../../../constants/accetTerms.constants";
import TermsAndConditionItem from "../../../../components/general/TermsAndConditionItem";
import FittedBlackButton from "../../../../components/buttons/FittedBlackButton";
import BackFormButton from "../../../../components/buttons/BackFormButton";
import { useGalleryAuthRegisterStore } from "../../../../store/auth/register/GalleryAuthRegisterStore";
import { useModalStore } from "store/modal/modalStore";
import LegalLinkButton from "../../../../components/general/LegalLinkButton";
import { termsAndConditionsStyles } from "../../../../components/general/TermsAndConditionsStyles";
import tw from "twrnc";
import { useRegistrationHandler } from "hooks/useRegistrationHandler";
import { useTermsSelection } from "hooks/useTermsSelection";

export default function TermsAndConditions({
  hideBackButton = false,
}: {
  hideBackButton?: boolean;
}) {
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

  const { updateModal } = useModalStore();
  const { handleRegister } = useRegistrationHandler("gallery");
  const { handleToggleTerm } = useTermsSelection();

  const handleSubmit = () => {
    handleRegister(galleryRegisterData, clearState, setIsLoading);
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

      <LegalLinkButton entity="gallery" updateModal={updateModal} />

      <View style={termsAndConditionsStyles.buttonsContainer}>
        {!hideBackButton && <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />}
        <FittedBlackButton
          isLoading={isLoading}
          value="Create my account"
          isDisabled={!selectedTerms.includes(0)}
          onClick={handleSubmit}
          style={hideBackButton && tw`w-full`}
        />
      </View>
    </View>
  );
}
