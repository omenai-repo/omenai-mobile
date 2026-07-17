import { View, Text, Pressable } from "react-native";
import tw from "twrnc";
import { SvgXml } from "react-native-svg";
import { checkedBox, uncheckedBox } from "#utils/SvgImages";
import { useArtistAuthRegisterStore } from "#store/auth/register/ArtistAuthRegisterStore";
import { useRegistrationHandler } from "#hooks/useRegistrationHandler";
import { useTermsSelection } from "#hooks/useTermsSelection";
import { TermsAndConditionsForm } from "#components/register/TermsAndConditionsForm";

type CheckboxItemProps = {
  readonly onPress: () => void;
  readonly text: string;
  readonly id: number;
  readonly isSelected: boolean;
};

const CheckboxItem = ({
  onPress,
  text,
  isSelected,
}: Readonly<CheckboxItemProps>) => (
  <Pressable onPress={onPress} style={tw`flex-row items-start gap-[15px]`}>
    <View style={tw`mt-[2px]`}>
      <SvgXml xml={isSelected ? checkedBox : uncheckedBox} />
    </View>
    <Text
      style={tw`text-[14px] font-light text-[#858585] leading-[20px] flex-1`}
    >
      {text}
    </Text>
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
      text: "I have reviewed and accept the terms outlined above",
    },
    {
      id: 1,
      text: "I accept Omenai's Terms of Use and Privacy Policy",
    },
    {
      id: 2,
      text: "I'd like to receive updates, promotions, and news from Omenai (optional)",
    },
  ];

  const handleCheckPress = (id: number) => {
    handleToggleTerm(id, selectedTerms, setSelectedTerms);
  };

  const handleSubmit = () => {
    handleRegister(artistRegisterData, clearState, setIsLoading);
  };

  const isProceedDisabled =
    !selectedTerms.includes(0) || !selectedTerms.includes(1);

  const additionalContent = (
    <View>
      <Text style={tw`text-[14px] my-[16px] font-light text-gray-600`}>
        Review the following terms and confirm your agreement to proceed with
        account creation
      </Text>

      <View
        style={tw`bg-white border border-gray-200 rounded-sm p-[24px] mb-[24px]`}
      >
        <Text style={tw`text-[14px] font-semibold text-black mb-[16px]`}>
          Platform Terms
        </Text>
        <View style={tw`flex-col gap-[12px]`}>
          <View style={tw`flex-row items-start gap-[12px]`}>
            <Text style={tw`text-black font-medium mt-[2px]`}>•</Text>
            <Text style={tw`text-[14px] text-gray-600 flex-1 leading-[20px]`}>
              A 39% commission applies to all artwork sales, covering marketing,
              platform visibility, payment processing, shipping coordination,
              and dedicated customer support.
            </Text>
          </View>
          <View style={tw`flex-row items-start gap-[12px]`}>
            <Text style={tw`text-black font-medium mt-[2px]`}>•</Text>
            <Text style={tw`text-[14px] text-gray-600 flex-1 leading-[20px]`}>
              All artists must complete a verification process before gaining
              access to platform features. This ensures quality and authenticity
              across our creative community.
            </Text>
          </View>
        </View>
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
      buttonText="Create your artist account"
      additionalContent={additionalContent}
      customTermsRenderer={customTermsRenderer}
    />
  );
};

export default TermsAndCondition;
