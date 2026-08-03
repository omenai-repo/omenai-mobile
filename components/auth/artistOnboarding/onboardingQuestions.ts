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

export type OnboardingQuestion = {
  key: QuestionKey;
  text: string;
  options?: string[];
  isNumber?: boolean;
};

export const questions: OnboardingQuestion[] = [
  {
    key: "bio",
    text: "Describe yourself and your art style (This would be publicly visible)",
  },
  {
    key: "graduate",
    text: "Are you a Graduate from an accredited art institution?",
    options: ["Yes", "No"],
  },
  {
    key: "mfa",
    text: "Do you have an MFA (Masters in Fine Arts)?",
    options: ["Yes", "No"],
  },
  {
    key: "solo",
    text: "How many solo exhibitions have you had? (approximate)",
    isNumber: true,
  },
  {
    key: "group",
    text: "How many group exhibitions have you had? (approximate)",
    isNumber: true,
  },
  {
    key: "biennale",
    text: "Which Bienalle have you participated in?",
    options: ["Venice", "Other recognized Biennale events", "None"],
  },
  {
    key: "art_fair",
    text: "Have you been featured in an Art Fair by a gallery?",
    options: ["Yes", "No"],
  },
  {
    key: "museum_exhibition",
    text: "Have your piece been featured in any Museum Exhibition?",
    options: ["Yes", "No"],
  },
  {
    key: "museum_collection",
    text: "Is your work featured in any Museum Collection?",
    options: ["Yes", "No"],
  },
];
