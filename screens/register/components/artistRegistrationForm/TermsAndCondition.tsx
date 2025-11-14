import { View, Text, Pressable } from "react-native";
import tw from "twrnc";
import { SvgXml } from "react-native-svg";
import { checkedBox, uncheckedBox } from "utils/SvgImages";
import FittedBlackButton from "components/buttons/FittedBlackButton";
import BackFormButton from "components/buttons/BackFormButton";
import { useArtistAuthRegisterStore } from "store/auth/register/ArtistAuthRegisterStore";
import { useModalStore } from "store/modal/modalStore";
import LegalLinkButton from "components/general/LegalLinkButton";
import { useRegistrationHandler } from "hooks/useRegistrationHandler";
import { useTermsSelection } from "hooks/useTermsSelection";

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
  const { updateModal } = useModalStore();
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

  const Conatiner = ({ onPress, text, id }: { onPress: () => void; text: string; id: number }) => (
    <Pressable onPress={onPress} style={tw`flex-row gap-[15px]`}>
      <SvgXml xml={selectedTerms.includes(id) ? checkedBox : uncheckedBox} />
      <Text style={tw`text-[14px] text-[#858585] leading-[20px] mr-[30px]`}>{text}</Text>
    </Pressable>
  );

  const isProceedDisabled =
    !selectedTerms.includes(0) || !selectedTerms.includes(2) || !selectedTerms.includes(1);

  return (
    <View>
      <Text style={tw`text-[16px] font-semibold mb-[20px]`}>Accept terms and conditions</Text>

      {/* ⬇️ Informational Section */}
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

      {/* ⬇️ Checkboxes */}
      <View
        style={tw`border-[0.96px] border-[#E0E0E0] bg-[#FAFAFA] rounded-[8px] px-3 py-4 gap-2.5`}
      >
        {checks.map((item) => (
          <Conatiner
            key={item.id}
            id={item.id}
            text={item.text}
            onPress={() => handleCheckPress(item.id)}
          />
        ))}
      </View>

      <LegalLinkButton entity="artist" updateModal={updateModal} />

      {/* ⬇️ Navigation Buttons */}
      <View style={tw`flex-row mt-[40px] justify-between items-center`}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} disabled={isLoading} />
        <FittedBlackButton
          isLoading={isLoading}
          value="Proceed"
          isDisabled={isProceedDisabled}
          onClick={handleSubmit}
        />
      </View>
    </View>
  );
};

export default TermsAndCondition;
