import { Text, View } from "react-native";
import FittedBlackButton from "components/buttons/FittedBlackButton";
import BackFormButton from "components/buttons/BackFormButton";
import TermsAndConditionItem from "components/general/TermsAndConditionItem";
import { useModalStore } from "store/modal/modalStore";
import LegalLinkButton from "components/general/LegalLinkButton";
import { termsAndConditionsStyles } from "components/general/TermsAndConditionsStyles";
import tw from "twrnc";

interface TermItem {
  id: number;
  text: string;
}

interface TermsAndConditionsFormProps {
  termsList: TermItem[] | string[];
  selectedTerms: number[];
  onToggleTerm: (index: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  entity: "collector" | "gallery" | "artist";
  buttonText?: string;
  hideBackButton?: boolean;
  customTermsRenderer?: (item: TermItem | string, index: number) => React.ReactNode;
  additionalContent?: React.ReactNode;
}

export const TermsAndConditionsForm = ({
  termsList,
  selectedTerms,
  onToggleTerm,
  onSubmit,
  onBack,
  isLoading,
  isDisabled,
  entity,
  buttonText = "Create my account",
  hideBackButton = false,
  customTermsRenderer,
  additionalContent,
}: TermsAndConditionsFormProps) => {
  const { updateModal } = useModalStore();

  return (
    <View>
      <Text style={termsAndConditionsStyles.title}>Accept terms and conditions</Text>

      {additionalContent}

      <View style={termsAndConditionsStyles.termsContainer}>
        {termsList.map((item, idx) => {
          const key = `term-${Date.now()}-${idx}`;
          if (customTermsRenderer) {
            return <View key={key}>{customTermsRenderer(item, idx)}</View>;
          }
          return (
            <TermsAndConditionItem
              writeUp={typeof item === "string" ? item : item.text}
              key={key}
              isSelected={selectedTerms.includes(idx)}
              handleSelect={() => onToggleTerm(idx)}
            />
          );
        })}
      </View>

      <LegalLinkButton entity={entity} updateModal={updateModal} />

      <View style={termsAndConditionsStyles.buttonsContainer}>
        {!hideBackButton && <BackFormButton handleBackClick={onBack} disabled={isLoading} />}
        <FittedBlackButton
          isLoading={isLoading}
          value={buttonText}
          isDisabled={isDisabled}
          onClick={onSubmit}
          style={hideBackButton && tw`w-full`}
        />
      </View>
    </View>
  );
};
