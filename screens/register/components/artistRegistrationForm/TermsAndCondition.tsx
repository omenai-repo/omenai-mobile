import { View, Text, Pressable } from "react-native";
import tw from "twrnc";
import { SvgXml } from "react-native-svg";
import { checkedBox, uncheckedBox } from "utils/SvgImages";
import FittedBlackButton from "components/buttons/FittedBlackButton";
import BackFormButton from "components/buttons/BackFormButton";
import { useArtistAuthRegisterStore } from "store/auth/register/ArtistAuthRegisterStore";
import { useModalStore } from "store/modal/modalStore";
import uploadLogo from "screens/galleryProfileScreens/uploadNewLogo/uploadLogo";
import { registerAccount } from "services/register/registerAccount";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { screenName } from "constants/screenNames.constants";
import { storage } from "appWrite_config";
import { useAppStore } from "store/app/appStore";
import LegalLinkButton from "components/general/LegalLinkButton";

const TermsAndCondition = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
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
  const { expoPushToken } = useAppStore();
  const { updateModal } = useModalStore();

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
    if (selectedTerms.includes(id)) {
      setSelectedTerms(selectedTerms.filter((checkId: number) => checkId !== id));
    } else {
      setSelectedTerms([...selectedTerms, id]);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const { name, email, password, address, logo, art_style, phone, base_currency } =
        artistRegisterData;

      if (logo === null) return;

      const files = {
        uri: logo.assets[0].uri,
        name: logo.assets[0].fileName,
        type: logo.assets[0].mimeType,
      };
      const fileUploaded = await uploadLogo(files);

      if (fileUploaded) {
        const payload = {
          name,
          email,
          password,
          logo: fileUploaded.$id,
          address,
          art_style,
          base_currency,
          phone,
          device_push_token: expoPushToken ?? "",
        };

        const results = await registerAccount(payload, "artist");

        if (results?.isOk) {
          clearState();
          navigation.navigate(screenName.verifyEmail, {
            account: { id: results.body.data, type: "artist" },
          });
        } else {
          await storage.deleteFile({
            bucketId: process.env.EXPO_PUBLIC_APPWRITE_LOGO_BUCKET_ID!,
            fileId: fileUploaded.$id,
          });
          updateModal({
            message: results?.body.message,
            modalType: "error",
            showModal: true,
          });
        }
      }
    } catch (error: any) {
      updateModal({
        message: error.message,
        modalType: "error",
        showModal: true,
      });
    } finally {
      setIsLoading(false);
    }
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
