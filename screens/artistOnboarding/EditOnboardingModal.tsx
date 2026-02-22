import {
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React from "react";
import tw from "twrnc";
import { SvgXml } from "react-native-svg";
import { uploadIcon } from "#utils/SvgImages";
import QuestionContainer from "./QuestionContainer";
import { QuestionKey, questions } from "./ArtistOnboarding";
import * as DocumentPicker from "expo-document-picker";

interface EditOnboardingModalProps {
  isVisible: boolean;
  onClose: () => void;
  editingKey: QuestionKey | "cv" | "social" | null;
  editingSocialKey: string | null;
  cv: DocumentPicker.DocumentPickerResult | null;
  onPickDocument: () => void;
  socials: { [key: string]: string };
  onUpdateSocials: (key: string, value: string) => void;
  onboardingQuestions: any;
  onUpdateQuestion: (key: string, value: string) => void;
}

const EditOnboardingModal: React.FC<EditOnboardingModalProps> = ({
  isVisible,
  onClose,
  editingKey,
  editingSocialKey,
  cv,
  onPickDocument,
  socials,
  onUpdateSocials,
  onboardingQuestions,
  onUpdateQuestion,
}) => {
  const renderEditContent = () => {
    if (editingKey === "cv") {
      return (
        <TouchableOpacity
          onPress={onPickDocument}
          style={tw.style(
            `border border-[#00000033] bg-[#EAE8E8] h-[160px] rounded-[5px] justify-center items-center`
          )}
        >
          {!cv?.assets && <SvgXml xml={uploadIcon} />}
          <Text
            style={tw`text-[12px] text-[#1A1A1A]000] font-medium mt-[15px] text-center mx-[30px]`}
          >
            {cv?.assets ? cv.assets[0].name : "Upload your CV here"}
          </Text>
        </TouchableOpacity>
      );
    }

    if (editingKey === "social" && editingSocialKey) {
      return (
        <>
          <Text
            style={tw`text-[16px] text-[#1A1A1A] font-medium text-center mb-4`}
          >
            Edit {editingSocialKey.toUpperCase()}
          </Text>
          <TextInput
            style={tw`bg-[#F7F7F7] rounded-[20px] h-[50px] p-4 mx-[10px]`}
            placeholder={`Enter your ${editingSocialKey} link`}
            value={socials[editingSocialKey]}
            onChangeText={(text) => onUpdateSocials(editingSocialKey, text)}
          />
        </>
      );
    }

    if (editingKey) {
      const questionDetails = questions.find((q) => q.key === editingKey);
      return (
        <QuestionContainer
          question={questionDetails?.text || ""}
          value={
            editingKey === "social"
              ? ""
              : String(onboardingQuestions[editingKey as QuestionKey])
          }
          onSelect={(answer) => {
            onUpdateQuestion(editingKey as string, answer);
          }}
          animatedStyle={{}}
          isModalVisible={isVisible}
          options={questionDetails?.options}
          isNumber={questionDetails?.isNumber}
        />
      );
    }

    return null;
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        onPressOut={onClose}
        style={tw`flex-1 bg-[#0003] justify-center items-center`}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={tw.style(
            (editingKey === "social" || editingKey === "cv") &&
              `bg-white p-5 rounded-sm w-[90%]`
          )}
        >
          {renderEditContent()}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default EditOnboardingModal;
