import { View, Text, Pressable } from "react-native";
import tw from "twrnc";
import { SvgXml } from "react-native-svg";
import { checkedBox, uncheckedBox } from "utils/SvgImages";
import { useArtistAuthRegisterStore } from "store/auth/register/ArtistAuthRegisterStore";
import { useRegistrationHandler } from "hooks/useRegistrationHandler";
import { useTermsSelection } from "hooks/useTermsSelection";
import { TermsAndConditionsForm } from "components/register/TermsAndConditionsForm";

type CheckboxItemProps = {
  readonly onPress: () => void;
  readonly text: string;
  readonly id: number;
  readonly isSelected: boolean;
};

const CheckboxItem = ({ onPress, text, isSelected }: Readonly<CheckboxItemProps>) => (
  <Pressable onPress={onPress} style={tw`flex-row gap-[15px]`}>
    <SvgXml xml={isSelected ? checkedBox : uncheckedBox} />
    <Text style={tw`text-[14px] text-[#858585] leading-[20px] mr-[30px]`}>{text}</Text>
  </Pressable>
);

const TermsAndCondition = () => {
  const {
    selectedTerms,
    setSelectedTerms,
    pageIndex,
    setPageIndex,
    setIsLoading,
    artistRegisterData,
    clearState,
    isLoading,
  } = useArtistAuthRegisterStore();

  const { handleRegister } = useRegistrationHandler("artist");
  const { handleToggleTerm } = useTermsSelection();

  const checks = [
    {
      id: 0,
      text: "I have read and agree to the terms stated above.",
    },
    {
      id: 1,
      text: "By ticking this box, I accept the Terms of use and Privacy Policy of creating an account with Omenai.",
    },
    {
      id: 2,
      text: "By ticking this box, I agree to subscribing to Omenai’s mailing list and receiving promotional emails.",
    },
  ];

  const handleCheckPress = (id: number) => {
    handleToggleTerm(id, selectedTerms, setSelectedTerms);
  };

  const handleSubmit = () => {
    handleRegister(artistRegisterData, clearState, setIsLoading);
  };

  const isProceedDisabled =
    !selectedTerms.includes(0) || !selectedTerms.includes(2) || !selectedTerms.includes(1);

  const additionalContent = (
    <View style={tw`mb-[20px]`}>
      <Text style={tw`text-[15px] font-semibold text-black mb-[8px]`}>Please note:</Text>
      <View style={tw`ml-[10px]`}>
        <Text style={tw`text-[13px] text-gray-700 leading-[20px] mb-[5px]`}>
          • The platform takes a 35% commission on each artwork sale which covers marketing,
          platform visibility, payment processing, shipping coordination, and customer service.
        </Text>
        <Text style={tw`text-[13px] text-gray-700 leading-[20px]`}>
          • All potential artists on the platform must undergo a mandatory onboarding and
          verification process before accessing core platform features.
        </Text>
      </View>
    </View>
  );

  const customTermsRenderer = (item: any) => (
    <CheckboxItem
      key={item.id}
      id={item.id}
      text={item.text}
      isSelected={selectedTerms.includes(item.id)}
      onPress={() => handleCheckPress(item.id)}
    />
  );

  return (
    <TermsAndConditionsForm
      termsList={checks}
      selectedTerms={selectedTerms}
      onToggleTerm={handleCheckPress}
      onSubmit={handleSubmit}
      onBack={() => setPageIndex(pageIndex - 1)}
      isLoading={isLoading}
      isDisabled={isProceedDisabled}
      entity="artist"
      buttonText="Proceed"
      additionalContent={additionalContent}
      customTermsRenderer={customTermsRenderer}
    />
  );
};

export default TermsAndCondition;
