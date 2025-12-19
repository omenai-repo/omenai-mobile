import {
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  Animated,
  Easing,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState, useRef } from "react";
import tw from "twrnc";
import omenaiLogo from "../../assets/omenai-logo.png";
import * as DocumentPicker from "expo-document-picker";
import QuestionContainer from "./QuestionContainer";
import CVUpload from "./CVUpload";
import Socials from "./Socials";
import ConfirmationModal from "./ConfirmationModal";
import OnboardingProgressBar from "./OnboardingProgressBar";
import EditOnboardingModal from "./EditOnboardingModal";
import uploadArtistDoc from "#screens/register/components/artistRegistrationForm/uploadArtistDoc";
import { artistOnboarding } from "#services/artistOnboarding/artistOnbaording";
import { storage } from "#appWrite_config";
import { useModalStore } from "#store/modal/modalStore";
import LoadingContainer from "./LoadingContainer";
import FirstScreen from "./FirstScreen";
import SuccessComp from "./SuccessComp";
import { useAppStore } from "#store/app/appStore";
import { logout } from "#utils/logout.utils";
import CredentialsOverview from "./CredentialsOverview";

const { width, height } = Dimensions.get("window");

export type QuestionKey =
  | "bio"
  | "graduate"
  | "mfa"
  | "solo"
  | "group"
  | "museum_collection"
  | "biennale"
  | "museum_exhibition"
  | "art_fair";

const SOCIAL_KEYS = ["instagram", "twitter", "linkedin", "facebook"] as const;

const INITIAL_ONBOARDING_STATE = {
  bio: "",
  graduate: "",
  mfa: "",
  solo: "",
  group: "",
  museum_collection: "",
  biennale: "",
  museum_exhibition: "",
  art_fair: "",
};

const INITIAL_SOCIALS_STATE = {
  instagram: "",
  twitter: "",
  linkedin: "",
  facebook: "",
};

export const questions: {
  key: QuestionKey;
  text: string;
  options?: string[];
  isNumber?: boolean;
}[] = [
  { key: "bio", text: "Tell us about yourself and your art style?" }, // Open-ended string input
  { key: "graduate", text: "Are you a Graduate?", options: ["Yes", "No"] }, // Yes/No buttons
  {
    key: "mfa",
    text: "If yes, do you own an MFA (Masters in Fine Arts)?",
    options: ["Yes", "No"],
  },
  {
    key: "solo",
    text: "How many solo exhibitions have you done?",
    isNumber: true,
  }, // Numeric input
  {
    key: "group",
    text: "How many group exhibitions have you participated in?",
    isNumber: true,
  }, // Numeric input
  {
    key: "museum_collection",
    text: "Is your artwork in any museum collection?",
    options: ["Yes", "No"],
  },
  {
    key: "biennale",
    text: "Which Biennale have you been a part of?",
    options: ["Venice", "Others", "None"],
  },
  {
    key: "museum_exhibition",
    text: "Has your piece been featured in a museum exhibition?",
    options: ["Yes", "No"],
  },
  {
    key: "art_fair",
    text: "Have you been featured in an art fair by a Gallery?",
    options: ["Yes", "No"],
  },
];

const ArtistOnboarding = () => {
  const { userSession } = useAppStore();
  const id = userSession?.id;
  const { updateModal } = useModalStore();
  const [stage, setStage] = useState<
    "questions" | "cv_upload" | "socials" | "overview"
  >("questions");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [onboardingQuestions, setOnboardingQuestions] = useState<
    Omit<ArtistCategorizationAnswerTypes, "solo" | "group"> & {
      bio: string;
      solo: string;
      group: string;
    }
  >(INITIAL_ONBOARDING_STATE);
  const [cv, setCv] = useState<DocumentPicker.DocumentPickerResult | null>(
    null
  );
  const [documentation, setDocumentation] = useState<{
    cv: string;
    socials: {
      instagram: string;
      twitter: string;
      linkedin: string;
      facebook: string;
    };
  }>({
    cv: "",
    socials: INITIAL_SOCIALS_STATE,
  });

  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingQuestionKey, setEditingQuestionKey] = useState<
    QuestionKey | "cv" | "social" | null
  >(null);

  const [editingSocialKey, setEditingSocialKey] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [screen, setScreen] = useState(1);

  const scrollViewRef = useRef<ScrollView>(null);

  const resetScroll = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const openEditModal = (
    key: QuestionKey | "cv" | "social",
    socialKey?: string
  ) => {
    setEditingQuestionKey(key as QuestionKey);
    setEditingSocialKey(socialKey || null); // Store which social media is being edited
    setIsEditModalVisible(true);
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Animation Values
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Function to Handle Slide Animation
  const animateTransition = (direction: "left" | "right") => {
    animatedValue.setValue(direction === "right" ? width : -width); // Set initial position
    Animated.timing(animatedValue, {
      toValue: 0, // Slide to center
      duration: 1000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  };

  // Handle Answer Selection
  const handleAnswer = (answer: string) => {
    setOnboardingQuestions((prev) => ({
      ...prev,
      [currentQuestion.key]: answer,
    }));
  };

  // Handle Next Button Click
  const handleNext = () => {
    const currentKey = questions[currentQuestionIndex].key;
    const nextIndex = currentQuestionIndex + 1;

    let newIndex = nextIndex;

    // If the current question is "graduate" and the answer is "no", skip "mfa" question
    if (currentKey === "graduate" && onboardingQuestions.graduate === "No") {
      onboardingQuestions.mfa = "No"; // Automatically set MFA to "No"
      newIndex = nextIndex + 1; // Skip to the next question after MFA
    }

    // If all questions are answered, move to the CV upload screen
    if (newIndex >= questions.length) {
      setStage("cv_upload");
    } else {
      setCurrentQuestionIndex(newIndex);
      animateTransition("right");
    }
  };

  // Handle Back Button Click
  const handleBack = () => {
    if (stage === "overview") {
      setStage("socials");
      resetScroll();
      return; // Prevent further execution
    }

    if (stage === "socials") {
      setStage("cv_upload");
      return; // Prevent further execution
    }

    if (stage === "cv_upload") {
      setStage("questions");
      setCurrentQuestionIndex(questions.length - 1); // Go back to last question
      animateTransition("left");
      return; // Prevent further execution
    }

    // Normal question navigation logic
    let newIndex = currentQuestionIndex - 1;
    const previousKey = questions[newIndex]?.key;

    // If the previous question was "mfa" and it was skipped, move back again
    if (previousKey === "mfa" && onboardingQuestions.graduate === "No") {
      newIndex -= 1; // Skip MFA going back
    }

    if (newIndex >= 0) {
      setCurrentQuestionIndex(newIndex);
      animateTransition("left");
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (result.canceled || !result.assets) return;
    setCv(result);
    setDocumentation((prev) => ({ ...prev, cv: result.assets[0].uri }));
  };

  const handleCVUpload = () => {
    if (documentation.cv.trim()) {
      setStage("socials");
    }
  };

  const handleSocials = () => {
    if (hasSocialsFilled()) {
      setStage("overview");
      resetScroll();
    }
  };

  const isNextDisabled = () => {
    if (stage === "questions") {
      return (
        !onboardingQuestions[currentQuestion.key] ||
        (currentQuestion.key === "bio" && !onboardingQuestions.bio.trim())
      );
    }

    if (stage === "cv_upload") {
      return !cv?.assets; // Ensure CV is uploaded
    }

    if (stage === "socials") {
      return !hasSocialsFilled();
    }

    return false;
  };

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const updateSocial = (key: string, value: string) => {
    setDocumentation((prev) => ({
      ...prev,
      socials: { ...prev.socials, [key]: value },
    }));
  };

  const hasSocialsFilled = () => {
    return SOCIAL_KEYS.some((key) => documentation.socials[key]?.trim());
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    if (
      !cv?.assets?.[0]?.uri ||
      !cv.assets?.[0]?.name ||
      !cv.assets?.[0]?.mimeType
    ) {
      return;
    }

    const files = {
      uri: cv.assets[0].uri,
      name: cv.assets[0].name,
      type: cv.assets[0].mimeType,
    };

    const fileUploaded = await uploadArtistDoc(files);

    if (fileUploaded) {
      let file: { bucketId: string; fileId: string } = {
        bucketId: fileUploaded.bucketId,
        fileId: fileUploaded.$id,
      };

      const payload: ArtistCategorizationUpdateDataTypes = {
        answers: {
          art_fair: onboardingQuestions.art_fair.toLowerCase(),
          biennale: onboardingQuestions.biennale.toLowerCase(),
          graduate: onboardingQuestions.graduate.toLowerCase(),
          group: Number(onboardingQuestions.group),
          mfa: onboardingQuestions.mfa.toLowerCase(),
          museum_collection:
            onboardingQuestions.museum_collection.toLowerCase(),
          museum_exhibition:
            onboardingQuestions.museum_exhibition.toLowerCase(),
          solo: Number(onboardingQuestions.solo),
        },
        artist_id: id,
        bio: onboardingQuestions.bio,
        documentation: {
          cv: file.fileId,
          socials: documentation.socials,
        },
      };

      const results = await artistOnboarding(payload);
      console.log({ results });
      setConfirmModal(false);
      if (results?.isOk) {
        const resultsBody = results?.body;
        setOnboardingQuestions(INITIAL_ONBOARDING_STATE);
        setDocumentation({
          cv: "",
          socials: INITIAL_SOCIALS_STATE,
        });
        setScreen(3);
      } else {
        await storage.deleteFile({
          bucketId: process.env.EXPO_PUBLIC_APPWRITE_DOCUMENTATION_BUCKET_ID!,
          fileId: file.fileId,
        });
        updateModal({
          message: results?.body.message,
          modalType: "error",
          showModal: true,
        });
      }
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const getStageTitle = () => {
    switch (stage) {
      case "questions":
        return "Artist Onboarding";
      case "cv_upload":
        return "Upload your CV";
      case "socials":
        return "Upload your Social Handles";
      case "overview":
        return "An overview of your Information";
      default:
        return "";
    }
  };

  const renderStageContent = () => {
    switch (stage) {
      case "questions":
        return (
          <QuestionContainer
            value={String(onboardingQuestions[currentQuestion.key])}
            question={currentQuestion.text}
            onSelect={handleAnswer}
            animatedStyle={{
              transform: [{ translateX: animatedValue }],
            }}
            options={currentQuestion.options}
            isNumber={currentQuestion.isNumber}
          />
        );
      case "cv_upload":
        return <CVUpload cv={cv} pickDocument={pickDocument} />;
      case "socials":
        return (
          <Socials socials={documentation.socials} setSocials={updateSocial} />
        );
      case "overview":
        return (
          <CredentialsOverview
            onboardingQuestions={onboardingQuestions}
            documentationSocials={documentation.socials}
            documentationCv={documentation.cv}
            cvAssets={cv?.assets ?? undefined}
            openSections={openSections}
            toggleSection={toggleSection}
            openEditModal={openEditModal}
            width={width}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {screen === 1 ? (
        <FirstScreen onPress={() => setScreen(2)} />
      ) : screen === 2 ? (
        !isLoading ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={tw`flex-1 bg-[#F7F7F7]`}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              ref={scrollViewRef}
            >
              <View style={tw`mt-[80px] mx-[25px] mb-[60px]`}>
                <View style={tw`flex-row items-center justify-between`}>
                  <Image
                    style={tw`w-[130px] h-[30px]`}
                    resizeMode="contain"
                    source={omenaiLogo}
                  />
                  <Pressable onPress={logout}>
                    <Text style={tw`text-[18px] font-semibold`}>Logout</Text>
                  </Pressable>
                </View>

                <Text
                  style={tw`text-[20px] font-medium text-[#1A1A1A]000] mt-[30px]`}
                >
                  {getStageTitle()}
                </Text>
                <Text
                  style={tw`text-[14px] text-[#1A1A1A]00099] mt-[10px] flex-wrap mr-[40px]`}
                >
                  {stage === "overview"
                    ? "Please review your information to make sure your information is correct."
                    : "Fill in the required information to complete your onboarding."}
                </Text>
              </View>
              <View>{renderStageContent()}</View>

              <OnboardingProgressBar
                stage={stage}
                currentQuestionIndex={currentQuestionIndex}
              />

              <EditOnboardingModal
                isVisible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
                editingKey={editingQuestionKey}
                editingSocialKey={editingSocialKey}
                cv={cv}
                onPickDocument={pickDocument}
                socials={documentation.socials}
                onUpdateSocials={updateSocial}
                onboardingQuestions={onboardingQuestions}
                onUpdateQuestion={(key, value) => {
                  setOnboardingQuestions((prev) => ({
                    ...prev,
                    [key]: value,
                  }));
                }}
              />
              <ConfirmationModal
                isModalVisible={confirmModal}
                setIsModalVisible={setConfirmModal}
                confirmBtn={handleSubmit}
              />
              {/* Navigation Buttons */}

              <View
                style={tw.style(`flex-row gap-[30px] mb-[100px]`, {
                  marginHorizontal: width / 10,
                  top: height / 25,
                })}
              >
                {currentQuestionIndex !== 0 && (
                  <Pressable
                    onPress={handleBack}
                    style={tw.style(
                      `h-[51px] rounded-full bg-[#F7F7F7] justify-center items-center flex-1 border-2 border-[#000000]`
                    )}
                  >
                    <Text style={tw`text-[#1A1A1A]] font-bold text-[14px]`}>
                      Back
                    </Text>
                  </Pressable>
                )}

                <Pressable
                  onPress={() => {
                    if (stage === "questions") {
                      handleNext();
                    } else if (stage === "cv_upload") {
                      handleCVUpload();
                    } else if (stage === "socials") {
                      handleSocials();
                    } else if (stage === "overview") {
                      setConfirmModal(true);
                    }
                  }}
                  disabled={isNextDisabled()}
                  style={tw.style(
                    `h-[51px] rounded-full justify-center items-center flex-1`,
                    isNextDisabled() ? "bg-[#B5B5B5]" : "bg-[#1A1A1A]"
                  )}
                >
                  <Text style={tw`text-white font-bold text-[14px]`}>Next</Text>
                </Pressable>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        ) : (
          <LoadingContainer
            label={
              "This process might take up to minutes, as we’re trying to compile all your onboarding data."
            }
          />
        )
      ) : (
        screen === 3 && <SuccessComp />
      )}
    </>
  );
};

export default ArtistOnboarding;
