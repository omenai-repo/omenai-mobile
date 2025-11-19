import { View } from "react-native";
import tw from "twrnc";
import BackFormButton from "components/buttons/BackFormButton";
import FittedBlackButton from "components/buttons/FittedBlackButton";

type AddressVerificationActionsProps = {
  readonly isLoading: boolean;
  readonly isDisabled: boolean;
  readonly onBack: () => void;
  readonly onSubmit: () => void;
  readonly buttonText?: string;
};

export const AddressVerificationActions = ({
  isLoading,
  isDisabled,
  onBack,
  onSubmit,
  buttonText = "Verify Address",
}: Readonly<AddressVerificationActionsProps>) => {
  return (
    <View style={tw`flex-row mt-10 justify-between items-center`}>
      <BackFormButton handleBackClick={onBack} />
      <FittedBlackButton
        isLoading={isLoading}
        value={buttonText}
        isDisabled={isDisabled}
        onClick={onSubmit}
        style={tw`h-11`}
      />
    </View>
  );
};
