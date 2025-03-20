import {
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  Animated,
  Easing,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState, useRef } from "react";
import tw from "twrnc";
import omenaiLogo from "../../assets/omenai-logo.png";
import { SvgXml } from "react-native-svg";
import {
  dropdownIcon,
  dropUpIcon,
  uploadIcon,
  warningIconSm,
} from "utils/SvgImages";
import * as DocumentPicker from "expo-document-picker";
import Input from "components/inputs/Input";
import FittedBlackButton from "components/buttons/FittedBlackButton";

const { width, height } = Dimensions.get("window");

type OnboardingQuestions = {
  bio: string | "";
  graduate: "yes" | "no" | "";
  mfa: "yes" | "no" | "";
  solo: number | "";
  group: number | "";
  museum_collection: "yes" | "no" | "";
  biennale: "Venice Biennale" | "Others" | "None" | "";
  museum_exhibition: "yes" | "no" | "";
  art_fair: "yes" | "no" | "";
};

type QuestionKey =
  | "bio"
  | "graduate"
  | "mfa"
  | "solo"
  | "group"
  | "museum_collection"
  | "biennale"
  | "museum_exhibition"
  | "art_fair";

const questions: { key: QuestionKey; text: string }[] = [
  { key: "bio", text: "Tell us about yourself and your art style?" },
  { key: "graduate", text: "Are you a Graduate?" },
  { key: "mfa", text: "If yes, do you own an MFA (Masters in Fine Arts) ?" },
  { key: "solo", text: "How many solo exhibitions have you done?" },
  {
    key: "group",
    text: "How many group exhibitions have you participated in?",
  },
  {
    key: "museum_collection",
    text: "Is your artwork in any museum collection?",
  },
  { key: "biennale", text: "Which Biennale have you been a part of?" },
  {
    key: "museum_exhibition",
    text: "Has your piece been featured in a museum exhibition?",
  },
  {
    key: "art_fair",
    text: "Have you been featured in an art fair by a Gallery?",
  },
];

const Container = ({
  question,
  value,
  onSelect,
  animatedStyle,
  questionKey,
  isModalVisible,
}: {
  question: string;
  value: string;
  onSelect: (answer: string) => void;
  animatedStyle: any;
  questionKey: QuestionKey;
  isModalVisible?: boolean;
}) => {
  return (
    <Animated.View
      style={[
        tw`border border-[#BDBDBDB2] rounded-[16px] py-[25px] self-center`,
        {
          width: width - 50,
          backgroundColor: isModalVisible ? "#ffff" : "#FFFFFFB5",
        },
        animatedStyle,
      ]}
    >
      <Text
        style={tw`text-[16px] text-[#1A1A1A] font-medium text-center px-[50px]`}
      >
        {question}
      </Text>
      <View style={tw`h-[1px] bg-[#00000033] my-[20px] mx-[40px]`} />

      {/* Conditional Input for Bio, Solo, and Group */}
      {questionKey === "bio" ||
      questionKey === "solo" ||
      questionKey === "group" ? (
        <>
          <TextInput
            style={tw.style(
              `bg-[#F7F7F7] rounded-[20px] pt-[20px] pl-[20px] mx-[30px]`,
              questionKey === "solo" || questionKey === "group"
                ? "py-[15px]"
                : "h-[97px]",
              {
                textAlignVertical: "top",
              }
            )}
            multiline={questionKey === "bio"}
            keyboardType={
              questionKey === "solo" || questionKey === "group"
                ? "numeric"
                : "default"
            }
            placeholder={
              questionKey === "bio" ? "Write about yourself..." : "Enter number"
            }
            value={value}
            onChangeText={onSelect}
          />
          {questionKey === "bio" &&
            (() => {
              const wordCount = value
                .trim()
                .split(/\s+/)
                .filter((word) => word !== "").length;
              const isLimitExceeded = wordCount > 250;

              return (
                <View>
                  <Text
                    style={tw.style(
                      `text-[12px] text-right mr-[30px] mt-[5px]`,
                      isLimitExceeded ? "text-[#FF0000]" : "text-[#00000080]"
                    )}
                  >
                    {wordCount}/250 words
                  </Text>

                  {/* Warning Message */}
                  {isLimitExceeded && (
                    <Text
                      style={tw`text-[12px] text-[#FF0000] text-center mt-[5px]`}
                    >
                      You have exceeded the word limit!
                    </Text>
                  )}
                </View>
              );
            })()}
        </>
      ) : questionKey === "biennale" ? ( // Updated: Special handling for Biennale
        <View>
          {["Venice Biennale", "Others", "None"].map((option) => (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              style={tw.style(
                `py-[10px] justify-center items-center rounded-[20px] mx-[35px]`,
                value === option && "bg-[#1A1A1A]"
              )}
            >
              <Text
                style={tw.style(
                  `text-[16px]`,
                  value === option && "text-[#FFFFFF]"
                )}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : (
        // Yes/No Buttons for other questions
        <View>
          <Pressable
            onPress={() => onSelect("yes")}
            style={tw.style(
              `py-[10px] justify-center items-center rounded-[20px] mx-[35px]`,
              value === "yes" && "bg-[#1A1A1A]"
            )}
          >
            <Text
              style={tw.style(
                `text-[16px]`,
                value === "yes" && "text-[#FFFFFF]"
              )}
            >
              Yes
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onSelect("no")}
            style={tw.style(
              `py-[10px] justify-center items-center rounded-[20px] mx-[35px]`,
              value === "no" && "bg-[#1A1A1A]"
            )}
          >
            <Text
              style={tw.style(
                `text-[16px]`,
                value === "no" && "text-[#FFFFFF]"
              )}
            >
              No
            </Text>
          </Pressable>
        </View>
      )}
    </Animated.View>
  );
};

const OverviewContainer = ({
  title,
  data,
  open,
  setOpen,
  index,
  openModal,
}: {
  title: string;
  data: string;
  open: boolean;
  setOpen: () => void;
  index: string;
  openModal: () => void;
}) => {
  return (
    <View
      style={tw.style(
        `border-t-[1px] border-l-[1px] border-r-[1px] border-[#0000001A] bg-[#fff] p-[15px]`,
        index === "bio" && "rounded-t-[15px]",
        index === "CV Document" && "rounded-b-[15px] border-b-[1px]"
      )}
    >
      <View style={tw`flex-row items-center`}>
        <Text style={tw`text-[15px] text-[#454545] font-bold flex-1`}>
          {title}
        </Text>
        <Pressable
          onPress={setOpen}
          style={tw`border border-[#F6F6F6] bg-[#F6F6F6] justify-center items-center h-[35px] w-[35px] rounded-[8px]`}
        >
          <SvgXml xml={open ? dropUpIcon : dropdownIcon} />
        </Pressable>
      </View>

      <Text style={tw`text-[13px] text-[#00000080] font-semibold mt-[3px]`}>
        Your answer: {data}
      </Text>

      {/* Display data when expanded */}
      {open && (
        <Pressable
          onPress={openModal}
          style={tw`h-[45px] rounded-full bg-[#1A1A1A] justify-center items-center mt-[10px]`}
        >
          <Text style={tw`text-white font-bold text-[14px]`}>Edit</Text>
        </Pressable>
      )}
    </View>
  );
};

const ArtistOnboarding = () => {
  const [stage, setStage] = useState<
    "questions" | "cv_upload" | "socials" | "overview"
  >("questions");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [onboardingQuestions, setOnboardingQuestions] =
    useState<OnboardingQuestions>({
      bio: "",
      graduate: "",
      mfa: "",
      solo: "",
      group: "",
      museum_collection: "",
      biennale: "",
      museum_exhibition: "",
      art_fair: "",
    });
  const [cv, setCv] = useState<DocumentPicker.DocumentPickerResult | null>(
    null
  );
  const [documentation, setDocumentation] = useState<{
    cv: string;
    socials: { [key: string]: string };
  }>({
    cv: "",
    socials: {
      instagram: "",
      twitter: "",
      linkedin: "",
      facebook: "",
    },
  });

  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingQuestionKey, setEditingQuestionKey] = useState<
    QuestionKey | "cv" | "social" | null
  >(null);

  const [editingSocialKey, setEditingSocialKey] = useState<string | null>(null);

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
    if (currentKey === "graduate" && onboardingQuestions.graduate === "no") {
      onboardingQuestions.mfa = "no"; // Automatically set MFA to "No"
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

  const handleBack = () => {
    if (stage === "overview") {
      setStage("socials");
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
    if (previousKey === "mfa" && onboardingQuestions.graduate === "no") {
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
    if (
      documentation.socials.instagram.trim() ||
      documentation.socials.facebook.trim() ||
      documentation.socials.linkedin.trim() ||
      documentation.socials.twitter.trim()
    ) {
      setStage("overview");
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
      const { instagram, facebook, linkedin, twitter } = documentation.socials;
      return (
        !instagram.trim() &&
        !facebook.trim() &&
        !linkedin.trim() &&
        !twitter.trim()
      );
      // Button will be disabled ONLY if all fields are empty
    }

    return false;
  };

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1 bg-[#F7F7F7]`}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`mt-[80px] ml-[25px] mb-[60px]`}>
          <Image
            style={tw`w-[130px] h-[30px]`}
            resizeMode="contain"
            source={omenaiLogo}
          />

          <Text style={tw`text-[20px] font-medium text-[#000000] mt-[30px]`}>
            {stage === "questions"
              ? "Artist Onboarding"
              : stage === "cv_upload"
              ? "Upload your CV"
              : stage === "socials"
              ? "Upload your Social Handles"
              : stage === "overview" && "An overview of your Information"}
          </Text>
          <Text
            style={tw`text-[14px] text-[#00000099] mt-[10px] flex-wrap mr-[40px]`}
          >
            {stage === "overview"
              ? "Please review your information to make sure your information is correct."
              : "Fill in required details to verify your information & determine your skill level."}
          </Text>
        </View>
        <View>
          {stage === "questions" ? (
            <Container
              value={String(
                onboardingQuestions[currentQuestion.key as QuestionKey]
              )}
              question={currentQuestion.text}
              onSelect={handleAnswer}
              animatedStyle={{ transform: [{ translateX: animatedValue }] }}
              questionKey={currentQuestion.key}
            />
          ) : stage === "cv_upload" ? (
            <View>
              <TouchableOpacity
                onPress={pickDocument}
                style={tw.style(
                  `border border-[#00000033] bg-[#EAE8E8] h-[160px] rounded-[5px] justify-center items-center`,
                  {
                    marginHorizontal: width / 12,
                  }
                )}
              >
                {!cv?.assets && <SvgXml xml={uploadIcon} />}

                <Text
                  style={tw`text-[12px] text-[#000000] font-medium mt-[15px] text-center mx-[30px]`}
                >
                  {cv?.assets
                    ? cv.assets[0].name.length > 40
                      ? cv.assets[0].name.slice(0, 40)
                      : cv.assets[0].name
                    : "Upload your CV here"}
                </Text>
              </TouchableOpacity>

              {/* Warning Box */}
              <View
                style={tw.style(
                  `border border-[#FFA500] mt-[20px] flex-row items-center gap-[10px] bg-[#FFF3E0] rounded-[8px] p-[15px]`,
                  {
                    marginHorizontal: width / 12,
                  }
                )}
              >
                <SvgXml xml={warningIconSm} />
                <Text
                  style={tw`text-[14px] text-[#FFA500] font-medium pr-[30px]`}
                >
                  Please ensure your CV aligns with the answers you provided in
                  the last sections
                </Text>
              </View>
            </View>
          ) : stage === "socials" ? (
            <View
              style={tw.style(`gap-[20px] mb-[50px]`, {
                marginHorizontal: width / 15,
              })}
            >
              <Input
                label="Instagram"
                keyboardType="default"
                onInputChange={(text) =>
                  setDocumentation((prev) => ({
                    ...prev,
                    socials: {
                      ...prev.socials,
                      instagram: text,
                    },
                  }))
                }
                placeHolder="Input your Instagram profile here"
                value={documentation.socials.instagram}
              />
              <Input
                label="Facebook"
                keyboardType="default"
                onInputChange={(text) =>
                  setDocumentation((prev) => ({
                    ...prev,
                    socials: {
                      ...prev.socials,
                      facebook: text,
                    },
                  }))
                }
                placeHolder="Input your facebook profile here"
                value={documentation.socials.facebook}
              />
              <Input
                label="Linkedin"
                keyboardType="default"
                onInputChange={(text) =>
                  setDocumentation((prev) => ({
                    ...prev,
                    socials: {
                      ...prev.socials,
                      linkedin: text,
                    },
                  }))
                }
                placeHolder="Input your linkedin profile here"
                value={documentation.socials.linkedin}
              />
              <Input
                label="X (Twitter)"
                keyboardType="default"
                onInputChange={(text) =>
                  setDocumentation((prev) => ({
                    ...prev,
                    socials: {
                      ...prev.socials,
                      twitter: text,
                    },
                  }))
                }
                placeHolder="Input your x profile here"
                value={documentation.socials.twitter}
              />
            </View>
          ) : (
            stage === "overview" && (
              <View
                style={tw.style(
                  `bg-[#fff] border border-[#E7E7E7] rounded-[23px] p-[20px]`,
                  {
                    marginHorizontal: width / 18,
                  }
                )}
              >
                {/* Map through onboarding questions */}
                {Object.entries(onboardingQuestions)
                  .filter(
                    ([_, value]) =>
                      typeof value === "string" && value.trim() !== ""
                  )
                  .map(([key, value]) => {
                    // Find the corresponding question text
                    const questionText =
                      questions.find((q) => q.key === key)?.text || key;

                    return (
                      <OverviewContainer
                        key={key}
                        index={key}
                        title={questionText} // Use the actual question text
                        data={String(value)}
                        open={openSections[key]}
                        setOpen={() => toggleSection(key)}
                        openModal={() => openEditModal(key as QuestionKey)}
                      />
                    );
                  })}

                {/* Map through documentation */}
                {Object.entries(documentation.socials)
                  .filter(([_, value]) => value.trim() !== "")
                  .map(([key, value]) => (
                    <OverviewContainer
                      key={key}
                      index={key}
                      title={key.toUpperCase()}
                      data={value}
                      open={openSections[key]}
                      setOpen={() => toggleSection(key)}
                      openModal={() => openEditModal("social", key)}
                    />
                  ))}

                {/* CV Section */}
                {documentation.cv && (
                  <OverviewContainer
                    index={"CV Document"}
                    title="CV Document"
                    data={cv?.assets ? cv.assets[0].name : ""}
                    open={openSections["cv"]}
                    setOpen={() => toggleSection("cv")}
                    openModal={() => openEditModal("cv")}
                  />
                )}
              </View>
            )
          )}

          {(stage === "questions" ||
            stage === "cv_upload" ||
            stage === "socials") && (
            <View
              style={tw.style(
                `flex-row justify-center items-center self-center absolute`,
                {
                  top: -30,
                  width: width - 50, // Fill screen width with 20px margin on each side
                  marginHorizontal: 20, // Add 20px margin on left and right
                }
              )}
            >
              {/* Progress indicators for questions */}
              {questions.map((_, index) => (
                <View
                  key={index}
                  style={tw.style(
                    `h-[3px] flex-1 mx-[2px] rounded-full`, // Use flex-1 to distribute width evenly
                    index <= currentQuestionIndex ? "bg-[#000]" : "bg-[#E0E0E0]"
                  )}
                />
              ))}

              {/* Progress indicator for CV step */}
              <View
                style={tw.style(
                  `h-[3px] flex-1 mx-[2px] rounded-full`, // Use flex-1 to distribute width evenly
                  stage === "cv_upload" || stage === "socials"
                    ? "bg-[#000]"
                    : "bg-[#E0E0E0]"
                )}
              />
              {/* Progress indicator for Social step */}
              <View
                style={tw.style(
                  `h-[3px] flex-1 mx-[2px] rounded-full`, // Use flex-1 to distribute width evenly
                  stage === "socials" ? "bg-[#000]" : "bg-[#E0E0E0]"
                )}
              />
            </View>
          )}
        </View>

        <Modal
          visible={isEditModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsEditModalVisible(false)}
        >
          <Pressable
            onPressOut={() => setIsEditModalVisible(false)}
            style={tw`flex-1 bg-[#0003] justify-center items-center`}
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={tw.style(
                (editingQuestionKey === "social" ||
                  editingQuestionKey === "cv") &&
                  `bg-white p-5 rounded-lg w-[90%]`
              )}
            >
              {editingQuestionKey === "cv" ? (
                <>
                  {/* CV Upload Section */}
                  <TouchableOpacity
                    onPress={pickDocument}
                    style={tw.style(
                      `border border-[#00000033] bg-[#EAE8E8] h-[160px] rounded-[5px] justify-center items-center`
                    )}
                  >
                    {!cv?.assets && <SvgXml xml={uploadIcon} />}
                    <Text
                      style={tw`text-[12px] text-[#000000] font-medium mt-[15px] text-center mx-[30px]`}
                    >
                      {cv?.assets ? cv.assets[0].name : "Upload your CV here"}
                    </Text>
                  </TouchableOpacity>

                  {/* <Pressable
                    onPress={() => setIsEditModalVisible(false)}
                    style={tw`mt-4 bg-[#1A1A1A] py-2 rounded-lg`}
                  >
                    <Text style={tw`text-white text-center`}>Close</Text>
                  </Pressable> */}
                </>
              ) : editingQuestionKey === "social" && editingSocialKey ? (
                <>
                  {/* Edit Specific Social Media */}
                  <Text
                    style={tw`text-[16px] text-[#1A1A1A] font-medium text-center mb-4`}
                  >
                    Edit {editingSocialKey.toUpperCase()}
                  </Text>
                  <TextInput
                    style={tw`bg-[#F7F7F7] rounded-[20px] h-[50px] p-4 mx-[10px]`}
                    placeholder={`Enter your ${editingSocialKey} link`}
                    value={documentation.socials[editingSocialKey]}
                    onChangeText={(text) => {
                      setDocumentation((prev) => ({
                        ...prev,
                        socials: { ...prev.socials, [editingSocialKey]: text },
                      }));
                    }}
                  />

                  {/* <Pressable
                    onPress={() => setIsEditModalVisible(false)}
                    style={tw`mt-4 bg-[#1A1A1A] py-2 rounded-lg`}
                  >
                    <Text style={tw`text-white text-center`}>Close</Text>
                  </Pressable> */}
                </>
              ) : (
                /* Default Container for Questions */
                editingQuestionKey && (
                  <Container
                    question={
                      questions.find((q) => q.key === editingQuestionKey)
                        ?.text || ""
                    }
                    value={
                      editingQuestionKey === "social"
                        ? ""
                        : String(
                            onboardingQuestions[
                              editingQuestionKey as QuestionKey
                            ]
                          )
                    }
                    onSelect={(answer) => {
                      setOnboardingQuestions((prev) => ({
                        ...prev,
                        [editingQuestionKey]: answer,
                      }));
                    }}
                    animatedStyle={{}} // No need for animation inside the modal
                    questionKey={editingQuestionKey as QuestionKey}
                    isModalVisible={isEditModalVisible}
                  />
                )
              )}
            </Pressable>
          </Pressable>
        </Modal>
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
              <Text style={tw`text-[#000] font-bold text-[14px]`}>Back</Text>
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
  );
};

export default ArtistOnboarding;
