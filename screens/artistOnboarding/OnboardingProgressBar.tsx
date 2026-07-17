import { View, Dimensions } from "react-native";
import React from "react";
import tw from "twrnc";
import { questions } from "./ArtistOnboarding";

const { width } = Dimensions.get("window");

interface OnboardingProgressBarProps {
  stage: "questions" | "cv_upload" | "socials" | "overview";
  currentQuestionIndex: number;
}

const OnboardingProgressBar: React.FC<OnboardingProgressBarProps> = ({
  stage,
  currentQuestionIndex,
}) => {
  if (stage === "overview") return null;

  return (
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
      {questions.map((question, index) => (
        <View
          key={question.key}
          style={tw.style(
            `h-[3px] flex-1 mx-[2px] rounded-full`, // Use flex-1 to distribute width evenly
            index <= currentQuestionIndex ? "bg-[#000]" : "bg-[#E0E0E0]"
          )}
        />
      ))}

      <View
        style={tw.style(
          `h-[3px] flex-1 mx-[2px] rounded-full`, // Use flex-1 to distribute width evenly
          stage === "cv_upload" || stage === "socials"
            ? "bg-[#000]"
            : "bg-[#E0E0E0]"
        )}
      />

      <View
        style={tw.style(
          `h-[3px] flex-1 mx-[2px] rounded-full`, // Use flex-1 to distribute width evenly
          stage === "socials" ? "bg-[#000]" : "bg-[#E0E0E0]"
        )}
      />
    </View>
  );
};

export default OnboardingProgressBar;
