import { Text, View } from "react-native";
import FittedBlackButton from "../../../../components/buttons/FittedBlackButton";
import BackFormButton from "../../../../components/buttons/BackFormButton";
import { acceptTermsList } from "../../../../constants/accetTerms.constants";
import { useIndividualAuthRegisterStore } from "../../../../store/auth/register/IndividualAuthRegisterStore";
import { registerAccount } from "../../../../services/register/registerAccount";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import TermsAndConditionItem from "../../../../components/general/TermsAndConditionItem";
import { screenName } from "../../../../constants/screenNames.constants";
import { useModalStore } from "store/modal/modalStore";
import { useAppStore } from "store/app/appStore";
import LegalLinkButton from "../../../../components/general/LegalLinkButton";
import { termsAndConditionsStyles } from "../../../../components/general/TermsAndConditionsStyles";

export default function TermsAndConditions() {
  const navigation = useNavigation<StackNavigationProp<any>>();
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
  const { expoPushToken } = useAppStore();

  const handleSubmit = async () => {
    setIsLoading(true);

    const data: Omit<IndividualRegisterData, "confirmPassword"> & {
      preferences: string[];
      device_push_token: string;
    } = {
      ...individualRegisterData,
      preferences,
      device_push_token: expoPushToken ?? "",
    };

    const results = await registerAccount(data, "individual");
    if (results?.isOk) {
      const resultsBody = results?.body;
      clearState();
      navigation.navigate(screenName.verifyEmail, {
        account: { id: resultsBody.data, type: "individual" },
      });
    } else {
      updateModal({
        message: results?.body.message,
        modalType: "error",
        showModal: true,
      });
    }

    setIsLoading(false);
  };

  const handleAcceptTerms = (index: number) => {
    if (selectedTerms.includes(index)) {
      setSelectedTerms(
        selectedTerms.filter((selectedTab) => selectedTab !== index)
      );
    } else {
      setSelectedTerms([...selectedTerms, index]);
    }
  };


  return (
    <View style={{ marginTop: 20 }}>
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
        <View style={{ flex: 1 }} />
        <FittedBlackButton
          isLoading={isLoading}
          height={50}
          value="Create my account"
          isDisabled={!selectedTerms.includes(0)}
          onClick={handleSubmit}
        />
      </View>
    </View>
  );
}
