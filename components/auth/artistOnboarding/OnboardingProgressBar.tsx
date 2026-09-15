import { View } from "react-native";
import React from "react";
import tw from "twrnc";
import { questions } from "./onboardingQuestions";
import { colors } from "#config/colors.config";

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
      style={tw`flex-row justify-between items-center w-full px-1 mb-5 mt-8 gap-1`}
    >
      {questions.map((question, index) => (
        <View
          key={question.key}
          style={tw.style(
            `h-[4px] flex-1 rounded-full`, // Use flex-1 to distribute width evenly
            index <= currentQuestionIndex
              ? `bg-[${colors.black}]`
              : `bg-neutral-200`,
          )}
        />
      ))}

      <View
        style={tw.style(
          `h-[4px] flex-1 rounded-full`, // Use flex-1 to distribute width evenly
          stage === "cv_upload" || stage === "socials"
            ? `bg-[${colors.black}]`
            : `bg-neutral-200`,
        )}
      />

      <View
        style={tw.style(
          `h-[4px] flex-1 rounded-full`, // Use flex-1 to distribute width evenly
          stage === "socials" ? `bg-[${colors.black}]` : `bg-neutral-200`,
        )}
      />
    </View>
  );
};

export default OnboardingProgressBar;
