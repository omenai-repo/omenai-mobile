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
} from "react-native";
import React, { useState, useRef } from "react";
import tw from "twrnc";
import omenaiLogo from "../../assets/omenai-logo.png";
import { SvgXml } from "react-native-svg";
import { dropdownIcon, dropUpIcon, uploadIcon } from "utils/SvgImages";
import * as DocumentPicker from "expo-document-picker";
import Input from "components/inputs/Input";

const { width, height } = Dimensions.get("window");

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
  { key: "biennale", text: "Have you been a part of the Venice Biennale ?" },
  {
    key: "museum_exhibition",
    text: "Has your piece been featured in a museum exhibition?",
  },
  {
    key: "art_fair",
    text: "Have you been featured in an art fair by a Gallery ?",
  },
];

const Container = ({
  question,
  value,
  onSelect,
  animatedStyle,
  questionKey,
}: {
  question: string;
  value: string;
  onSelect: (answer: string) => void;
  animatedStyle: any;
  questionKey: QuestionKey;
}) => {
  return (
    <Animated.View
      style={[
        tw`border border-[#BDBDBDB2] bg-[#FFFFFFB5] rounded-[16px] py-[25px]`,
        { marginHorizontal: width / 9 },
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
        <TextInput
          style={tw.style(
            `bg-[#F7F7F7] rounded-[20px] pt-[20px] pl-[20px] mx-[30px]`,
            questionKey === "solo" || questionKey === "group"
              ? "py-[15px]"
              : "h-[97px]"
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
}: {
  title: string;
  data: string;
  open: boolean;
  setOpen: () => void;
  index: string;
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
  const [onboardingQuestions, setOnboardingQuestions] = useState({
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
  const [documentation, setDocumentation] = useState({
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
              value={onboardingQuestions[currentQuestion.key as QuestionKey]}
              question={currentQuestion.text}
              onSelect={handleAnswer}
              animatedStyle={{ transform: [{ translateX: animatedValue }] }}
              questionKey={currentQuestion.key}
            />
          ) : stage === "cv_upload" ? (
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
          ) : stage === "socials" ? (
            <View
              style={tw.style(`gap-[20px]`, {
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
                  .filter(([_, value]) => value.trim() !== "")
                  .map(([key, value]) => {
                    // Find the corresponding question text
                    const questionText =
                      questions.find((q) => q.key === key)?.text || key;

                    return (
                      <OverviewContainer
                        key={key}
                        index={key}
                        title={questionText} // Use the actual question text
                        data={value}
                        open={openSections[key]}
                        setOpen={() => toggleSection(key)}
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
                    />
                  ))}

                {/* CV Section */}
                {documentation.cv && (
                  <OverviewContainer
                    index={"CV Document"}
                    title="CV Document"
                    data={documentation.cv}
                    open={openSections["cv"]}
                    setOpen={() => toggleSection("cv")}
                  />
                )}
              </View>
            )
          )}

          {stage === "questions" && (
            <View
              style={tw.style(
                `flex-row justify-center items-center self-center absolute`,
                {
                  top: height / 2.5,
                }
              )}
            >
              {questions.map((_, index) => (
                <View
                  key={index}
                  style={tw.style(
                    `h-[3px] w-[20px] mx-[2px] rounded-full`,
                    index <= currentQuestionIndex ? "bg-[#000]" : "bg-[#E0E0E0]"
                  )}
                />
              ))}
            </View>
          )}

          {/* Navigation Buttons */}
          {stage !== "overview" && (
            <View
              style={tw.style(`flex-row gap-[30px] absolute`, {
                marginHorizontal: width / 10,
                top: height / 2,
              })}
            >
              {currentQuestionIndex !== 0 && (
                <Pressable
                  onPress={handleBack}
                  style={tw.style(
                    `h-[51px] rounded-full justify-center items-center flex-1 border-2 border-[#000000]`
                  )}
                >
                  <Text style={tw`text-[#000] font-bold text-[14px]`}>
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
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ArtistOnboarding;
